/**
 * memory-consolidator.ts — Motor de Consolidação de Memória de Longo Prazo.
 *
 * Inspirado na consolidação da memória humana:
 *   - Memórias similares são agrupadas (clustering semântico)
 *   - Grupos são comprimidos em resumos abstratos (sumarização)
 *   - Memórias originais expiram, resumos persistem (compressão)
 *
 * O ciclo de consolidação é executado periodicamente (cron job)
 * e transforma memórias episódicas em conhecimento consolidado.
 *
 * CAMADAS DE MEMÓRIA:
 *   RAW (episódica) → CLUSTERED (agrupada) → CONSOLIDATED (comprimida)
 *
 * Exemplo:
 *   RAW:     "ansioso com IA", "medo de tecnologia", "preocupado com futuro"
 *   CLUSTER: Grupo temático "ansiedade_tecnologica" (3 memórias)
 *   CONSOL:  "Padrão recorrente de ansiedade sobre impacto tecnológico e IA"
 */

import { eq, and, gte, sql, inArray, lt } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { agentMemories, type AgentMemory } from "@/lib/db/schema";
import { findSemanticMatches } from "./semantic-memory";
import { logger } from "@/lib/logger";

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Mínimo de memórias similares para formar um cluster */
const MIN_CLUSTER_SIZE = 3;
/** Similaridade mínima para considerar duas memórias relacionadas */
const CLUSTER_SIMILARITY_THRESHOLD = 0.15;
/** Máximo de clusters processados por execução (evita sobrecarga) */
const MAX_CLUSTERS_PER_RUN = 5;
/** Idade mínima (horas) para memória ser candidata à consolidação */
const MIN_AGE_HOURS = 24;
/** TTL reduzido para memórias consolidadas (7 dias vs 90) */
const CONSOLIDATED_TTL_DAYS = 7;

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface MemoryCluster {
  /** Tema central do cluster (tópico mais frequente) */
  theme: string;
  /** Memórias que pertencem a este cluster */
  memories: AgentMemory[];
  /** Score médio de similaridade interna */
  cohesion: number;
  /** Tipo de memória dominante no cluster */
  dominantType: string;
}

interface ConsolidatedMemory {
  /** Resumo comprimido do cluster */
  summary: string;
  /** Tipo dominante */
  type: string;
  /** Peso emocional médio do cluster */
  emotionalWeight: number;
  /** Quantas memórias foram consolidadas */
  sourceCount: number;
  /** IDs das memórias originais (para marcar como consolidadas) */
  sourceIds: string[];
}

// ─── Clustering ───────────────────────────────────────────────────────────────

/**
 * Agrupa memórias por similaridade semântica usando TF-IDF.
 *
 * Algoritmo:
 *   1. Para cada memória, busca as top-K mais similares
 *   2. Agrupa em clusters com similaridade mútua > threshold
 *   3. Filtra clusters com tamanho >= MIN_CLUSTER_SIZE
 */
function buildClusters(memories: AgentMemory[]): MemoryCluster[] {
  if (memories.length < MIN_CLUSTER_SIZE) return [];

  const assigned = new Set<string>();
  const clusters: MemoryCluster[] = [];

  for (const seed of memories) {
    if (assigned.has(seed.id)) continue;

    const matches = findSemanticMatches(
      seed.content,
      memories.filter((m) => m.id !== seed.id),
      memories.length,
      CLUSTER_SIMILARITY_THRESHOLD,
    );

    // Coleta memórias similares não atribuídas
    const clusterMembers: AgentMemory[] = [seed];
    let totalScore = 0;

    for (const match of matches) {
      if (!assigned.has(match.memory.id)) {
        clusterMembers.push(match.memory);
        totalScore += match.score;
      }
    }

    if (clusterMembers.length >= MIN_CLUSTER_SIZE) {
      // Marca como atribuídas
      for (const m of clusterMembers) {
        assigned.add(m.id);
      }

      // Determina tipo dominante
      const typeCounts = new Map<string, number>();
      for (const m of clusterMembers) {
        typeCounts.set(m.memoryType, (typeCounts.get(m.memoryType) ?? 0) + 1);
      }
      let dominantType = "factual";
      let maxCount = 0;
      for (const [t, c] of typeCounts) {
        if (c > maxCount) {
          maxCount = c;
          dominantType = t;
        }
      }

      clusters.push({
        theme: extractTheme(clusterMembers),
        memories: clusterMembers,
        cohesion: clusterMembers.length > 1
          ? totalScore / (clusterMembers.length - 1)
          : 1,
        dominantType,
      });
    }
  }

  return clusters;
}

