/**
 * ─── UNIVERSE RUNTIME — Barrel Export ─────────────────────────────────────────
 *
 * Single import point for all universe runtime modules.
 *
 * Usage:
 *   import { planetRegistry, calculatePlanetState, universeBus,
 *            compressMemory, loadPlanetPrompt, audioManager }
 *     from "@/lib/universe";
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

// ─── Progression ──────────────────────────────────────────────────────────────
export {
  createInitialProgression,
  calculatePlanetState,
  activatePlanet,
  completePlanet,
  generateHint,
  clearHint,
  getUniverseSnapshot,
  countByState,
  type PlayerProgression,
  type Hint,
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
