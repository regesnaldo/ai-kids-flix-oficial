/**
 * memory-orchestrator.ts — Orquestrador híbrido de recuperação de memória.
 *
 * Combina três sinais de relevância em um ranking unificado:
 *
 *   1. RECÊNCIA (recency)          — memórias mais novas pesam mais
 *   2. PESO EMOCIONAL (emotional)  — memórias com carga emocional pesam mais
 *   3. SIMILARIDADE SEMÂNTICA      — TF-IDF cosine similarity com a query
 *
 * Score final = (recency × w1) + (emotional × w2) + (semantic × w3)
 *
 * Os pesos são ajustáveis por agente, permitindo que:
 *   - TERRA priorize memórias emocionais (emotional weight alto)
 *   - AXIOM priorize similaridade factual (semantic weight alto)
 *   - NEXUS use balanceamento padrão
 */

import type { AgentMemory, MemoryType } from "@/lib/db/schema";
import { findSemanticMatches, type SemanticMatch } from "./semantic-memory";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface RetrievalWeights {
  /** Peso da recência (0..1, padrão 0.3) */
  recency: number;
  /** Peso da carga emocional (0..1, padrão 0.3) */
  emotional: number;
  /** Peso da similaridade semântica (0..1, padrão 0.4) */
  semantic: number;
}

export interface RankedMemory {
  memory: AgentMemory;
  finalScore: number;   // 0..1
  recencyScore: number;  // 0..1
  emotionalScore: number;// 0..1
  semanticScore: number; // 0..1
}

// ─── Pesos por tipo de agente ─────────────────────────────────────────────────

const DEFAULT_WEIGHTS: RetrievalWeights = {
  recency: 0.3,
  emotional: 0.3,
  semantic: 0.4,
};

/**
 * Pesos customizados por dimensão do agente.
 * Agentes emocionais priorizam carga emocional;
 * agentes analíticos priorizam similaridade semântica.
 */
const AGENT_WEIGHTS: Record<string, RetrievalWeights> = {
  // Emocionais: priorizam peso emocional
  terra: { recency: 0.2, emotional: 0.5, semantic: 0.3 },
  lyra: { recency: 0.2, emotional: 0.5, semantic: 0.3 },
  // Analíticos: priorizam similaridade semântica
  axiom: { recency: 0.2, emotional: 0.15, semantic: 0.65 },
  cipher: { recency: 0.15, emotional: 0.2, semantic: 0.65 },
  stratos: { recency: 0.2, emotional: 0.15, semantic: 0.65 },
  // Criativos: balanceamento
  aurora: { recency: 0.25, emotional: 0.4, semantic: 0.35 },
  kaos: { recency: 0.2, emotional: 0.45, semantic: 0.35 },
  // Éticos: priorizam narrativa
  ethos: { recency: 0.25, emotional: 0.35, semantic: 0.4 },
  prism: { recency: 0.2, emotional: 0.35, semantic: 0.45 },
  // Padrão para os demais
  nexus: { recency: 0.3, emotional: 0.3, semantic: 0.4 },
  volt: { recency: 0.3, emotional: 0.3, semantic: 0.4 },
  janus: { recency: 0.25, emotional: 0.4, semantic: 0.35 },
};

// ─── Funções de scoring ───────────────────────────────────────────────────────

/** Score de recência: memórias mais novas → score mais alto */
function computeRecencyScore(memory: AgentMemory): number {
  const now = Date.now();
  const created = memory.createdAt
    ? new Date(memory.createdAt).getTime()
    : now;
  const ageHours = (now - created) / (1000 * 60 * 60);

  // Decaimento exponencial: meia-vida de 7 dias (168 horas)
  return Math.exp(-ageHours / 168);
}

/** Score emocional: |emotionalWeight| normalizado para 0..1 */
function computeEmotionalScore(memory: AgentMemory): number {
  const weight = Number(memory.emotionalWeight ?? 0);
  return Math.abs(weight); // 0..1
}

/** Normaliza scores semânticos para o intervalo 0..1 */
function normalizeSemanticScores(
  matches: SemanticMatch[],
): Map<string, number> {
  const map = new Map<string, number>();
  if (matches.length === 0) return map;

  const maxScore = matches[0]?.score ?? 1;
  for (const match of matches) {
    // Normaliza: score / maxScore para manter proporções
    map.set(match.memory.id, match.score / Math.max(maxScore, 0.01));
  }
  return map;
}

// ─── API Principal ────────────────────────────────────────────────────────────

/**
 * Recupera e ranqueia memórias usando scoring híbrido.
 *
 * @param query      Texto da mensagem do usuário (para matching semântico)
 * @param memories   Pool de memórias candidatas (já filtradas por userId + agentId)
 * @param agentId    ID do agente para selecionar pesos customizados
 * @param topK       Quantas memórias retornar no ranking final
 * @returns          Memórias ranqueadas por score final (maior primeiro)
 */
export function rankMemories(
  query: string,
  memories: AgentMemory[],
  agentId: string,
  topK: number = 5,
): RankedMemory[] {
  if (memories.length === 0) return [];

  const weights = AGENT_WEIGHTS[agentId] ?? DEFAULT_WEIGHTS;

  // 1. Busca semântica
  const semanticMatches = findSemanticMatches(query, memories, memories.length, 0.02);
  const semanticMap = normalizeSemanticScores(semanticMatches);

  // 2. Computa scores individuais e combina
  const ranked: RankedMemory[] = memories.map((memory) => {
    const recencyScore = computeRecencyScore(memory);
    const emotionalScore = computeEmotionalScore(memory);
    const semanticScore = semanticMap.get(memory.id) ?? 0;

    // Score final = soma ponderada
    const finalScore =
      recencyScore * weights.recency +
      emotionalScore * weights.emotional +
      semanticScore * weights.semantic;

    return {
      memory,
      finalScore: Math.min(1, Math.max(0, finalScore)),
      recencyScore,
      emotionalScore,
      semanticScore,
    };
  });

  // 3. Ordena por score final e retorna topK
  return ranked
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topK);
}

/**
 * Formata memórias ranqueadas para injeção no system prompt.
 * Similar ao getMemoryContext() mas com scoring híbrido.
 */
export function formatRankedMemories(
  ranked: RankedMemory[],
  maxChars: number = 600,
): string {
  if (ranked.length === 0) return "";

  const lines: string[] = [];

  for (const r of ranked) {
    const prefix =
      r.memory.memoryType === "emotional"
        ? "🧠"
        : r.memory.memoryType === "factual"
          ? "📚"
          : r.memory.memoryType === "preference"
            ? "⭐"
            : "📖";

    const relevance =
      r.finalScore > 0.7 ? "↑" : r.finalScore > 0.4 ? "→" : "↓";

    lines.push(
      `${prefix}${relevance} [${r.memory.memoryType}] ${r.memory.content}`,
    );
  }

  let result = `\n\n--- MEMÓRIAS PERSISTENTES (busca semântica) ---\n${lines.join("\n")}\nUse estas memórias para personalizar sua resposta, mas não as mencione explicitamente a menos que seja relevante.`;

  // Trunca se exceder limite de caracteres
  if (result.length > maxChars) {
    result = result.slice(0, maxChars - 3) + "...";
  }

  return result;
}

/**
 * Retorna os pesos de retrieval para um agente específico.
 * Útil para debugging e ajuste fino.
 */
export function getAgentWeights(agentId: string): RetrievalWeights {
  return AGENT_WEIGHTS[agentId] ?? DEFAULT_WEIGHTS;
}
