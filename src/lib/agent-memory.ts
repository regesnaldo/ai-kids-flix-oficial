/**
 * agent-memory.ts — Serviço de memória persistente multi-agente.
 *
 * Permite que agentes AI armazenem, recuperem e compartilhem memórias
 * contextuais sobre o usuário, criando uma experiência narrativa
 * verdadeiramente persistente.
 *
 * Arquitetura:
 *   agent-memory.ts → Drizzle ORM → agent_memories (TiDB Cloud)
 *
 * Limites:
 *   - Máximo 200 memórias por par (usuário, agente)
 *   - TTL padrão de 90 dias
 *   - Memórias expiradas são ignoradas na leitura
 */

import { eq, and, desc, lt, sql, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  agentMemories,
  type AgentMemory,
  type NewAgentMemory,
  type MemoryType,
} from "@/lib/db/schema";
import { logger } from "@/lib/logger";

// ─── Constantes ───────────────────────────────────────────────────────────────

const MAX_MEMORIES_PER_USER_AGENT = 200;
const DEFAULT_TTL_DAYS = 90;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function computeExpiresAt(ttlDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + ttlDays);
  return d;
}

// ─── API Pública ──────────────────────────────────────────────────────────────

/**
 * Armazena uma nova memória para um agente.
 *
 * @returns A memória criada ou null se o limite foi atingido
 */
export async function storeMemory(params: {
  userId: number;
  agentId: string;
  memoryType: MemoryType;
  content: string;
  emotionalWeight?: number;
  tags?: string[];
  contexto?: Record<string, unknown>;
  ttlDays?: number;
}): Promise<AgentMemory | null> {
  const db = getDb();

  // Verifica limite de memórias
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(agentMemories)
    .where(
      and(
        eq(agentMemories.userId, params.userId),
        eq(agentMemories.agentId, params.agentId),
      ),
    );

  const currentCount = countResult[0]?.count ?? 0;
  if (currentCount >= MAX_MEMORIES_PER_USER_AGENT) {
    // Remove a memória mais antiga e menos acessada
    const oldest = await db
      .select({ id: agentMemories.id })
      .from(agentMemories)
      .where(
        and(
          eq(agentMemories.userId, params.userId),
          eq(agentMemories.agentId, params.agentId),
        ),
      )
      .orderBy(agentMemories.accessCount, agentMemories.createdAt)
      .limit(1);

    if (oldest[0]) {
      await db.delete(agentMemories).where(eq(agentMemories.id, oldest[0].id));
    }
  }

  const ttlDays = params.ttlDays ?? DEFAULT_TTL_DAYS;
  const memory: NewAgentMemory = {
    id: generateId(),
    userId: params.userId,
    agentId: params.agentId,
    memoryType: params.memoryType,
    content: params.content,
    emotionalWeight: String(params.emotionalWeight ?? 0),
    tags: params.tags ?? [],
    contexto: params.contexto ?? {},
    ttlDays,
    expiresAt: computeExpiresAt(ttlDays),
    accessCount: 0,
    createdAt: new Date(),
  };

  try {
    await db.insert(agentMemories).values(memory);
    return memory as AgentMemory;
  } catch (err) {
    logger.error("Falha ao armazenar memória do agente", {
      userId: params.userId,
      agentId: params.agentId,
      error: String(err),
    });
    return null;
  }
}

/**
 * Recupera memórias de um agente para um usuário.
 * Memórias expiradas são automaticamente ignoradas.
 *
 * @param limit  Máximo de memórias a retornar (padrão 10)
 */
export async function getMemories(params: {
  userId: number;
  agentId: string;
  memoryType?: MemoryType;
  limit?: number;
}): Promise<AgentMemory[]> {
  const db = getDb();
  const now = new Date();
  const limit = params.limit ?? 10;

  const conditions = [
    eq(agentMemories.userId, params.userId),
    eq(agentMemories.agentId, params.agentId),
  ];

  // Ignora memórias expiradas
  conditions.push(
    sql`(${agentMemories.expiresAt} IS NULL OR ${agentMemories.expiresAt} > ${now})`,
  );

  if (params.memoryType) {
    conditions.push(eq(agentMemories.memoryType, params.memoryType));
  }

  try {
    const rows = await db
      .select()
      .from(agentMemories)
      .where(and(...conditions))
      .orderBy(desc(agentMemories.emotionalWeight), desc(agentMemories.accessCount))
      .limit(limit);

    // Atualiza accessCount e lastAccessAt nas memórias recuperadas
    if (rows.length > 0) {
      const ids = rows.map((r: { id: string }) => r.id);
      await db
        .update(agentMemories)
        .set({
          accessCount: sql`${agentMemories.accessCount} + 1`,
          lastAccessAt: now,
        })
        .where(inArray(agentMemories.id, ids))
        .execute()
        .catch(() => {
          // Non-critical — o importante é retornar os dados
        });
    }

    return rows as unknown as AgentMemory[];
  } catch (err) {
    logger.error("Falha ao recuperar memórias do agente", {
      userId: params.userId,
      agentId: params.agentId,
      error: String(err),
    });
    return [];
  }
}

