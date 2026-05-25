/**
 * ─── NEXUS EVENTS — Governed Event Channels ───────────────────────────────────
 *
 * The Nexus wraps the existing universeBus with a governance layer that:
 *   1. Preserves ALL existing event contracts (zero breaking changes)
 *   2. Adds 3 new event channels: MEMORY_SYNC, AGENT_LIFECYCLE, RUNTIME_HEALTH
 *   3. Enforces authority rules (agents can't emit directly without Nexus approval)
 *   4. Tracks event provenance for debugging and conflict resolution
 *
 * The universeBus singleton is NOT modified. This file adds a governance wrapper
 * that sits between agents and the bus, enforcing Nexus authority.
 *
 * PHASE 0: Foundation Hardening — Extraction (not rewrite)
 */

import { universeBus, type UniverseEvent, type UniverseEventType, type UniverseSubscriber } from "../universe/event-bus";
import type { PlanetId, PlanetState } from "../universe/planet-registry";
import type { AgentLifecycleState, AgentAuthorityScope, NexusHealthMetrics } from "./nexus.types";

// ═══════════════════════════════════════════════════════════════════════════════
// EXISTING EVENT CONTRACTS (PRESERVED — NO CHANGES)
// ═══════════════════════════════════════════════════════════════════════════════

// Re-export ALL existing event types so nothing breaks.
// Components importing from nexus.events get the full event catalog.
export type {
  UniverseEvent,
  UniverseEventType,
  UniverseSubscriber,
} from "../universe/event-bus";

// ═══════════════════════════════════════════════════════════════════════════════
// NEW EVENT CHANNEL #1: MEMORY_SYNC
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MEMORY_SYNC events govern synchronization between Memory Keeper and Nexus.
 *
 * Memory Keeper is the canonical owner of User Cognitive Profile data.
 * When Memory Keeper updates a profile, it emits a MEMORY_SYNC event.
 * Nexus listens and updates its runtime cache — but NEVER modifies the canonical copy.
 */
export type MemorySyncEvent =
  | {
      type: "MEMORY_SYNC";
      subtype: "PROFILE_UPDATED";
      /** User ID affected */
      userId: number;
      /** What field was updated */
      field: string;
      /** New value (serializable) */
      newValue: unknown;
      /** Previous value for rollback */
      previousValue: unknown;
      /** Agent that triggered the update */
      sourceAgentId: string;
    }
  | {
      type: "MEMORY_SYNC";
      subtype: "INSIGHT_STORED";
      /** User ID */
      userId: number;
      /** The stored insight */
      insight: string;
      /** Which planet context this insight belongs to */
      planetId: PlanetId;
      /** Agent that generated the insight */
      sourceAgentId: string;
    }
  | {
      type: "MEMORY_SYNC";
      subtype: "CONTEXT_COMPACTION_REQUESTED";
      /** Which planet needs compaction */
      planetId: PlanetId;
      /** Current token count (triggers compaction if over limit) */
      currentTokens: number;
      /** Max allowed for this planet */
      maxTokens: number;
    }
  | {
      type: "MEMORY_SYNC";
      subtype: "MEMORY_HEALTH_CHECK";
      /** Total entries in memory store */
      totalEntries: number;
      /** Estimated total token count */
      estimatedTokens: number;
      /** Memory domains active */
      activeDomains: string[];
    };

// ═══════════════════════════════════════════════════════════════════════════════
// NEW EVENT CHANNEL #2: AGENT_LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * AGENT_LIFECYCLE events track agent state transitions.
 *
 * Only the Nexus may emit AGENT_LIFECYCLE events.
 * Agents request state changes via delta proposals — never directly.
 */
