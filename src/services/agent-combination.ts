/**
 * MENTE.AI — Serviço de Combinação de Agentes (Fase 2)
 * src/services/agent-combination.ts
 *
 * Responsabilidades:
 *  1. Normaliza o par (agentA, agentB) em ordem lexicográfica (invariante do sistema)
 *  2. Valida se a combinação existe no catálogo agentCombinations
 *  3. Verifica se ambos os agentes estão desbloqueados para o usuário
 *  4. Registra a descoberta em userCombinations (idempotente via upsert)
 *  5. Dispara evento XP: COMBINACAO_DESCOBERTA (50xp) ou COMBINACAO_USADA (10xp)
 *  6. Retorna dados completos da combinação para a UI animar a conquista
 */

import { db } from "@/lib/db";
import {
  agentCombinations,
  userCombinations,
  userAgentProgress,
} from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { emitXpEvent } from "@/lib/xp-webhook";
import crypto from "crypto";
import { logCombination, logError } from "@/lib/gamification-logger";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ResultadoCombinacao {
  sucesso: boolean;
  /** true se foi a primeira vez que o usuário descobriu esta combinação */
  novaDescoberta: boolean;
  combinationId?: string;
  tipoSinergia?: string;
  sinergiaBonus?: number;
  descricao?: string;
  xpGanho: number;
  xpTotalAtualizado?: number;
  badgesDesbloqueadas?: string[];
  erro?: string;
  motivoErro?: "COMBINACAO_NAO_EXISTE" | "AGENTE_BLOQUEADO" | "COMBINACAO_INATIVA" | "INTERNO";
}

// ─── Helper: normalizar par para ordem lexicográfica ─────────────────────────

/**
 * Garante que (A, B) e (B, A) resolvam para o mesmo par.
 * Mantém a invariante definida na Camada 1 do schema.
 */
export function normalizarPar(a: string, b: string): [string, string] {
  return a.localeCompare(b) <= 0 ? [a, b] : [b, a];
}

// ─── Função principal ─────────────────────────────────────────────────────────

/**
 * Tenta combinar dois agentes para um usuário.
 *
 * @param userId   ID do usuário autenticado
 * @param agentAId ID do primeiro agente (ordem não importa)
 * @param agentBId ID do segundo agente
 */