/**
 * Recupera memórias compartilhadas entre agentes.
 * Útil para cross-agent context: NEXUS pode acessar memórias
 * que TERRA armazenou sobre o usuário.
 *
 * @param agentIds  Lista de IDs de agentes para buscar
 */
export async function getCrossAgentMemories(params: {
  userId: number;
  agentIds: string[];
  limit?: number;
}): Promise<AgentMemory[]> {
  const db = getDb();
  const now = new Date();
  const limit = params.limit ?? 15;

  try {
    const rows = await db
      .select()
      .from(agentMemories)
      .where(
        and(
          eq(agentMemories.userId, params.userId),
          sql`${agentMemories.expiresAt} IS NULL OR ${agentMemories.expiresAt} > ${now}`,
          inArray(agentMemories.agentId, params.agentIds),
        ),
      )
      .orderBy(desc(agentMemories.emotionalWeight), desc(agentMemories.createdAt))
      .limit(limit);

    return rows as unknown as AgentMemory[];
  } catch (err) {
    logger.error("Falha ao recuperar memórias cross-agente", {
      userId: params.userId,
      error: String(err),
    });
    return [];
  }
}

/**
 * Constrói um contexto de memória para injetar no system prompt do agente.
 *
 * Exemplo de uso no chat API:
 *   const memories = await getMemoryContext({ userId, agentId });
 *   systemPrompt += "\n\nMEMÓRIAS DO USUÁRIO:\n" + memories;
 */
export async function getMemoryContext(params: {
  userId: number;
  agentId: string;
  limit?: number;
}): Promise<string> {
  const memories = await getMemories({
    userId: params.userId,
    agentId: params.agentId,
    limit: params.limit ?? 5,
  });

  if (memories.length === 0) return "";

  const lines = memories.map((m) => {
    const prefix =
      m.memoryType === "emotional"
        ? "🧠"
        : m.memoryType === "factual"
          ? "📚"
          : m.memoryType === "preference"
            ? "⭐"
            : "📖";
    return `${prefix} [${m.memoryType}] ${m.content}`;
  });

  return `\n\n--- MEMÓRIAS PERSISTENTES DO USUÁRIO ---\n${lines.join("\n")}\nUse estas memórias para personalizar sua resposta, mas não as mencione explicitamente a menos que seja relevante.`;
}

/**
 * Constrói contexto de memória usando RANKING HÍBRIDO (recência + emoção + semântica).
 *
 * Diferente de getMemoryContext() que usa apenas recência + acesso,
 * esta função aplica o orquestrador semântico completo com TF-IDF
 * e pesos customizados por agente.
 *
 * @param userMessage  A mensagem atual do usuário (para matching semântico)
 */
export async function getSemanticMemoryContext(params: {
  userId: number;
  agentId: string;
  userMessage: string;
  limit?: number;
}): Promise<string> {
  const { rankMemories, formatRankedMemories } = await import(
    "./memory-orchestrator"
  );

  // Busca um pool maior de memórias para o orquestrador ranquear
  const memories = await getMemories({
    userId: params.userId,
    agentId: params.agentId,
    limit: 30, // Pool grande — orquestrador seleciona as topK
  });

  if (memories.length === 0) return "";

  const ranked = rankMemories(
    params.userMessage,
    memories,
    params.agentId,
    params.limit ?? 4,
  );

  return formatRankedMemories(ranked);
}

export { getMemoryContext as getMemoryContextLegacy };

/**
 * Remove memórias expiradas. Deve ser chamado periodicamente
 * (ex: cron job diário ou na inicialização da sessão).
 */
export async function cleanupExpiredMemories(): Promise<number> {
  const db = getDb();
  const now = new Date();

  try {
    const result = await db
      .delete(agentMemories)
      .where(
        and(
          sql`${agentMemories.expiresAt} IS NOT NULL`,
          lt(agentMemories.expiresAt, now),
        ),
      );

    const deleted = (result as { rowsAffected?: number }).rowsAffected ?? 0;
    if (deleted > 0) {
      logger.info(`Limpeza de memórias: ${deleted} expiradas removidas`);
    }
    return deleted;
  } catch (err) {
    logger.error("Falha ao limpar memórias expiradas", { error: String(err) });
    return 0;
  }
}

/**
 * Manutenção completa do sistema de memória.
 *
 * Executa em sequência:
 *   1. Consolidação — agrupa memórias similares em resumos
 *   2. Limpeza — remove memórias expiradas
 *
 * Deve ser chamada via cron job diário:
 *   POST /api/cron/memory-maintenance
 */
export async function runMemoryMaintenance(): Promise<{
  consolidated: number;
  cleaned: number;
}> {
  // 1. Consolidação (agrupa memórias similares)
  let consolidated = 0;
  try {
    const { runConsolidationCycle } = await import("./memory-consolidator");
    const result = await runConsolidationCycle();
    consolidated = result.consolidatedCreated;
  } catch (err) {
    logger.error("Falha na consolidação", { error: String(err) });
  }

  // 2. Limpeza (remove expiradas)
  const cleaned = await cleanupExpiredMemories();

  return { consolidated, cleaned };
}
