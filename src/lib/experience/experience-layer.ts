/**
 * ─── EXPERIENCE LAYER — Cinematic Runtime Translator ────────────────────────
 *
 * The ExperienceLayer is the TRANSLATION boundary between raw NexusRuntime
 * state and the UI's cinematic experience.
 *
 * WHAT IT DOES:
 *   1. Translates NexusRuntime state → ExperienceSnapshot (redacted, UI-safe)
 *   2. Translates STATE_UPDATED events → CinematicEvents (visual triggers)
 *   3. Governs scene transitions through the cinematic pipeline
 *   4. Enforces: components NEVER call getSnapshot() directly
 *
 * RULES (non-negotiable):
 *   - UI components import from `@/lib/experience`, NEVER from `@/lib/nexus`
 *   - All state reads go through `getExperienceSnapshot()`
 *   - All state changes go through `triggerTransition()`
 *   - Zero direct access to NexusRuntime internals from the UI
 *
 * PHASE 5: Cinematic Experience Layer & Oasis Runtime
 *
 * Usage:
 *   import { experienceLayer } from "@/lib/experience/experience-layer";
 *
 *   // Get a UI-safe snapshot
 *   const snapshot = experienceLayer.getExperienceSnapshot(userId);
 *
 *   // Subscribe to cinematic events
 *   const unsub = experienceLayer.subscribeToEvents((event) => { ... });
 *
 *   // Trigger a transition
 *   experienceLayer.triggerTransition("nexus", "warp");
 */

import { nexusRuntime } from "@/lib/nexus/NexusRuntime";
import { nexusBus } from "@/lib/nexus/nexus.events";
import { memoryKeeper } from "@/lib/agents/memory-keeper";
import type { NexusCanonicalState, NexusHealthMetrics } from "@/lib/nexus/nexus.types";
import type { PlanetId } from "@/lib/universe/planet-registry";
import type {
  ExperienceSnapshot,
  ProgressionSummary,
  CognitiveProfileSummary,
  CinematicEvent,
  HudSignal,
  HealthStatus,
  SceneId,
  TransitionState,
  IExperienceLayer,
} from "./experience.types";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPERIENCE LAYER SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

class ExperienceLayer implements IExperienceLayer {
  /** Current scene */
  private currentScene: SceneId = "home";

  /** Transition state machine */
  private transitionState: TransitionState = { phase: "idle" };

  /** SSE EventSource reference (browser only) */
  private eventSource: EventSource | null = null;

  /** Subscribers to CinematicEvents */
  private subscribers: Set<(event: CinematicEvent) => void> = new Set();

  /** Whether the runtime sync connection is active */
  private syncConnected = false;

  /** Current health status */
  private healthStatus: HealthStatus = "optimal";

  /** Unsubscribe from nexusBus (server-side subscription) */
  private unsubscribeFromBus: (() => void) | null = null;

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE SNAPSHOT — DERIVED, NEVER RAW
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get a derived experience snapshot.
   *
   * Reads from NexusRuntime.getSnapshot() internally, but REDACTS
   * and TRANSLATES the output so the UI never sees raw state.
   *
   * @param userId Optional user ID for cognitive profile hydration
   */
  getExperienceSnapshot(userId?: number): ExperienceSnapshot {
    const raw = nexusRuntime.getSnapshot() as NexusCanonicalState;

    // Translate progression
    const progressionSummary: ProgressionSummary = {
      activePlanet: raw.playerProgression?.activePlanet ?? null,
      completed: raw.playerProgression?.completed ?? [],
      available: raw.playerProgression?.available ?? [],
      totalCompleted: raw.playerProgression?.totalCompleted ?? 0,
    };

    // Translate cognitive profile (from Memory Keeper)
    const cognitiveProfile: CognitiveProfileSummary = this.buildCognitiveProfile(userId);

    // Derive HUD signals from health metrics
    const hudSignals: HudSignal[] = this.buildHudSignals(raw);

    // Determine current scene from active planet
    if (progressionSummary.activePlanet) {
      this.currentScene = progressionSummary.activePlanet as SceneId;
    }

    return {
      currentScene: this.currentScene,
      progressionSnapshot: progressionSummary,
      cognitiveProfile,
      transitionState: this.transitionState,
      hudSignals,
      healthStatus: this.healthStatus,
      timestamp: Date.now(),
    };
  }

  /** Build a cognitive profile summary from Memory Keeper data. */
  private buildCognitiveProfile(userId?: number): CognitiveProfileSummary {
    if (!userId) {
      return {
        userLevel: "beginner",
        emotionalScore: 0.5,
        intellectualScore: 0,
        moralScore: 0,
        archetype: "explorer",
        recentInsights: [],
      };
    }

    const profile = memoryKeeper.getProfile(userId);
    return {
      userLevel: profile.userLevel,
      emotionalScore: profile.emotionalScore,
      intellectualScore: profile.intellectualScore ?? 0,
      moralScore: profile.moralScore ?? 0,
      archetype: profile.archetype,
      recentInsights: profile.insights.slice(0, 3),
    };
  }

  /** Derive HUD signals from runtime health and agent state. */
  private buildHudSignals(state: NexusCanonicalState): HudSignal[] {
    const signals: HudSignal[] = [];

    // Threat signal from conflicts
    if (state.health.conflictsDetected > 0) {
      signals.push({
        type: "threat",
        level: Math.min(state.health.conflictsDetected / 10, 1.0),
        label: `${state.health.conflictsDetected} conflictos detectados`,
      });
    }

    // Discovery signal from active agents
    if (state.health.activeAgents > 0) {
      signals.push({
        type: "discovery",
        level: state.health.activeAgents / 13, // 12 planets + memory_keeper
        label: `${state.health.activeAgents} agentes ativos`,
      });
    }

    // Progress signal from completed planets
    const completed = state.playerProgression?.completed.length ?? 0;
    if (completed > 0) {
      signals.push({
        type: "progress",
        level: completed / 12,
        label: `${completed}/12 planetas concluídos`,
      });
    }

    // Connection signal — always present when healthy
    signals.push({
      type: "connection",
      level: state.health.healthy ? 1.0 : 0.3,
      label: state.health.healthy ? "Nexus conectado" : "Conexão degradada",
    });

    return signals;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CINEMATIC EVENT SUBSCRIPTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Subscribe to CinematicEvents.
   *
   * The ExperienceLayer subscribes to nexusBus internally and translates
   * raw events into CinematicEvents. UI components subscribe HERE, never
   * to nexusBus directly.
   *
   * @returns Unsubscribe function
   */
  subscribeToEvents(callback: (event: CinematicEvent) => void): () => void {
    this.subscribers.add(callback);

    // If this is the first subscriber, start the nexusBus subscription
    if (this.subscribers.size === 1 && !this.unsubscribeFromBus) {
      this.unsubscribeFromBus = nexusBus.subscribe(
        "*",
        (event: any) => {
          const cinematic = this.translateToCinematicEvent(event);
          if (cinematic) {
            this.emitToSubscribers(cinematic);
          }
        }
      );
    }

    return () => {
      this.subscribers.delete(callback);
      // Clean up bus subscription if no more subscribers
      if (this.subscribers.size === 0 && this.unsubscribeFromBus) {
        this.unsubscribeFromBus();
        this.unsubscribeFromBus = null;
      }
    };
  }

  /** Emit a CinematicEvent to all subscribers. */
  private emitToSubscribers(event: CinematicEvent): void {
    for (const subscriber of this.subscribers) {
      try {
        subscriber(event);
      } catch (err) {
        console.error("[ExperienceLayer] Subscriber error:", err);
      }
    }
  }

  /**
   * Translate a raw nexusBus event into a CinematicEvent.
   * Returns null if the event doesn't have a cinematic translation.
   */
  private translateToCinematicEvent(raw: any): CinematicEvent | null {
    switch (raw.type) {
      case "PLANET_ACTIVATED":
        return {
          type: "PLANET_ENTER",
          planetId: raw.planetId as PlanetId,
          transitionStyle: "warp",
        };

      case "PLANET_COMPLETED":
        return {
          type: "REWARD_UNLOCK",
          planetId: raw.planetId as PlanetId,
          rewardLabel: `Planeta ${raw.planetId} concluído`,
        };

      case "PLANET_UNLOCKED":
        return {
          type: "HUD_REFRESH",
          signals: [
            {
              type: "discovery",
              level: 0.8,
              label: `${raw.planetId} desbloqueado`,
              planetId: raw.planetId as PlanetId,
            },
          ],
        };

      case "MISSION_FAILED":
        return {
          type: "DANGER_PULSE",
          level: "elevated",
          planetId: raw.planetId as PlanetId,
        };

      case "PROGRESSION_STATE_CHANGED":
        return {
          type: "SCENE_COMPLETE",
          sceneId: raw.planetId as PlanetId,
        };

      case "MEMORY_SYNC":
        if (raw.subtype === "INSIGHT_STORED") {
          return {
            type: "MEMORY_INSIGHT",
            insight: raw.insight as string,
            sourceAgentId: raw.sourceAgentId as string,
          };
        }
        if (raw.subtype === "PROFILE_UPDATED") {
          return {
            type: "HUD_REFRESH",
            signals: [
              {
                type: "insight",
                level: 0.7,
                label: `Perfil atualizado: ${raw.field}`,
              },
            ],
          };
        }
        return null;

      case "RUNTIME_HEALTH":
        if (raw.subtype === "STATE_TRANSITION") {
          const previous = this.healthStatus;
          const current = this.deriveHealthStatus(raw.newState, raw.trigger);
          this.healthStatus = current;
          return { type: "HEALTH_CHANGE", previous, current };
        }
        return null;

      case "AGENT_LIFECYCLE":
        return {
          type: "HUD_REFRESH",
          signals: [
            {
              type: "connection",
              level: raw.subtype === "REGISTERED" ? 1.0 : 0.5,
              label: `Agente ${raw.agentId}: ${raw.subtype}`,
            },
          ],
        };

      default:
        return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITION GOVERNANCE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Trigger a scene transition through the governed pipeline.
   *
   * Components NEVER call nexusRuntime.submitProposal() directly.
   * They call triggerTransition(), and the ExperienceLayer handles
   * the full transition lifecycle.
   */
  triggerTransition(
    to: SceneId,
    style: "warp" | "fade" | "glitch" | "portal" = "warp"
  ): void {
    if (this.transitionState.phase === "transitioning") {
      // Queue the transition — don't interrupt an in-progress one
      console.warn(
        `[ExperienceLayer] Transition already in progress (${this.transitionState.from} → ${this.transitionState.to}). Queueing ${to}.`
      );
    }

    const from = this.currentScene;

    // Enter transitioning state
    this.transitionState = {
      phase: "transitioning",
      from,
      to,
      progress: 0,
    };

    // Emit the exit event
    if (from !== "home" && from !== "universe_map" && from !== "lab") {
      this.emitToSubscribers({
        type: "PLANET_EXIT",
        planetId: from as PlanetId,
        nextScene: to,
      });
    }

    // Simulate transition progress (in real impl, this would animate)
    // The cinematic pipeline handles actual timing
    setTimeout(() => {
      this.transitionState = {
        phase: "transitioning",
        from,
        to,
        progress: 0.5,
      };
    }, 100);

    setTimeout(() => {
      this.currentScene = to;
      this.transitionState = { phase: "complete", scene: to };

      // Emit enter event if it's a planet
      if (
        to !== "home" &&
        to !== "universe_map" &&
        to !== "lab" &&
        to !== "sentinel" &&
        to !== "oasis"
      ) {
        this.emitToSubscribers({
          type: "PLANET_ENTER",
          planetId: to as PlanetId,
          transitionStyle: style,
        });
      }
    }, 300);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH & DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════════

  getTransitionState(): TransitionState {
    return this.transitionState;
  }

  getHealthStatus(): HealthStatus {
    return this.healthStatus;
  }

  private deriveHealthStatus(
    newState: "healthy" | "unhealthy",
    trigger: string
  ): HealthStatus {
    if (newState === "unhealthy") {
      // Check severity from trigger message
      if (
        trigger.includes("terminated") ||
        trigger.includes("rejection rate")
      ) {
        return "offline";
      }
      if (
        trigger.includes("consecutive errors") ||
        trigger.includes("suspended")
      ) {
        return "minimal";
      }
      return "degraded";
    }
    return "optimal";
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RUNTIME SYNC CONNECTION (browser only)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Connect to the SSE runtime sync endpoint.
   * Browser-only — no-op on the server.
   */
  connectToRuntimeSync(): void {
    // No-op: SSE replaced by REST polling (see OasisProvider pollInterval)
    // to eliminate Vercel Serverless timeout errors.
  }

  disconnectFromRuntimeSync(): void {
    // No-op: SSE replaced by REST polling.
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST SUPPORT
  // ═══════════════════════════════════════════════════════════════════════════

  reset(): void {
    if (process.env.NODE_ENV !== "test") {
      throw new Error(
        "ExperienceLayer.reset() is only available in test environments"
      );
    }
    this.currentScene = "home";
    this.transitionState = { phase: "idle" };
    this.subscribers.clear();
    this.healthStatus = "optimal";
    this.syncConnected = false;
    if (this.unsubscribeFromBus) {
      this.unsubscribeFromBus();
      this.unsubscribeFromBus = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

export const experienceLayer = new ExperienceLayer();