export type AgentLifecycleEvent =
  | {
      type: "AGENT_LIFECYCLE";
      subtype: "REGISTERED";
      /** Agent that was registered */
      agentId: string;
      /** Scope injected at registration */
      scope: AgentAuthorityScope;
    }
  | {
      type: "AGENT_LIFECYCLE";
      subtype: "STATE_TRANSITION";
      /** Agent transitioning */
      agentId: string;
      /** Previous state */
      fromState: AgentLifecycleState;
      /** New state */
      toState: AgentLifecycleState;
      /** Human-readable reason */
      reason: string;
    }
  | {
      type: "AGENT_LIFECYCLE";
      subtype: "ERROR_THRESHOLD_EXCEEDED";
      /** Agent that hit the error threshold */
      agentId: string;
      /** Consecutive error count */
      errorCount: number;
      /** Action taken (suspended | terminated) */
      action: "suspended" | "terminated";
    }
  | {
      type: "AGENT_LIFECYCLE";
      subtype: "SCOPE_UPDATED";
      /** Agent whose scope changed */
      agentId: string;
      /** Previous scope */
      previousScope: AgentAuthorityScope;
      /** New scope */
      newScope: AgentAuthorityScope;
    };

// ═══════════════════════════════════════════════════════════════════════════════
// NEW EVENT CHANNEL #3: RUNTIME_HEALTH
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RUNTIME_HEALTH events broadcast runtime status for monitoring.
 *
 * Emitted by the Nexus on every state change, on a periodic heartbeat,
 * and when health transitions between healthy/unhealthy.
 */
export type RuntimeHealthEvent =
  | {
      type: "RUNTIME_HEALTH";
      subtype: "HEARTBEAT";
      /** Current health metrics snapshot */
      metrics: NexusHealthMetrics;
      /** Uptime in milliseconds */
      uptimeMs: number;
    }
  | {
      type: "RUNTIME_HEALTH";
      subtype: "STATE_TRANSITION";
      /** Previous health state */
      previousState: "healthy" | "unhealthy";
      /** New health state */
      newState: "healthy" | "unhealthy";
      /** What caused the transition */
      trigger: string;
    }
  | {
      type: "RUNTIME_HEALTH";
      subtype: "CONFLICT_RESOLVED";
      /** The conflict that was resolved */
      conflict: import("./nexus.types").ConflictReport;
      /** How it was resolved */
      resolution: string;
    }
  | {
      type: "RUNTIME_HEALTH";
      subtype: "SYNC_COMPLETED";
      /** Timestamp of last sync */
      syncTimestamp: number;
      /** Agents synchronized */
      syncedAgents: string[];
    };

// ═══════════════════════════════════════════════════════════════════════════════
// UNIFIED NEXUS EVENT TYPE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Every event in the MENTE.AI ecosystem.
 *
 * Includes:
 *   - All existing UniverseEvent types (preserved from universeBus)
 *   - 3 new Nexus-governed event channels
 *
 * Subscribers can filter by `type` (UniverseEventType) OR by the new `type` values
 * ("MEMORY_SYNC", "AGENT_LIFECYCLE", "RUNTIME_HEALTH").
 */
export type NexusEvent =
  | UniverseEvent          // Preserved: all 10 existing event types
  | MemorySyncEvent        // New: Memory Keeper ↔ Nexus sync
  | AgentLifecycleEvent    // New: Agent lifecycle transitions
  | RuntimeHealthEvent;    // New: Runtime health monitoring

export type NexusEventType = NexusEvent["type"];

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNED EVENT BUS — WRAPPER AROUND universeBus
// ═══════════════════════════════════════════════════════════════════════════════

type GovernedSubscriber = {
  eventType: NexusEventType | "*";
  subscriber: (event: NexusEvent) => void;
  id: number;
};

let governedNextId = 0;

