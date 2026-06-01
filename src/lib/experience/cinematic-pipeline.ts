/**
 * ─── CINEMATIC PIPELINE — Transition Queue & Rendering Management ──────────
 *
 * The CinematicPipeline receives RenderCommands from the ExperienceLayer
 * and manages their execution so no two conflicting transitions run
 * simultaneously.
 *
 * WHAT IT DOES:
 *   1. Receives RenderCommands from ExperienceLayer
 *   2. Manages a transition queue (FIFO, conflict-aware)
 *   3. Planet activation → cinematic entry sequence
 *   4. Planet completion → cinematic reward sequence
 *   5. Runtime health degraded → graceful degradation of visual effects
 *
 * PHASE 5: Cinematic Experience Layer & Oasis Runtime
 *
 * Usage:
 *   import { cinematicPipeline } from "@/lib/experience/cinematic-pipeline";
 *
 *   cinematicPipeline.queueTransition(command);
 *   const scene = cinematicPipeline.getCurrentScene();
 *   const state = cinematicPipeline.getPipelineState();
 */

import type {
  RenderCommand,
  SceneTransitionCommand,
  HudUpdateCommand,
  EffectTriggerCommand,
  DegradationCommand,
  SceneId,
  TransitionState,
  EffectType,
} from "./experience.types";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** State of the cinematic pipeline. */
export interface PipelineState {
  /** Current scene */
  currentScene: SceneId;

  /** Current transition */
  transitionState: TransitionState;

  /** Active effects */
  activeEffects: ActiveEffect[];

  /** Current degradation level */
  degradationLevel: "none" | "reduced" | "minimal" | "static";

  /** Queue depth */
  queueDepth: number;

  /** Whether the pipeline is currently processing */
  isProcessing: boolean;
}

/** An active visual effect managed by the pipeline. */
export interface ActiveEffect {
  type: EffectType;
  target: SceneId;
  intensity: number;
  startedAt: number;
  duration: number; // 0 = persistent until cleared
}

/** A queued transition waiting to be processed. */
interface QueuedTransition {
  command: SceneTransitionCommand;
  queuedAt: number;
}

/** Result of queuing a transition. */
export interface QueueResult {
  accepted: boolean;
  reason?: string;
  position: number; // 0 = immediate execution
}

// ═══════════════════════════════════════════════════════════════════════════════
// CINEMATIC PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

class CinematicPipeline {
  /** Current scene */
  private currentScene: SceneId = "home";

  /** Current transition state */
  private transitionState: TransitionState = { phase: "idle" };

  /** Queue of pending transitions */
  private queue: QueuedTransition[] = [];

  /** Maximum queue size */
  private static readonly MAX_QUEUE_SIZE = 10;

  /** Currently active visual effects */
  private activeEffects: ActiveEffect[] = [];

  /** Degradation level (set by health status) */
  private degradationLevel: "none" | "reduced" | "minimal" | "static" = "none";

  /** Whether the pipeline is currently processing a transition */
  private isProcessing = false;

  /** Transition timeout handle */
  private transitionTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Scene change callbacks */
  private onSceneChangeCallbacks: Set<(from: SceneId, to: SceneId) => void> = new Set();

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITION QUEUE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Queue a scene transition.
   *
   * Rules:
   *   - Same-scene transitions (from === to) are rejected
   *   - If idle, executes immediately
   *   - If transitioning, queues based on priority
   *   - Degraded pipeline rejects non-essential transitions
   *
   * @returns QueueResult with position and acceptance status
   */
  queueTransition(command: SceneTransitionCommand): QueueResult {
    // Reject same-scene transitions
    if (command.from === command.to) {
      return {
        accepted: false,
        reason: `Already at scene "${command.to}"`,
        position: 0,
      };
    }

    // Degraded pipeline — reject non-essential transitions
    if (
      this.degradationLevel === "minimal" &&
      command.priority > 2
    ) {
      return {
        accepted: false,
        reason: `Pipeline degraded — rejecting low-priority transition to "${command.to}"`,
        position: 0,
      };
    }

    if (this.degradationLevel === "static") {
      return {
        accepted: false,
        reason: "Pipeline is static — all transitions rejected",
        position: 0,
      };
    }

    // Check queue capacity
    if (this.queue.length >= CinematicPipeline.MAX_QUEUE_SIZE) {
      return {
        accepted: false,
        reason: `Queue full (${CinematicPipeline.MAX_QUEUE_SIZE} max)`,
        position: 0,
      };
    }

    // Remove duplicate destinations from queue (only keep latest)
    this.queue = this.queue.filter((q) => q.command.to !== command.to);

    // Queue the transition
    const queued: QueuedTransition = {
      command,
      queuedAt: Date.now(),
    };

    // Insert by priority (lower = higher priority)
    const insertIndex = this.queue.findIndex(
      (q) => q.command.priority > command.priority
    );
    if (insertIndex === -1) {
      this.queue.push(queued);
    } else {
      this.queue.splice(insertIndex, 0, queued);
    }

    const position = this.queue.indexOf(queued);

    // If idle, start processing immediately
    if (!this.isProcessing) {
      this.processNextInQueue();
    }

    return {
      accepted: true,
      position,
    };
  }

  /** Process the next transition in the queue. */
  private processNextInQueue(): void {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;

    // Sort by priority (lower first)
    this.queue.sort((a, b) => a.command.priority - b.command.priority);

    const next = this.queue.shift()!;
    this.executeTransition(next.command);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITION EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Execute a scene transition through the cinematic sequence.
   *
   * Sequence:
   *   1. Exit current scene (notify callbacks)
   *   2. Transition phase (animate)
   *   3. Enter new scene (update state, notify callbacks)
   *   4. Cleanup and process next queued item
   */
  private executeTransition(command: SceneTransitionCommand): void {
    const from = command.from;
    const to = command.to;
    const duration = this.degradationLevel === "reduced"
      ? Math.min(command.duration, 200)
      : command.duration;

    // Phase 1: Exit current scene
    this.transitionState = {
      phase: "transitioning",
      from,
      to,
      progress: 0,
    };

    // Clear any previous timeout
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }

    // Phase 2: Mid-transition
    this.transitionTimeout = setTimeout(() => {
      this.transitionState = {
        phase: "transitioning",
        from,
        to,
        progress: 0.5,
      };

      // Phase 3: Enter new scene
      this.transitionTimeout = setTimeout(() => {
        this.currentScene = to;
        this.transitionState = { phase: "complete", scene: to };

        // Notify scene change callbacks
        for (const cb of this.onSceneChangeCallbacks) {
          try {
            cb(from, to);
          } catch (err) {
            console.error("[CinematicPipeline] Scene change callback error:", err);
          }
        }

        this.isProcessing = false;

        // Process next queued transition
        this.processNextInQueue();
      }, duration / 2);
    }, duration / 2);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER COMMAND DISPATCH
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Dispatch any RenderCommand to the pipeline.
   */
  dispatch(command: RenderCommand): QueueResult | void {
    switch (command.type) {
      case "SCENE_TRANSITION":
        return this.queueTransition(command);

      case "HUD_UPDATE":
        // HUD updates are applied immediately (not queued)
        this.applyHudUpdate(command);
        return;

      case "EFFECT_TRIGGER":
        this.applyEffect(command);
        return;

      case "DEGRADATION":
        this.applyDegradation(command);
        return;
    }
  }

  /** Apply a HUD update immediately. */
  private applyHudUpdate(command: HudUpdateCommand): void {
    // In a full implementation, this would push to a HUD state manager.
    // For Phase 5, we track signals through the experience snapshot.
    if (command.clearExisting) {
      this.activeEffects = this.activeEffects.filter(
        (e) => e.duration === 0 && e.type !== "pulse_ring"
      );
    }
  }

  /** Apply a visual effect. */
  private applyEffect(command: EffectTriggerCommand): void {
    if (this.degradationLevel === "static") return;

    const intensity =
      this.degradationLevel === "minimal"
        ? command.intensity * 0.3
        : this.degradationLevel === "reduced"
          ? command.intensity * 0.6
          : command.intensity;

    const effect: ActiveEffect = {
      type: command.effect,
      target: command.target,
      intensity,
      startedAt: Date.now(),
      duration: command.duration,
    };

    // Remove existing effect of same type on same target
    this.activeEffects = this.activeEffects.filter(
      (e) => !(e.type === command.effect && e.target === command.target)
    );

    this.activeEffects.push(effect);

    // Auto-remove after duration (if not persistent)
    if (command.duration > 0) {
      setTimeout(() => {
        this.activeEffects = this.activeEffects.filter((e) => e !== effect);
      }, command.duration);
    }
  }

  /** Apply degradation based on runtime health. */
  private applyDegradation(command: DegradationCommand): void {
    this.degradationLevel = command.level;

    // Reduce intensity of all active effects
    if (command.level !== "none") {
      const factor =
        command.level === "reduced"
          ? 0.6
          : command.level === "minimal"
            ? 0.3
            : 0;
      for (const effect of this.activeEffects) {
        effect.intensity *= factor;
      }
    }

    // Remove affected effects in static mode
    if (command.level === "static") {
      this.activeEffects = this.activeEffects.filter(
        (e) => !command.affectedEffects.includes(e.type)
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE ACCESS
  // ═══════════════════════════════════════════════════════════════════════════

  getCurrentScene(): SceneId {
    return this.currentScene;
  }

  getTransitionState(): TransitionState {
    return this.transitionState;
  }

  getPipelineState(): PipelineState {
    return {
      currentScene: this.currentScene,
      transitionState: this.transitionState,
      activeEffects: [...this.activeEffects],
      degradationLevel: this.degradationLevel,
      queueDepth: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }

  /** Register a callback for scene changes. */
  onSceneChange(callback: (from: SceneId, to: SceneId) => void): () => void {
    this.onSceneChangeCallbacks.add(callback);
    return () => {
      this.onSceneChangeCallbacks.delete(callback);
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST SUPPORT
  // ═══════════════════════════════════════════════════════════════════════════

  reset(): void {
    if (process.env.NODE_ENV !== "test") {
      throw new Error(
        "CinematicPipeline.reset() is only available in test environments"
      );
    }
    this.currentScene = "home";
    this.transitionState = { phase: "idle" };
    this.queue = [];
    this.activeEffects = [];
    this.degradationLevel = "none";
    this.isProcessing = false;
    this.onSceneChangeCallbacks.clear();
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

export const cinematicPipeline = new CinematicPipeline();
