/**
 * ─── PLANET REGISTRY — Runtime Configuration Backbone ─────────────────────────
 *
 * Planets are configuration objects ONLY. No behavior. No hardcoded logic.
 * Components read this registry and react to state — never the reverse.
 *
 * Every planet config controls:
 *   - identity (name, subtitle, color, clearance)
 *   - unlock tree (requires / unlocks)
 *   - threat level
 *   - prompt key (pointer to external prompt file)
 *   - audio signature
 *   - max context tokens for inference compression
 */

import type { DesignTokens } from "@/design-system/tokens";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type PlanetId =
  | "nexus"
  | "volt"
  | "janus"
  | "stratos"
  | "kaos"
  | "ethos"
  | "lyra"
  | "axiom"
  | "aurora"
  | "cipher"
  | "terra"
  | "prism";

export type ClearanceLevel = keyof DesignTokens["color"]["access"];
export type ThreatLevel = keyof DesignTokens["color"]["danger"];
export type PlanetState =
  | "undiscovered"
  | "available"
  | "active"
  | "completed";

export interface PlanetConfig {
  /** Unique planet identifier (lowercase) */
  id: PlanetId;
  /** Display name (UPPERCASE) */
  name: string;
  /** Portuguese subtitle — displayed below name */
  subtitle: string;
  /** Accent color (hex or rgba) */
  color: string;
  /** System clearance level */
  clearance: ClearanceLevel;
  /** Threat/danger classification */
  threatLevel: ThreatLevel;
  /** Pointer to external prompt file — NEVER embed prompts here */
  promptKey: string;
  /** Planets that become available when this one is completed */
  unlocks: PlanetId[];
  /** Planets that must be completed before this one becomes available */
  requires: PlanetId[];
  /** Audio signature key (maps to audio-manager) */
  audioSignature: AudioSignature;
  /** Max tokens for compressed context during inference */
  maxContextTokens: number;
}

export type AudioSignature =
  | "low-hum"
  | "pulse"
  | "harmonic"
  | "dissonant"
  | "bass-drone"
  | "crystal"
  | "static"
  | "choir"
  | "rhythmic"
  | "digital"
  | "organic"
  | "void";

// ─── REGISTRY ─────────────────────────────────────────────────────────────────

export const planetRegistry: Record<PlanetId, PlanetConfig> = {
  nexus: {
    id: "nexus",
    name: "NEXUS",
    subtitle: "O Conector",
    color: "#00f0ff",
    clearance: "surface",
    threatLevel: "low",
    promptKey: "nexus",
    unlocks: ["kaos", "lyra"],
    requires: [],
    audioSignature: "low-hum",
    maxContextTokens: 4000,
  },

  kaos: {
    id: "kaos",
    name: "KAOS",
    subtitle: "A Ruptura",
    color: "#f97316",
    clearance: "deep",
    threatLevel: "elevated",
    promptKey: "kaos",
    unlocks: ["ethos", "cipher"],
    requires: ["nexus"],
    audioSignature: "dissonant",
    maxContextTokens: 3500,
  },

  lyra: {
    id: "lyra",
    name: "LYRA",
    subtitle: "A Voz",
    color: "#a855f7",
    clearance: "deep",
    threatLevel: "low",
    promptKey: "lyra",
    unlocks: ["terra", "prism"],
    requires: ["nexus"],
    audioSignature: "harmonic",
    maxContextTokens: 5000,
  },

  ethos: {
    id: "ethos",
    name: "ETHOS",
    subtitle: "A Bússola",
    color: "#10b981",
    clearance: "core",
    threatLevel: "low",
    promptKey: "ethos",
    unlocks: ["volt"],
    requires: ["kaos"],
    audioSignature: "choir",
    maxContextTokens: 4500,
  },

  cipher: {
    id: "cipher",
    name: "CIPHER",
    subtitle: "O Decifrador",
    color: "#6366f1",
    clearance: "core",
    threatLevel: "elevated",
    promptKey: "cipher",
    unlocks: ["axiom"],
    requires: ["kaos"],
    audioSignature: "digital",
    maxContextTokens: 3000,
  },

  terra: {
    id: "terra",
    name: "TERRA",
    subtitle: "A Fundação",
    color: "#84cc16",
    clearance: "surface",
    threatLevel: "low",
    promptKey: "terra",
    unlocks: ["janus"],
    requires: ["lyra"],
    audioSignature: "organic",
    maxContextTokens: 4000,
  },

  prism: {
    id: "prism",
    name: "PRISM",
    subtitle: "O Espectro",
    color: "#f43f5e",
    clearance: "core",
    threatLevel: "low",
    promptKey: "prism",
    unlocks: ["aurora"],
    requires: ["lyra"],
    audioSignature: "crystal",
    maxContextTokens: 3500,
  },

  volt: {
    id: "volt",
    name: "VOLT",
    subtitle: "A Corrente",
    color: "#fbbf24",
    clearance: "deep",
    threatLevel: "elevated",
    promptKey: "volt",
    unlocks: ["stratos"],
    requires: ["ethos"],
    audioSignature: "pulse",
    maxContextTokens: 3000,
  },

  axiom: {
    id: "axiom",
    name: "AXIOM",
    subtitle: "O Princípio",
    color: "#38bdf8",
    clearance: "core",
    threatLevel: "low",
    promptKey: "axiom",
    unlocks: [],
    requires: ["cipher"],
    audioSignature: "bass-drone",
    maxContextTokens: 4000,
  },

  janus: {
    id: "janus",
    name: "JANUS",
    subtitle: "O Portal",
    color: "#a78bfa",
    clearance: "restricted",
    threatLevel: "critical",
    promptKey: "janus",
    unlocks: [],
    requires: ["terra"],
    audioSignature: "static",
    maxContextTokens: 2500,
  },

  aurora: {
    id: "aurora",
    name: "AURORA",
    subtitle: "O Horizonte",
    color: "#fb923c",
    clearance: "core",
    threatLevel: "low",
    promptKey: "aurora",
    unlocks: [],
    requires: ["prism"],
    audioSignature: "rhythmic",
    maxContextTokens: 4000,
  },

  stratos: {
    id: "stratos",
    name: "STRATOS",
    subtitle: "A Estratégia",
    color: "#14b8a6",
    clearance: "restricted",
    threatLevel: "critical",
    promptKey: "stratos",
    unlocks: [],
    requires: ["volt"],
    audioSignature: "void",
    maxContextTokens: 2500,
  },
} as const;

// ─── DERIVED DATA ─────────────────────────────────────────────────────────────

/** All planet IDs (ordered by unlock depth) */
export const ALL_PLANET_IDS = Object.keys(planetRegistry) as PlanetId[];

/** Planets available without any prerequisites */
export const STARTER_PLANETS: PlanetId[] = ALL_PLANET_IDS.filter(
  (id) => planetRegistry[id].requires.length === 0
);

/** Planets at the end of unlock chains (no further unlocks) */
export const TERMINAL_PLANETS: PlanetId[] = ALL_PLANET_IDS.filter(
  (id) => planetRegistry[id].unlocks.length === 0
);

/** Total planet count */
export const TOTAL_PLANETS = ALL_PLANET_IDS.length;
