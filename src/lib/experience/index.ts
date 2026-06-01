/**
 * ─── EXPERIENCE LAYER — Barrel Export ──────────────────────────────────────
 *
 * Single import point for the Cinematic Experience Layer.
 *
 * Usage:
 *   import { experienceLayer, cinematicPipeline } from "@/lib/experience";
 *   import type { ExperienceSnapshot, CinematicEvent } from "@/lib/experience";
 */

// ─── Experience Layer Singleton ───────────────────────────────────────────────
export { experienceLayer } from "./experience-layer";

// ─── Cinematic Pipeline ───────────────────────────────────────────────────────
export { cinematicPipeline } from "./cinematic-pipeline";
export type { PipelineState, ActiveEffect, QueueResult } from "./cinematic-pipeline";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  // Core snapshots
  ExperienceSnapshot,
  ProgressionSummary,
  CognitiveProfileSummary,

  // Render commands
  RenderCommand,
  SceneTransitionCommand,
  HudUpdateCommand,
  EffectTriggerCommand,
  DegradationCommand,

  // Cinematic events
  CinematicEvent,

  // Support types
  SceneId,
  TransitionState,
  HudSignal,
  EffectType,
  HealthStatus,

  // Contract
  IExperienceLayer,
} from "./experience.types";
