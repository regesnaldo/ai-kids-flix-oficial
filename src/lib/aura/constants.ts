// ÔöÇÔöÇÔöÇ src/lib/aura/constants.ts ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
// FASE 12A ÔÇö Aura Din├ómica: cores, thresholds e mapeamentos

import type { AuraColorName, AuraIntensity, AuraPattern, AuraPhase } from "./types";

// 12 cores hex mapeadas ├ás 4 fases narrativas
export const AURA_COLORS: Record<AuraColorName, string> = {
  // Fase 1 - Fundamentos
  verdeMusgo:   "#5C7C3A",
  azulCalmo:    "#4A6FA5",
  cinzaPetreo:  "#6B6B6B",
  // Fase 2 - IA Criativa
  dourado:      "#D4A04A",
  ambar:        "#E89B3C",
  magenta:      "#C04A8E",
  // Fase 3 - ├ëtica
  roxo:         "#6B4A8E",
  indigo:       "#3D4A8E",
  prata:        "#C0C0C0",
  // Fase 4 - Futuro/Legado
  ciano:        "#3DC0C0",
  verdeNeon:    "#3DC04A",
  ouroBranco:   "#F0E8C0",
} as const;

// Faixas de score ÔåÆ cor, intensidade, padr├úo
interface ThresholdConfig {
  min: number;
  max: number;
  colors: AuraColorName[];
  intensity: AuraIntensity;
  patterns: AuraPattern[];
}

export const AURA_THRESHOLDS: ThresholdConfig[] = [
  { min: 0,   max: 20,   colors: ["verdeMusgo", "azulCalmo"],       intensity: 1, patterns: ["sereno"] },
  { min: 21,  max: 50,   colors: ["cinzaPetreo", "dourado"],        intensity: 2, patterns: ["sereno", "eletrico"] },
  { min: 51,  max: 100,  colors: ["ambar", "magenta", "roxo"],      intensity: 3, patterns: ["eletrico"] },
  { min: 101, max: 200,  colors: ["indigo", "prata", "ciano"],      intensity: 4, patterns: ["eletrico", "caotico"] },
  { min: 201, max: 9999, colors: ["verdeNeon", "ouroBranco"],       intensity: 5, patterns: ["etereo"] },
];

// Mapeia cada cor para sua fase narrativa
export const AURA_PHASE_MAP: Record<AuraColorName, AuraPhase> = {
  verdeMusgo: 1, azulCalmo: 1, cinzaPetreo: 1,
  dourado: 2, ambar: 2, magenta: 2,
  roxo: 3, indigo: 3, prata: 3,
  ciano: 4, verdeNeon: 4, ouroBranco: 4,
};

// Peso de cada componente no c├ílculo do score
export const AURA_WEIGHTS = {
  xp: 0.4,
  decisions: 0.3,
  seasons: 0.3,
} as const;

// Cache TTL em milissegundos
export const AURA_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos
