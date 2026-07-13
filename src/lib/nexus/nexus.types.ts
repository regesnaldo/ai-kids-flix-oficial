/**
 * ─── NEXUS TYPES — Canonical Runtime State & Delta Proposals ──────────────────
 *
 * The Nexus is the cognitive kernel of MENTE.AI. It holds the single source
 * of truth for runtime topology. Agents READ via Nexus-approved contracts.
 * Agents NEVER write directly — they propose a delta, Nexus validates, then applies.
 *
 * This file defines the shape of canonical state and the delta proposal protocol.
 * Every runtime component that touches state MUST reference these contracts.
 *
 * PHASE 0: Foundation Hardening — Extraction (not rewrite)
 */

import type { PlanetId, PlanetState } from "../universe/planet-registry";
import type { PlayerProgression } from "../universe/progression-engine";
import type { CompressedContext } from "../universe/context.types";

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/** Agent lifecycle states — finite state machine, one-directional. */
export type AgentLifecycleState =
  | "unregistered"  // Not yet registered with Nexus
  | "initializing"  // Registration in progress, wiring dependencies
  | "active"        // Fully operational, accepting delta proposals
  | "suspended"     // Temporarily paused (resource constraint, cooldown)
  | "terminated";   // Permanently decommissioned

/** Authority scope injected into each agent at registration time. */
export interface AgentAuthorityScope {
  /** Which planet domains this agent may access */
  planetAccess: PlanetId[];
  /** Maximum write operations per second (rate limit) */
  maxWriteRate: number;
  /** Whether this agent may propose memory deltas */
  canWriteMemory: boolean;
  /** Whether this agent may broadcast events directly (vs. through Nexus) */
  canBroadcastEvents: boolean;
  /** Maximum context tokens this agent may consume per inference */
  maxContextTokens: number;
}

/** Runtime agent record held by the Nexus. */
export interface AgentRuntimeRecord {
  /** Canonical agent ID (matches PlanetId for universe agents) */
  agentId: string;
  /** Display name */
  name: string;
  /** Current lifecycle state */
  lifecycle: AgentLifecycleState;
  /** Authority scope active for this agent */
  scope: AgentAuthorityScope;
  /** Timestamp of registration */
  registeredAt: number;
  /** Timestamp of last state transition */
  lastStateChangeAt: number;
  /** Current session context (if active) */
  sessionContext: SessionContext | null;
  /** Error count since last successful operation */
  consecutiveErrors: number;
  /** Last delta proposal timestamp */
  lastProposalAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL RUNTIME STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The NexusRuntime canonical state.
 * This is the single source of truth — read by all, written only by Nexus.
 */
export interface NexusCanonicalState {
  /** Schema version for migration safety */
  schemaVersion: number;

  /** All registered agents indexed by agentId */
  agentRecords: Record<string, AgentRuntimeRecord>;

  /** Global player progression (single player mode for now) */
  playerProgression: PlayerProgression | null;

  /** Currently active planet (for UI + routing) */
  activePlanetId: PlanetId | null;

  /** Memory Keeper's latest compressed context */
  compressedContext: CompressedContext | null;

  /** Timestamp of last state synchronization */
  lastSyncAt: number;