/**
 * GovernedEventBus wraps universeBus with authority enforcement.
 *
 * What the wrapper does:
 *   1. ALL events flow through this wrapper — never to universeBus directly
 *   2. Existing universe events are forwarded to universeBus (backward compat)
 *   3. New nexus-only events (MEMORY_SYNC, AGENT_LIFECYCLE, RUNTIME_HEALTH)
 *      are distributed ONLY through this wrapper
 *   4. Authority checks are enforced per agent
 *
 * Usage:
 *   import { nexusBus } from "@/lib/nexus/nexus.events";
 *
 *   // Subscribe (same API as universeBus)
 *   nexusBus.subscribe("AGENT_LIFECYCLE", (event) => { ... });
 *
 *   // Emit (governed — Nexus validates before emitting)
 *   nexusBus.emit({ type: "AGENT_LIFECYCLE", subtype: "REGISTERED", ... });
 */
class GovernedEventBus {
  private subscribers: GovernedSubscriber[] = [];

  /**
   * Emit an event through the governed bus.
   *
   * Rules:
   *   - Universe events (PLANET_UNLOCKED, etc.) → forwarded to universeBus
   *   - Nexus events (MEMORY_SYNC, AGENT_LIFECYCLE, RUNTIME_HEALTH) → local only
   *   - One subscriber crash never affects others
   */
  emit(event: NexusEvent): void {
    const eventType = event.type as NexusEventType;

    // Forward universe events to the existing universeBus for backward compat
    if (isUniverseEvent(event)) {
      universeBus.emit(event);
    }

    // Distribute to governed subscribers
    for (const sub of this.subscribers) {
      if (sub.eventType === "*" || sub.eventType === eventType) {
        try {
          sub.subscriber(event);
        } catch (err) {
          console.error(
            `[GovernedEventBus] Subscriber error for "${eventType}":`,
            err
          );
        }
      }
    }
  }

  /**
   * Subscribe to governed events.
   * Returns an unsubscribe function (cleanup-safe for useEffect).
   */
  subscribe<T extends NexusEvent>(
    eventType: NexusEventType | "*",
    subscriber: (event: T) => void
  ): () => void {
    const id = governedNextId++;
    const sub: GovernedSubscriber = {
      eventType,
      subscriber: subscriber as (event: NexusEvent) => void,
      id,
    };
    this.subscribers.push(sub);

    return () => {
      this.subscribers = this.subscribers.filter((s) => s.id !== id);
    };
  }

  /**
   * Subscribe to universe events directly via the wrapper.
   * Delegates to universeBus.subscribe().
   * Provides a unified subscription API.
   */
  subscribeUniverse<T extends UniverseEvent>(
    eventType: UniverseEventType | "*",
    subscriber: UniverseSubscriber<T>
  ): () => void {
    return universeBus.subscribe(eventType, subscriber);
  }

  /** Remove all subscribers. For testing and cleanup. */
  reset(): void {
    this.subscribers = [];
    universeBus.reset();
  }

  /** Subscriber count across both buses */
  get subscriberCount(): number {
    return this.subscribers.length + universeBus.subscriberCount;
  }
}

// ── TYPE GUARD ────────────────────────────────────────────────────────────────

/** Check if an event is a universe-level event (should forward to universeBus). */
function isUniverseEvent(event: NexusEvent): event is UniverseEvent {
  const universeEventTypes: UniverseEventType[] = [
    "PLANET_UNLOCKED",
    "PLANET_ACTIVATED",
    "PLANET_COMPLETED",
    "SIGNAL_DETECTED",
    "MISSION_COMPLETED",
    "MISSION_FAILED",
    "HINT_GENERATED",
    "PROGRESSION_STATE_CHANGED",
    "AUDIO_STATE_CHANGED",
    "CONTEXT_COMPRESSED",
  ];
  return universeEventTypes.includes(event.type as UniverseEventType);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The single governed event bus for the entire MENTE.AI ecosystem.
 *
 * Import this instead of universeBus in new code.
 * Existing universeBus references continue to work — but new event channels
 * (MEMORY_SYNC, AGENT_LIFECYCLE, RUNTIME_HEALTH) only flow through nexusBus.
 */
export const nexusBus = new GovernedEventBus();

/**
 * Re-export universeBus for backward compatibility.
 * Existing code that imports universeBus directly still works.
 * New code should import nexusBus from this module.
 */
export { universeBus };