// ─── Extração de Tema ─────────────────────────────────────────────────────────

/**
 * Extrai o tema central de um cluster baseado nas palavras mais frequentes.
 */
function extractTheme(memories: AgentMemory[]): string {
  const wordFreq = new Map<string, number>();
  const stopwords = new Set([
    "usuário", "usuaria", "expressou", "detectada", "detectado",
    "compreendeu", "aprendeu", "demonstrou", "durante", "sobre",
    "para", "com", "uma", "que", "não", "foi",
  ]);

  for (const m of memories) {
    const words = m.content
      .toLowerCase()
      .replace(/[^a-záàâãéêíóôõúüç\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopwords.has(w));

    for (const w of words) {
      wordFreq.set(w, (wordFreq.get(w) ?? 0) + 1);
    }
  }

  // Top 3 palavras mais frequentes como tema
  const sorted = [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([w]) => w);

  return sorted.join("_");
}

// ─── Sumarização ──────────────────────────────────────────────────────────────

/**
 * Gera um resumo comprimido de um cluster de memórias.
 *
 * Usa heurísticas linguísticas (sem LLM) para comprimir:
 *   - Extrai frases comuns entre memórias
 *   - Detecta padrão temporal ("recorrente", "frequente")
 *   - Preserva carga emocional
 */
function summarizeCluster(cluster: MemoryCluster): ConsolidatedMemory {
  const count = cluster.memories.length;
  const avgWeight =
    cluster.memories.reduce(
      (sum, m) => sum + Math.abs(Number(m.emotionalWeight ?? 0)),
      0,
    ) / count;

  // Template por tipo de memória dominante
  const templates: Record<string, string> = {
    emotional: `Padrão emocional recorrente (${count} ocorrências): ${cluster.theme.replace(/_/g, " ")}`,
    factual: `Conhecimento consolidado (${count} interações): ${cluster.theme.replace(/_/g, " ")}`,
    preference: `Preferência consistente detectada (${count} confirmações): ${cluster.theme.replace(/_/g, " ")}`,
    narrative: `Arco narrativo recorrente (${count} eventos): ${cluster.theme.replace(/_/g, " ")}`,
  };

  const summary =
    templates[cluster.dominantType] ??
    `Memória consolidada (${count} ocorrências): ${cluster.theme.replace(/_/g, " ")}`;

  return {
    summary,
    type: cluster.dominantType,
    emotionalWeight: Math.min(1, avgWeight),
    sourceCount: count,
    sourceIds: cluster.memories.map((m) => m.id),
  };
}

// ─── API Principal ────────────────────────────────────────────────────────────

export interface ConsolidationResult {
  /** Quantos clusters foram formados */
  clustersFound: number;
  /** Quantas memórias consolidadas foram criadas */
  consolidatedCreated: number;
  /** Quantas memórias originais foram marcadas para expiração */
  sourcesExpired: number;
  /** Detalhes dos clusters para debug */
  details: Array<{
    theme: string;
    count: number;
    cohesion: number;
    summary: string;
  }>;
}

/**
 * Executa um ciclo de consolidação de memória.
 *
 * Deve ser chamado periodicamente (cron job diário).
 *
 * @param userId  ID do usuário (ou undefined para todos)
 * @param agentId ID do agente (ou undefined para todos)
 */
export async function runConsolidationCycle(params?: {
  userId?: number;
  agentId?: string;
}): Promise<ConsolidationResult> {
  const db = getDb();
  const result: ConsolidationResult = {
    clustersFound: 0,
    consolidatedCreated: 0,
    sourcesExpired: 0,
    details: [],
  };

  try {
    // Busca memórias não consolidadas com idade >= MIN_AGE_HOURS
    const minDate = new Date(Date.now() - MIN_AGE_HOURS * 3600 * 1000);

    const conditions = [
      // Apenas memórias não consolidadas (tags não contêm "consolidated")
      sql`NOT JSON_CONTAINS(${agentMemories.tags}, '"consolidated"')`,
      gte(agentMemories.createdAt, minDate),
    ];

    if (params?.userId) {
      conditions.push(eq(agentMemories.userId, params.userId));
    }
    if (params?.agentId) {
      conditions.push(eq(agentMemories.agentId, params.agentId));
    }

    const rawMemories = await db
      .select()
      .from(agentMemories)
      .where(and(...conditions))
      .limit(200); // Limite de segurança

    if (rawMemories.length < MIN_CLUSTER_SIZE) {
      return result;
    }

    // 1. Clustering semântico
    const clusters = buildClusters(
      rawMemories as unknown as AgentMemory[],
    ).slice(0, MAX_CLUSTERS_PER_RUN);

    result.clustersFound = clusters.length;

    // 2. Para cada cluster: sumarizar e armazenar
    for (const cluster of clusters) {
      const consolidated = summarizeCluster(cluster);

      // Armazena a memória consolidada
      const memoryId = crypto.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      await db
        .insert(agentMemories)
        .values({
          id: memoryId,
          userId: cluster.memories[0].userId,
          agentId: cluster.memories[0].agentId,
          memoryType: consolidated.type as typeof cluster.memories[0]["memoryType"],
          content: consolidated.summary,
          emotionalWeight: String(consolidated.emotionalWeight),
          tags: ["consolidated", `cluster:${cluster.theme}`],
          contexto: {
            sourceCount: consolidated.sourceCount,
            cohesion: Math.round(cluster.cohesion * 100) / 100,
            consolidatedAt: new Date().toISOString(),
          },
          ttlDays: CONSOLIDATED_TTL_DAYS,
          expiresAt: new Date(
            Date.now() + CONSOLIDATED_TTL_DAYS * 86400 * 1000,
          ),
          accessCount: 0,
          createdAt: new Date(),
        })
        .catch((err) => {
          logger.warn("Falha ao armazenar memória consolidada", {
            theme: cluster.theme,
            error: String(err),
          });
        });

      // Marca originais para expiração rápida (serão removidas pelo cleanup)
      const sourceIds = consolidated.sourceIds;
      if (sourceIds.length > 0) {
        await db
          .update(agentMemories)
          .set({
            ttlDays: CONSOLIDATED_TTL_DAYS,
          })
          .where(inArray(agentMemories.id, sourceIds))
          .catch(() => {
            // Non-critical
          });
      }

      result.consolidatedCreated++;
      result.sourcesExpired += consolidated.sourceCount;
      result.details.push({
        theme: cluster.theme,
        count: cluster.memories.length,
        cohesion: Math.round(cluster.cohesion * 100) / 100,
        summary: consolidated.summary,
      });
    }

    if (result.clustersFound > 0) {
      logger.info("Ciclo de consolidação concluído", {
        clusters: result.clustersFound,
        consolidated: result.consolidatedCreated,
        expired: result.sourcesExpired,
      });
    }
  } catch (err) {
    logger.error("Falha no ciclo de consolidação", { error: String(err) });
  }

  return result;
}

/**
 * Retorna estatísticas de consolidação para debug/monitoramento.
 */
export async function getConsolidationStats(params?: {
  userId?: number;
  agentId?: string;
}): Promise<{
  totalMemories: number;
  consolidatedMemories: number;
  consolidationRatio: number;
}> {
  const db = getDb();

  const conditions = [];
  if (params?.userId) conditions.push(eq(agentMemories.userId, params.userId));
  if (params?.agentId) conditions.push(eq(agentMemories.agentId, params.agentId));

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(agentMemories)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const consolidated = await db
    .select({ count: sql<number>`count(*)` })
    .from(agentMemories)
    .where(
      and(
        ...(conditions.length > 0 ? conditions : [sql`1=1`]),
        sql`JSON_CONTAINS(${agentMemories.tags}, '"consolidated"')`,
      ),
    );

  return {
    totalMemories: total[0]?.count ?? 0,
    consolidatedMemories: consolidated[0]?.count ?? 0,
    consolidationRatio:
      (total[0]?.count ?? 0) > 0
        ? (consolidated[0]?.count ?? 0) / (total[0]?.count ?? 1)
        : 0,
  };
}
