/**
 * ─── UNIVERSE RUNTIME — Barrel Export ─────────────────────────────────────────
 *
 * Client-safe imports come from progression-engine.ts (pure functions only).
 * Server-only DB functions come from progression-engine.server.ts.
 */

// ─── Configuration ────────────────────────────────────────────────────────────
export {
  planetRegistry,
  ALL_PLANET_IDS,
  STARTER_PLANETS,
  TERMINAL_PLANETS,
  TOTAL_PLANETS,
  type PlanetId,
  type PlanetConfig,
  type PlanetState,
  type ClearanceLevel,
  type ThreatLevel,
  type AudioSignature,
} from "./planet-registry";

// ─── Event System ─────────────────────────────────────────────────────────────
export {
  universeBus,
  type UniverseEvent,
  type UniverseEventType,
  type UniverseSubscriber,
} from "./event-bus";

// ─── Progression (client-safe — pure functions + types) ───────────────────────
export {
  createInitialProgression,
  normalizeProgression,
  calculatePlanetState,
  getUniverseSnapshot,
  countByState,
  SCHEMA_VERSION,
  PROGRESSION_COOLDOWN_MS,
  MAX_ACTIVE_HINTS,
  type PlayerProgression,
  type Hint,
  type ActionResult,
  type HintResult,
} from "./progression-engine";

// ─── Context Compression ──────────────────────────────────────────────────────
export {
  compressMemory,
  buildInferencePayload,
  type CompressedContext,
  type MessageStub,
} from "./context-compressor";

// ─── Prompt Management ────────────────────────────────────────────────────────
export {
  loadPlanetPrompt,
  getPlanetPromptSync,
  warmPromptCache,
  clearPromptCache,
} from "./prompt-loader";

// ─── Audio ────────────────────────────────────────────────────────────────────
export { audioManager } from "./audio-manager";
