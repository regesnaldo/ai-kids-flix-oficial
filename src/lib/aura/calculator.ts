// ─── src/lib/aura/calculator.ts ─────────────────────────────────────────────
// FASE 12A — Aura Dinâmica: cálculo puro do estado da aura
// O endpoint (Dia 3) faz as queries ao TiDB e chama estas funções.

import type { AuraState, AuraColorName, AuraIntensity, AuraPattern, AuraPhase } from "./types";
import { AURA_THRESHOLDS, AURA_COLORS, AURA_PHASE_MAP, AURA_WEIGHTS, AURA_CACHE_TTL_MS } from "./constants";

/**
 * Calcula o score da aura com base em XP, decisões e temporadas.
 * Fórmula: score = xp * 0.4 + decisions * 0.3 + seasons * 0.3
 */
export function calculateScore(xp: number, decisionsCount: number, seasonsCompleted: number): number {
  return Math.round(xp * AURA_WEIGHTS.xp + decisionsCount * AURA_WEIGHTS.decisions + seasonsCompleted * AURA_WEIGHTS.seasons);
}

/**
 * Determina cor, intensidade e padrão a partir do score.
 */
export function resolveAuraState(score: number): AuraState {
  // Encontra a faixa (threshold) correspondente
  const tier = AURA_THRESHOLDS.find(t => score >= t.min && score <= t.max) ?? AURA_THRESHOLDS[0];

  // Escolhe cor baseada no score (cíclica dentro da faixa)
  const colorIndex = (score - tier.min) % tier.colors.length;
  const color: AuraColorName = tier.colors[colorIndex];

  // Padrão: usa XP alto → padrões mais avançados
  const patternIndex = Math.floor(score / 50) % tier.patterns.length;
  const pattern: AuraPattern = tier.patterns[Math.min(patternIndex, tier.patterns.length - 1)];

  const phase: AuraPhase = AURA_PHASE_MAP[color];

  // Próximo marco
  const nextTier = AURA_THRESHOLDS.find(t => score < t.min);
  const nextMilestone = nextTier ? `faltam ${nextTier.min - score} pontos para ${nextTier.patterns[0]}` : "você atingiu o nível máximo";

  return {
    color,
    colorHex: AURA_COLORS[color],
    intensity: tier.intensity as AuraIntensity,
    pattern,
    score,
    phase,
    nextMilestone,
  };
}

/**
 * Cache em memória com TTL.
 */
const cache = new Map<string, { state: AuraState; timestamp: number }>();

export function getCachedAura(explorerId: string): AuraState | null {
  const entry = cache.get(explorerId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > AURA_CACHE_TTL_MS) {
    cache.delete(explorerId);
    return null;
  }
  return entry.state;
}

export function setCachedAura(explorerId: string, state: AuraState): void {
  cache.set(explorerId, { state, timestamp: Date.now() });
}

// Cleanup periódico de entradas expiradas (a cada 10 min)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const keys = Array.from(cache.keys());
    for (const key of keys) {
      const entry = cache.get(key);
      if (entry && now - entry.timestamp > AURA_CACHE_TTL_MS) cache.delete(key);
    }
  }, 10 * 60 * 1000);
}
