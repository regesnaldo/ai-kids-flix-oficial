/**
 * ─── NEXUS — Barrel Export ────────────────────────────────────────────────────
 *
 * Single import point for all Nexus runtime functionality.
 *
 * Usage:
 *   import { nexusRuntime, nexusBus, validateProposal, type NexusCanonicalState } from "@/lib/nexus";
 */

// ─── Singleton ────────────────────────────────────────────────────────────────
export { nexusRuntime } from "./NexusRuntime";

// ─── Event System ─────────────────────────────────────────────────────────────
export {
  nexusBus,
  universeBus, // Re-export for backward compat
  type NexusEvent,
  type NexusEventType,
  type MemorySyncEvent,
  type AgentLifecycleEvent,
  type RuntimeHealthEvent,
} from "./nexus.events";

// ─── WebSocket / SSE Runtime Sync ─────────────────────────────────────────────
export {
  wsBroadcaster,
  SSEClientWriter,
  type StateUpdatedEvent,
} from "./nexus.ws";

// ─── Guards ───────────────────────────────────────────────────────────────────
export {
  validateProposal,
  validateAuthority,
  validateScope,
  validateStateTransition,
  validateHintGenerate,
  detectConflict,
  evaluateRuntimeHealth,
} from "./nexus.guards";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  // Canonical state
  NexusCanonicalState,
  NexusHealthMetrics,

  // Agent lifecycle
  AgentRuntimeRecord,
  AgentLifecycleState,
  AgentAuthorityScope,
  SessionContext,

  // Delta proposal protocol
  DeltaProposal,
  DeltaProposalType,
  DeltaPayloadMap,
  DeltaProposalResult,

  // Conflict detection
  ConflictReport,

  // Memory governance
  MemoryAccessLevel,
  MemoryAccessPolicy,

  // Ownership
  RuntimeAssetOwner,
  OwnershipEntry,
} from "./nexus.types";

export {
  NEXUS_SCHEMA_VERSION,
  DEFAULT_UNIVERSE_AGENT_SCOPE,
  OWNERSHIP_MATRIX,
} from "./nexus.types";