export async function combineAgents(
  userId: number,
  agentAId: string,
  agentBId: string,
): Promise<ResultadoCombinacao> {

  const startTime = performance.now();

  try {
    // ── 1. Validação básica ──────────────────────────────────────────────────────
    if (!agentAId || !agentBId || agentAId === agentBId) {
      return {
        sucesso: false,
        novaDescoberta: false,
        xpGanho: 0,
        erro: "Os dois agentes devem ser diferentes.",
        motivoErro: "INTERNO",
      };
    }

  const [aId, bId] = normalizarPar(agentAId, agentBId);

  // ── 2. Verificar se a combinação existe no catálogo ──────────────────────────
  const [combo] = await db
    .select()
    .from(agentCombinations)
    .where(and(eq(agentCombinations.agentAId, aId), eq(agentCombinations.agentBId, bId)))
    .limit(1);

  if (!combo) {
    return {
      sucesso: false,
      novaDescoberta: false,
      xpGanho: 0,
      erro: `A combinação entre ${aId.toUpperCase()} e ${bId.toUpperCase()} ainda não foi catalogada.`,
      motivoErro: "COMBINACAO_NAO_EXISTE",
    };
  }

  if (!combo.ativa) {
    return {
      sucesso: false,
      novaDescoberta: false,
      xpGanho: 0,
      erro: "Esta combinação está temporariamente desativada.",
      motivoErro: "COMBINACAO_INATIVA",
    };
  }

  // ── 3. Verificar se ambos os agentes estão desbloqueados para o usuário ──────
  const progressos = await db
    .select({ agentId: userAgentProgress.agentId, desbloqueado: userAgentProgress.desbloqueado })
    .from(userAgentProgress)
    .where(
      and(
        eq(userAgentProgress.userId, userId),
        // Busca os dois agentes em uma query só
        sql`${userAgentProgress.agentId} IN (${aId}, ${bId})`,
      ),
    );

  const desbloqueados = new Set(
    progressos.filter((p) => p.desbloqueado).map((p) => p.agentId),
  );

  const agenteBloqueado = [aId, bId].find((id) => !desbloqueados.has(id));
  if (agenteBloqueado) {
    return {
      sucesso: false,
      novaDescoberta: false,
      xpGanho: 0,
      erro: `${agenteBloqueado.toUpperCase()} ainda não está desbloqueado. Interaja mais com ele primeiro!`,
      motivoErro: "AGENTE_BLOQUEADO",
    };
  }

  // ── 4. Verificar se já foi descoberta (idempotência) ─────────────────────────
  const [comboUsuario] = await db
    .select()
    .from(userCombinations)
    .where(and(eq(userCombinations.userId, userId), eq(userCombinations.combinationId, combo.id)))
    .limit(1);

  const novaDescoberta = !comboUsuario;

  // ── 5. Registrar ou incrementar uso ──────────────────────────────────────────
  if (!comboUsuario) {
    await db.insert(userCombinations).values({
      id: crypto.randomUUID(),
      userId,
      combinationId: combo.id,
      vezesUsada: 1,
    });
  } else {
    await db
      .update(userCombinations)
      .set({
        vezesUsada: comboUsuario.vezesUsada + 1,
        ultimoUsoEm: new Date(),
      })
      .where(eq(userCombinations.id, comboUsuario.id));
  }

  // ── 6. Emitir evento XP ───────────────────────────────────────────────────────
  const tipoEvento = novaDescoberta ? "COMBINACAO_DESCOBERTA" : "COMBINACAO_USADA";
  const resultadoXp = await emitXpEvent({
    userId,
    tipo: tipoEvento,
    metadata: { combinationId: combo.id },
  });

  // XP base do evento + bônus da combinação (se nova descoberta)
  const xpTotal = resultadoXp.xpGanho + (novaDescoberta ? (combo.xpBonus ?? 0) : 0);

  // Logging estruturado da combinação
  logCombination(
    {
      combinationId: combo.id,
      agentAId: aId,
      agentBId: bId,
      tipoSinergia: combo.tipoSinergia,
      sinergiaBonus: combo.sinergiaBonus,
      novaDescoberta,
      xpGanho: xpTotal,
    },
    userId,
  );

  return {
    sucesso: true,
    novaDescoberta,
    combinationId: combo.id,
    tipoSinergia: combo.tipoSinergia,
    sinergiaBonus: combo.sinergiaBonus,
    descricao: combo.descricao ?? undefined,
    xpGanho: xpTotal,
    xpTotalAtualizado: resultadoXp.xpTotalAtualizado,
    badgesDesbloqueadas: resultadoXp.badgesDesbloqueadas,
  };
  } catch (error) {
    const latencyMs = performance.now() - startTime;
    logError({
      context: 'agent-combination',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId,
    });
    return {
      sucesso: false,
      novaDescoberta: false,
      xpGanho: 0,
      erro: "Erro interno ao processar combinação.",
      motivoErro: "INTERNO",
    };
  }
}

// ─── Buscar combinações disponíveis para um usuário ──────────────────────────

export interface CombinacaoDisponivel {
  id: string;
  agentAId: string;
  agentBId: string;
  tipoSinergia: string;
  sinergiaBonus: number;
  descricao: string | null;
  xpBonus: number;
  jaDescoberta: boolean;
  vezesUsada: number;
}

/**
 * Lista todas as combinações que o usuário pode fazer com os agentes
 * que já tem desbloqueados.
 */
export async function listarCombinacoes(userId: number): Promise<CombinacaoDisponivel[]> {
  // Agentes desbloqueados pelo usuário
  const progressos = await db
    .select({ agentId: userAgentProgress.agentId })
    .from(userAgentProgress)
    .where(and(eq(userAgentProgress.userId, userId), eq(userAgentProgress.desbloqueado, true)));

  if (progressos.length < 2) return [];

  const agentesDesbloqueados = new Set(progressos.map((p) => p.agentId));

  // Todas as combinações ativas do catálogo
  const todasCombinacoes = await db
    .select()
    .from(agentCombinations)
    .where(eq(agentCombinations.ativa, true));

  // Combinações já descobertas pelo usuário
  const descobertas = await db
    .select()
    .from(userCombinations)
    .where(eq(userCombinations.userId, userId));

  const descobertasPorComboId = new Map(descobertas.map((d) => [d.combinationId, d]));

  // Filtra combinações onde ambos os agentes estão desbloqueados
  return todasCombinacoes
    .filter((c) => agentesDesbloqueados.has(c.agentAId) && agentesDesbloqueados.has(c.agentBId))
    .map((c) => {
      const desc = descobertasPorComboId.get(c.id);
      return {
        id: c.id,
        agentAId: c.agentAId,
        agentBId: c.agentBId,
        tipoSinergia: c.tipoSinergia,
        sinergiaBonus: c.sinergiaBonus,
        descricao: c.descricao ?? null,
        xpBonus: c.xpBonus,
        jaDescoberta: !!desc,
        vezesUsada: desc?.vezesUsada ?? 0,
      };
    });
}