  /** Runtime health metrics */
  health: NexusHealthMetrics;
}

/** Health diagnostics aggregated by the Nexus. */
export interface NexusHealthMetrics {
  /** Number of agents currently active */
  activeAgents: number;
  /** Number of agents suspended */
  suspendedAgents: number;
  /** Total delta proposals processed */
  proposalsProcessed: number;
  /** Total proposals rejected */
  proposalsRejected: number;
  /** Conflict count since last reset */
  conflictsDetected: number;
  /** Average proposal validation time (ms) */
  avgValidationTimeMs: number;
  /** Is the runtime in a healthy state? */
  healthy: boolean;
  /** Last error message (if unhealthy) */
  lastError: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

/** Per-agent session context — ephemeral, not persisted to DB. */
export interface SessionContext {
  /** Session identifier */
  sessionId: string;
  /** Agent that owns this session */
  agentId: string;
  /** Planet this session is bound to */
  planetId: PlanetId;
  /** Session start timestamp */
  startedAt: number;
  /** Last activity timestamp */
  lastActivityAt: number;
  /** Conversation turn count */
  turnCount: number;
  /** Current planet state during this session */
  planetState: PlanetState;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELTA PROPOSAL PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A delta proposal is what agents submit when they want to change state.
 * The agent NEVER writes directly — it proposes, Nexus validates, Nexus applies.
 */
export interface DeltaProposal<T extends DeltaProposalType = DeltaProposalType> {
  /** Unique proposal ID (generated by agent) */
  proposalId: string;
  /** Agent submitting the proposal */
  agentId: string;
  /** Type of state change being proposed */
  type: T;
  /** Timestamp of proposal */
  timestamp: number;
  /** The proposed change data (shape depends on type) */
  payload: DeltaPayloadMap[T];
}

/** Every type of state change an agent can propose. */
export type DeltaProposalType =
  | "PLANET_ACTIVATE"
  | "PLANET_COMPLETE"
  | "PROGRESSION_INIT"
  | "HINT_GENERATE"
  | "HINT_CLEAR"
  | "MEMORY_UPDATE"
  | "CONTEXT_SYNC"
  | "AGENT_STATE_CHANGE";

/** Payload shapes keyed by proposal type. */
export interface DeltaPayloadMap {
  PLANET_ACTIVATE: { planetId: PlanetId };
  PLANET_COMPLETE: { planetId: PlanetId };
  PROGRESSION_INIT: { userId: number; playerProgression: import("../universe/progression-engine").PlayerProgression };
  HINT_GENERATE: { planetId: PlanetId; text: string; hint: { id: string; planetId: PlanetId; text: string; createdAt: number } };
  HINT_CLEAR: { hintId: string };
  MEMORY_UPDATE: { key: string; value: unknown; operation: "set" | "delete" };
  CONTEXT_SYNC: { compressedContext: CompressedContext };
  AGENT_STATE_CHANGE: { agentId: string; toState: AgentLifecycleState; reason: string };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPOSAL RESULT
// ═══════════════════════════════════════════════════════════════════════════════

/** Result of a delta proposal after Nexus validation. */
export type DeltaProposalResult =
  | {
      accepted: true;
      proposalId: string;
      /** The updated canonical state (after applying the delta) */
      newState: NexusCanonicalState;
      /** Validation duration in ms */
      validationTimeMs: number;
    }
  | {
      accepted: false;
      proposalId: string;
      /** Why the proposal was rejected */
      reason: string;
      /** Conflict details (if applicable) */
      conflict?: ConflictReport;
      /** Validation duration in ms */
      validationTimeMs: number;
    };

// ═══════════════════════════════════════════════════════════════════════════════
// CONFLICT DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/** Report of a conflict detected between two agent proposals. */
export interface ConflictReport {
  /** First conflicting agent */
  agentA: string;
  /** Second conflicting agent */
  agentB: string;
  /** What kind of conflict */
  type: "concurrent_write" | "state_stale" | "authority_violation";
  /** Description of the conflict */
  description: string;
  /** Which proposal was blocked */
  blockedProposal: string;
  /** Which proposal proceeded */
  proceededProposal: string;
  /** Timestamp of detection */
  detectedAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY ACCESS GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Memory access levels — governs which agent can read/write what memory.
 */
export type MemoryAccessLevel = "read" | "write" | "none";

export interface MemoryAccessPolicy {
  /** Which memory domain this policy applies to */
  domain: "user_cognitive_profile" | "session_context" | "event_log" | "agent_registry" | "runtime_state";
  /** Default access for agents not explicitly listed */
  defaultAccess: MemoryAccessLevel;
  /** Per-agent overrides */
  agentOverrides: Record<string, MemoryAccessLevel>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUNTIME OWNERSHIP MATRIX (type-level enforcement)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ownership matrix — defines who OWNS each runtime asset.
 * This is the type-level encoding of the non-negotiable ownership rules.
 *
 * Asset                  | Owner          | Write Access
 * Global Runtime State   | Nexus          | Nexus only
 * User Cognitive Profile | Memory Keeper  | Memory Keeper + Nexus
 * Session Context        | Runtime Layer  | Current Agent + Nexus
 * Event Log              | Event Bus      | Append-only (any agent)
 * Agent Registry         | Nexus          | Nexus only
 */
export type RuntimeAssetOwner =
  | "nexus"
  | "memory_keeper"
  | "runtime_layer"
  | "event_bus";

export interface OwnershipEntry {
  asset: string;
  owner: RuntimeAssetOwner;
  writeAccess: RuntimeAssetOwner[];
  readAccess: RuntimeAssetOwner[];
}

export const OWNERSHIP_MATRIX: readonly OwnershipEntry[] = [
  {
    asset: "global_runtime_state",
    owner: "nexus",
    writeAccess: ["nexus"],
    readAccess: ["nexus", "memory_keeper", "runtime_layer", "event_bus"],
  },
  {
    asset: "user_cognitive_profile",
    owner: "memory_keeper",
    writeAccess: ["memory_keeper", "nexus"],
    readAccess: ["nexus", "memory_keeper", "runtime_layer"],
  },
  {
    asset: "session_context",
    owner: "runtime_layer",
    writeAccess: ["runtime_layer", "nexus"],
    readAccess: ["nexus", "memory_keeper", "runtime_layer"],
  },
  {
    asset: "event_log",
    owner: "event_bus",
    writeAccess: ["nexus", "memory_keeper", "runtime_layer", "event_bus"],
    readAccess: ["nexus", "memory_keeper", "runtime_layer", "event_bus"],
  },
  {
    asset: "agent_registry",
    owner: "nexus",
    writeAccess: ["nexus"],
    readAccess: ["nexus", "memory_keeper", "runtime_layer", "event_bus"],
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MIGRATION SAFETY
// ═══════════════════════════════════════════════════════════════════════════════

/** Current schema version — bump when NexusCanonicalState shape changes */
export const NEXUS_SCHEMA_VERSION = 1;

/** Default authority scope for universe agents (12 planets). */
export const DEFAULT_UNIVERSE_AGENT_SCOPE: AgentAuthorityScope = {
  planetAccess: [], // Populated at registration from planetRegistry
  maxWriteRate: 1, // 1 proposal per second max
  canWriteMemory: false, // Only Memory Keeper can write memory
  canBroadcastEvents: false, // Events go through Nexus
  maxContextTokens: 4000,
};
