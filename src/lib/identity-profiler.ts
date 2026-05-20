/**
 * identity-profiler.ts — Perfilador de Identidade de Longo Prazo.
 *
 * Analisa padrões de memória consolidada para gerar traços de identidade
 * de alto nível, similar a traços de personalidade em psicologia cognitiva.
 *
 * IMPORTANTE: Este módulo NÃO faz diagnóstico psicológico.
 * Ele detecta PADRÕES DE INTERAÇÃO com agentes AI, não traços clínicos.
 *
 * Traits gerados:
 *   - curiosity_level     (0..1): frequência de perguntas exploratórias
 *   - emotional_openness  (0..1): disposição para expressar emoções
 *   - analytical_depth    (0..1): tendência a raciocínio lógico/analítico
 *   - narrative_engagement(0..1): envolvimento com arcos narrativos
 *   - preference_stability(0..1): consistência de preferências ao longo do tempo
 */

import { eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { agentMemories } from "@/lib/db/schema";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface IdentityTraits {
  /** 0..1 — frequência de curiosidade e exploração */
  curiosityLevel: number;
  /** 0..1 — abertura para expressão emocional */
  emotionalOpenness: number;
  /** 0..1 — tendência ao pensamento analítico */
  analyticalDepth: number;
  /** 0..1 — envolvimento com narrativas */
  narrativeEngagement: number;
  /** 0..1 — consistência de preferências */
  preferenceStability: number;
  /** Data da última atualização */
  lastUpdated: string;
  /** Quantas memórias foram analisadas */
  sampleSize: number;
}

// ─── Análise ──────────────────────────────────────────────────────────────────

/**
 * Analisa memórias de um usuário e extrai traços de identidade.
 *
 * Usa padrões simples de contagem por tipo de memória para inferir
 * tendências comportamentais — sem LLM, sem diagnóstico.
 */
export async function analyzeIdentity(
  userId: number,
  agentId?: string,
): Promise<IdentityTraits | null> {
  const db = getDb();

  try {
    const conditions = [eq(agentMemories.userId, userId)];
    if (agentId) conditions.push(eq(agentMemories.agentId, agentId));

    // Busca memórias recentes (últimos 90 dias)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 86400 * 1000);
    conditions.push(sql`${agentMemories.createdAt} >= ${ninetyDaysAgo}`);

    const memories = await db
      .select()
      .from(agentMemories)
      .where(sql`${conditions.join(" AND ")}`)
      .orderBy(desc(agentMemories.createdAt))
      .limit(100);

    if (memories.length < 5) return null; // Amostra insuficiente

    const total = memories.length;

    // Contagem por tipo
    const typeCounts = { emotional: 0, factual: 0, preference: 0, narrative: 0 };
    let totalEmotionalWeight = 0;

    for (const m of memories) {
      const type = m.memoryType as keyof typeof typeCounts;
      if (type in typeCounts) typeCounts[type]++;
      totalEmotionalWeight += Math.abs(Number(m.emotionalWeight ?? 0));
    }

    // Traços derivados
    const emotionalOpenness = Math.min(
      1,
      typeCounts.emotional / Math.max(total * 0.3, 1),
    );
    const analyticalDepth = Math.min(
      1,
      (typeCounts.factual + typeCounts.preference) / Math.max(total * 0.4, 1),
    );
    const curiosityLevel = Math.min(
      1,
      typeCounts.factual / Math.max(total * 0.25, 1),
    );
    const narrativeEngagement = Math.min(
      1,
      typeCounts.narrative / Math.max(total * 0.2, 1),
    );

    // Estabilidade de preferências: quantas preferências consolidadas existem
    const consolidatedPrefs = memories.filter(
      (m) =>
        m.memoryType === "preference" &&
        Array.isArray(m.tags) &&
        (m.tags as string[]).includes("consolidated"),
    ).length;

    const preferenceStability = Math.min(
      1,
      consolidatedPrefs / Math.max(typeCounts.preference, 1),
    );

    return {
      curiosityLevel: Math.round(curiosityLevel * 100) / 100,
      emotionalOpenness: Math.round(emotionalOpenness * 100) / 100,
      analyticalDepth: Math.round(analyticalDepth * 100) / 100,
      narrativeEngagement: Math.round(narrativeEngagement * 100) / 100,
      preferenceStability: Math.round(preferenceStability * 100) / 100,
      lastUpdated: new Date().toISOString(),
      sampleSize: total,
    };
  } catch (err) {
    // Silencioso — identidade é non-critical
    return null;
  }
}

/**
 * Formata traços de identidade para injeção no system prompt.
 *
 * Exemplo de saída:
 *   "PERFIL COGNITIVO: curiosidade alta (0.8), abertura emocional moderada (0.5),
 *    engajamento narrativo alto (0.75). Prefere abordagem analítica."
 */
export function formatIdentityContext(traits: IdentityTraits): string {
  const level = (v: number) =>
    v > 0.7 ? "alta" : v > 0.4 ? "moderada" : "baixa";

  const parts: string[] = [];

  if (traits.curiosityLevel > 0.3) {
    parts.push(
      `curiosidade ${level(traits.curiosityLevel)} (${traits.curiosityLevel})`,
    );
  }
  if (traits.emotionalOpenness > 0.3) {
    parts.push(
      `abertura emocional ${level(traits.emotionalOpenness)} (${traits.emotionalOpenness})`,
    );
  }
  if (traits.analyticalDepth > 0.3) {
    parts.push(
      `profundidade analítica ${level(traits.analyticalDepth)} (${traits.analyticalDepth})`,
    );
  }
  if (traits.narrativeEngagement > 0.3) {
    parts.push(
      `engajamento narrativo ${level(traits.narrativeEngagement)} (${traits.narrativeEngagement})`,
    );
  }

  if (parts.length === 0) return "";

  return `\n\n--- PERFIL COGNITIVO DO USUÁRIO ---\n${parts.join(", ")}.\nAdapte o tom e a profundidade da resposta a este perfil, sem mencioná-lo explicitamente.`;
}
