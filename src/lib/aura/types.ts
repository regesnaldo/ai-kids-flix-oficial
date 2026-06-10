// ─── src/lib/aura/types.ts ──────────────────────────────────────────────────
// FASE 12A — Aura Dinâmica: tipos canônicos

export type AuraIntensity = 1 | 2 | 3 | 4 | 5;

export type AuraPattern = "sereno" | "eletrico" | "caotico" | "etereo";

export type AuraColorName =
  | "verdeMusgo" | "azulCalmo" | "cinzaPetreo"
  | "dourado" | "ambar" | "magenta"
  | "roxo" | "indigo" | "prata"
  | "ciano" | "verdeNeon" | "ouroBranco";

export type AuraPhase = 1 | 2 | 3 | 4;

export interface AuraState {
  color: AuraColorName;
  colorHex: string;
  intensity: AuraIntensity;
  pattern: AuraPattern;
  score: number;
  phase: AuraPhase;
  nextMilestone: string;
}
