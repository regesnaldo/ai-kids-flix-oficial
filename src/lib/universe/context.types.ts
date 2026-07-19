/**
 * ─── CONTEXT TYPES — Shared Memory Compaction Contracts ──────────────────────
 *
 * These types live in their own file to break a circular dependency:
 *   nexus.events.ts → nexus.types.ts → context-compressor.ts → nexus.events.ts
 *
 * By extracting MessageStub and CompressedContext here, nexus.types.ts can
 * import them without pulling in the full context-compressor (which imports
 * from nexus.events.ts for the nexusBus singleton).
 */

import type { PlanetId } from "./planet-registry";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface MessageStub {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CompressedContext {
  /** Extracted key concepts (max 8) */
  keyConcepts: string[];
  /** Summarized insights from full history */
  unlockedInsights: string[];
  /** Detected user level */
  userLevel: "beginner" | "intermediate" | "advanced";
  /** Inferred intent from last messages */
  lastIntent: string;
  /** Compression timestamp */
  compressedAt: number;
  /** Planet this context was compressed for */
  planetId: PlanetId;
  /** Estimated token count of the compressed context */
  estimatedTokens: number;
}
