/**
 * ─── EXPERIENCE LAYER CONTRACTS — Phase 5 Cinematic Runtime ─────────────────
 *
 * The Experience Layer sits between the raw NexusRuntime and the UI.
 * This file defines the contract — the types and interfaces that enforce
 * the boundary.
 *
 * RULE: Components call getExperienceSnapshot(), NEVER getSnapshot() directly.
 * RULE: Components trigger transitions, NEVER call submitProposal() directly.
 * RULE: No React component may import from @/lib/nexus.
 *
 * PHASE 5: Cinematic Experience Layer & Oasis Runtime
 */

import type {
  NexusCanonicalState,
  NexusHealthMetrics,
} from "@/lib/nexus/nexus.types";
import type { PlanetId } from "@/lib/universe/planet-registry";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE SNAPSHOT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ExperienceSnapshot — what the UI receives.
 *
 * Derived from nexusRuntime.getSnapshot() but REDACTED and TRANSLATED.
 * The UI NEVER receives raw agent records, internal lifecycle states,
 * or implementation details. It receives only what's relevant for rendering
 * the cinematic experience.
 */
export interface ExperienceSnapshot {
  /** Current scene (which planet/view is active) */
  currentScene: SceneId;

  /** Player progression summary (simplified) */
  progressionSnapshot: ProgressionSummary;

  /** Cognitive profile from Memory Keeper (if available) */
  cognitiveProfile: CognitiveProfileSummary;

  /** Current transition state (idle | transitioning | complete) */
  transitionState: TransitionState;

  /** Visual hints for the HUD layer */
  hudSignals: HudSignal[];

  /** Health status for graceful degradation */
  healthStatus: HealthStatus;

  /** Timestamp of this snapshot */
  timestamp: number;
}

/** Which scene is currently active. */
export type SceneId =
  | "home"
  | "universe_map"
  | PlanetId
  | "lab"
  | "sentinel"
  | "oasis";

/** Simplified progression — the UI doesn't need agent records. */
export interface ProgressionSummary {
  /** Currently active planet */
  activePlanet: PlanetId | null;

  /** Completed planets */
  completed: PlanetId[];

  /** Available planets (unlocked but not yet started) */
  available: PlanetId[];

  /** Total planets completed */
  totalCompleted: number;
}

/** Cognitive profile summary from Memory Keeper. */
export interface CognitiveProfileSummary {
  /** User level classification */
  userLevel: "beginner" | "intermediate" | "advanced";

  /** Emotional score 0.0-1.0 */
  emotionalScore: number;

  /** Intellectual score 0.0-1.0 */
  intellectualScore: number;

  /** Moral score 0.0-1.0 */
  moralScore: number;

  /** Archetype label */
  archetype: string;

  /** Recent insights (max 3) */
  recentInsights: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDER COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RenderCommand — what the UI receives to trigger visual changes.
 *
 * NEVER raw NexusRuntime state. The ExperienceLayer translates
 * state deltas into actionable commands the rendering pipeline understands.
 */
export type RenderCommand =
  | SceneTransitionCommand
  | HudUpdateCommand
  | EffectTriggerCommand
  | DegradationCommand;

/** Switch to a new scene (planet activation, navigation). */
export interface SceneTransitionCommand {
  type: "SCENE_TRANSITION";
  from: SceneId;
  to: SceneId;
  /** Cinematic transition style */
  style: "warp" | "fade" | "glitch" | "portal" | "dissolve";
  /** Duration in milliseconds */
  duration: number;
  /** Priority (lower = higher priority) */
  priority: number;
}

/** Update HUD signals (health bars, scanner rings, etc.). */
export interface HudUpdateCommand {
  type: "HUD_UPDATE";
  signals: HudSignal[];
  /** Clear all existing signals first */
  clearExisting: boolean;
}

/** Trigger a visual effect (particles, glitch, pulse). */
export interface EffectTriggerCommand {
  type: "EFFECT_TRIGGER";
  effect: EffectType;
  target: SceneId;
  /** Duration in ms (0 = persistent) */
  duration: number;
  /** Intensity 0.0-1.0 */
  intensity: number;
}

/** Graceful degradation of visual effects. */
export interface DegradationCommand {
  type: "DEGRADATION";
  level: "none" | "reduced" | "minimal" | "static";
  reason: string;
  affectedEffects: EffectType[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CINEMATIC EVENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * CinematicEvent — SSE/WebSocket events translated to visual triggers.
 *
 * Raw STATE_UPDATED events from the runtime sync endpoint are mapped
 * to CinematicEvents by the ExperienceLayer. The UI subscribes to these
 * via subscribeToEvents().
 */
export type CinematicEvent =
  | { type: "PLANET_ENTER"; planetId: PlanetId; transitionStyle: "warp" | "fade" | "glitch" | "portal" }
  | { type: "PLANET_EXIT"; planetId: PlanetId; nextScene: SceneId }
  | { type: "REWARD_UNLOCK"; planetId: PlanetId; rewardLabel: string }
  | { type: "DANGER_PULSE"; level: "low" | "elevated" | "critical"; planetId: PlanetId }
  | { type: "HUD_REFRESH"; signals: HudSignal[] }
  | { type: "HEALTH_CHANGE"; previous: HealthStatus; current: HealthStatus }
  | { type: "MEMORY_INSIGHT"; insight: string; sourceAgentId: string }
  | { type: "SCENE_COMPLETE"; sceneId: SceneId };

// ═══════════════════════════════════════════════════════════════════════════════
// SUPPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Transition state machine states. */
export type TransitionState =
  | { phase: "idle" }
  | { phase: "transitioning"; from: SceneId; to: SceneId; progress: number }
  | { phase: "complete"; scene: SceneId };

/** HUD signal types from the design system. */
export interface HudSignal {
  type: "threat" | "discovery" | "progress" | "connection" | "insight";
  level: number; // 0.0-1.0
  label: string;
  planetId?: PlanetId;
}

/** Visual effect types for the rendering pipeline. */
export type EffectType =
  | "particle_burst"
  | "glitch_overlay"
  | "scanline"
  | "chromatic_aberration"
  | "pulse_ring"
  | "neon_trail"
  | "vector_grid"
  | "hologram";

/** Health status for graceful degradation. */
export type HealthStatus = "optimal" | "degraded" | "minimal" | "offline";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE LAYER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Contract that the ExperienceLayer implements.
 *
 * This is the ONLY interface the UI may call to interact with the runtime.
 * Components NEVER import NexusRuntime, nexusBus, or memoryKeeper directly.
 */
export interface IExperienceLayer {
  /** Get a derived experience snapshot — NEVER exposes raw state. */
  getExperienceSnapshot(userId?: number): ExperienceSnapshot;

  /** Subscribe to cinematic events from the runtime sync stream. */
  subscribeToEvents(callback: (event: CinematicEvent) => void): () => void;

  /** Trigger a scene transition through the governed pipeline. */
  triggerTransition(to: SceneId, style?: "warp" | "fade" | "glitch" | "portal"): void;

  /** Get the current transition state. */
  getTransitionState(): TransitionState;

  /** Check current health status for graceful degradation. */
  getHealthStatus(): HealthStatus;

  /** Connect to the SSE runtime sync endpoint. */
  connectToRuntimeSync(): void;

  /** Disconnect from the runtime sync endpoint. */
  disconnectFromRuntimeSync(): void;

  /** Reset for testing only. */
  reset(): void;
}
