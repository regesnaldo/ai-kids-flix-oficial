/**
 * ─── NEXUS GUARDS — Runtime Validation & Conflict Detection ───────────────────
 *
 * Guards are pure validation functions that the Nexus calls before applying
 * any delta proposal. They enforce:
 *   1. Ownership: who can write what asset (ownership matrix)
 *   2. Cooldown: rate limiting between proposals
 *   3. State validity: is the proposed state transition legal?
 *   4. Conflict detection: two agents trying to write the same asset
 *   5. Authority: does the agent have scope to make this change?
 *
 * ALL guards are synchronous, pure functions — deterministic, testable.
 *
 * PHASE 0: Foundation Hardening — Extraction (not rewrite)
 */

import type { PlanetId } from "../universe/planet-registry";
import type {
  DeltaProposal,
  DeltaProposalType,
  NexusCanonicalState,
  AgentRuntimeRecord,
  AgentLifecycleState,
  ConflictReport,
  OwnershipEntry,
  RuntimeAssetOwner,
} from "./nexus.types";
import { OWNERSHIP_MATRIX, type AgentAuthorityScope } from "./nexus.types";

// ═══════════════════════════════════════════════════════════════════════════════
// GUARD #1: AUTHORITY CHECK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate that the proposing agent has authority for this delta type.
 *
 * Maps each proposal type to the asset it touches, then checks
 * the ownership matrix to verify the agent has write access.
 */
export function validateAuthority(
  proposal: DeltaProposal,
  agent: AgentRuntimeRecord
): { valid: boolean; reason?: string } {
  // Determine which asset this proposal touches
  const asset = mapProposalToAsset(proposal.type);
  if (!asset) {
    return { valid: false, reason: `Unknown proposal type: ${proposal.type}` };
  }

  // Find the ownership entry
  const entry = OWNERSHIP_MATRIX.find((e) => e.asset === asset);
  if (!entry) {
    return { valid: false, reason: `No ownership entry for asset: ${asset}` };
  }

  // Map agent to runtime asset owner role
  const agentRole = mapAgentToOwnerRole(agent.agentId);

  // Check write access
  if (!entry.writeAccess.includes(agentRole)) {
    return {
      valid: false,
      reason: `Agent "${agent.agentId}" (role: ${agentRole}) has no write access to "${asset}". Owner: ${entry.owner}. Write access: ${entry.writeAccess.join(", ")}`,
    };
  }

  return { valid: true };
}

/** Map a proposal type to the runtime asset it modifies. */
function mapProposalToAsset(type: DeltaProposalType): string | null {
  switch (type) {
    case "PLANET_ACTIVATE":
    case "PLANET_COMPLETE":
    case "PROGRESSION_INIT":
      return "global_runtime_state";
    case "MEMORY_UPDATE":
      return "user_cognitive_profile";
    case "CONTEXT_SYNC":
    case "HINT_GENERATE":
    case "HINT_CLEAR":
      return "session_context";
    case "AGENT_STATE_CHANGE":
      return "agent_registry";
    default:
      return null;
  }
}

/**
 * Map agent IDs to runtime asset owner roles.
 * This is the authoritative mapping — extend when new agents are added.
 */
function mapAgentToOwnerRole(agentId: string): RuntimeAssetOwner {
  // The Nexus itself maps to "nexus"
  if (agentId === "nexus" || agentId === "__nexus_kernel__") return "nexus";

  // Memory Keeper (future: may be a separate agent)
  if (agentId === "memory_keeper" || agentId === "__memory_keeper__") return "memory_keeper";

  // Universe agents (planets) map to "runtime_layer"
  // They can read/write session context but NOT global state or registry
  return "runtime_layer";
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUARD #2: SCOPE CHECK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate that the proposal falls within the agent's authority scope.
 * Checks planet access, write permissions, and rate limits.
 */
export function validateScope(
  proposal: DeltaProposal,
  agent: AgentRuntimeRecord,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  const scope = agent.scope;

  // Check: agent must be in "active" lifecycle state
  if (agent.lifecycle !== "active") {
    return {
      valid: false,
      reason: `Agent "${agent.agentId}" is ${agent.lifecycle}, not active`,
    };
  }

  // Check: rate limit (max proposals per second)
  const msSinceLastProposal = proposal.timestamp - agent.lastProposalAt;
  const minIntervalMs = 1000 / scope.maxWriteRate;
  if (agent.lastProposalAt > 0 && msSinceLastProposal < minIntervalMs) {
    return {
      valid: false,
      reason: `Rate limit exceeded. Min interval: ${minIntervalMs}ms, actual: ${msSinceLastProposal}ms`,
    };
  }

  // Check: planet access for planet-specific proposals
  if (proposal.type === "PLANET_ACTIVATE" || proposal.type === "PLANET_COMPLETE") {
    const planetId = "payload" in proposal
      ? (proposal as DeltaProposal<"PLANET_ACTIVATE">).payload.planetId
      : (proposal as DeltaProposal<"PLANET_COMPLETE">).payload.planetId;

    if (scope.planetAccess.length > 0 && !scope.planetAccess.includes(planetId)) {
      return {
        valid: false,
        reason: `Agent "${agent.agentId}" has no planet access to "${planetId}"`,
      };
    }
  }

  // Check: memory write permission
  if (proposal.type === "MEMORY_UPDATE" && !scope.canWriteMemory) {
    return {
      valid: false,
      reason: `Agent "${agent.agentId}" does not have memory write permission`,
    };
  }

  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUARD #3: STATE VALIDITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate that the proposed state transition is legal.
 *
 * Checks:
 *   - Planet state machine: can't activate an already-active planet
 *   - Cooldown: minimum time between progression changes
 *   - Prerequisites: all required planets must be completed
 */
export function validateStateTransition(
  proposal: DeltaProposal,
  agent: AgentRuntimeRecord,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  switch (proposal.type) {
    case "PLANET_ACTIVATE":
      return validatePlanetActivate(proposal, state);
    case "PLANET_COMPLETE":
      return validatePlanetComplete(proposal, state);
    case "AGENT_STATE_CHANGE":
      return validateAgentStateChange(proposal, state);
    case "HINT_GENERATE":
      return validateHintGenerate(proposal, state);
    default:
      // PROGRESSION_INIT, MEMORY_UPDATE, CONTEXT_SYNC, HINT_CLEAR are always valid
      // (authority + scope guards handle them)
      return { valid: true };
  }
}

function validatePlanetActivate(
  proposal: DeltaProposal<"PLANET_ACTIVATE">,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  const { planetId } = proposal.payload;
  const progression = state.playerProgression;

  if (!progression) {
    return { valid: false, reason: "No player progression loaded" };
  }

  // Can't activate if already active
  if (progression.activePlanet === planetId) {
    return { valid: false, reason: `Planet "${planetId}" is already active` };
  }

  // Can't activate if already completed
  if (progression.completed.includes(planetId)) {
    return { valid: false, reason: `Planet "${planetId}" is already completed` };
  }

  // Must be available
  if (!progression.available.includes(planetId)) {
    return { valid: false, reason: `Planet "${planetId}" is not available` };
  }

  return { valid: true };
}

function validatePlanetComplete(
  proposal: DeltaProposal<"PLANET_COMPLETE">,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  const { planetId } = proposal.payload;
  const progression = state.playerProgression;

  if (!progression) {
    return { valid: false, reason: "No player progression loaded" };
  }

  // Must be active to complete
  if (progression.activePlanet !== planetId) {
    return { valid: false, reason: `Planet "${planetId}" is not active (current: ${progression.activePlanet})` };
  }

  return { valid: true };
}

export function validateHintGenerate(
  proposal: DeltaProposal<"HINT_GENERATE">,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  const { planetId } = proposal.payload;
  const progression = state.playerProgression;

  if (!progression) {
    return { valid: false, reason: "No player progression loaded" };
  }

  // Planet must be active or available to receive hints
  if (progression.activePlanet !== planetId && !progression.available.includes(planetId)) {
    return { valid: false, reason: `Planet "${planetId}" is not active or available` };
  }

  return { valid: true };
}

function validateAgentStateChange(
  proposal: DeltaProposal<"AGENT_STATE_CHANGE">,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  const { agentId, toState } = proposal.payload;
  const agentRecord = state.agentRecords[agentId];

  if (!agentRecord) {
    return { valid: false, reason: `Agent "${agentId}" not found in registry` };
  }

  const currentState = agentRecord.lifecycle;

  // Valid transitions (one-directional state machine)
  const validTransitions: Record<AgentLifecycleState, AgentLifecycleState[]> = {
    unregistered: ["initializing"],
    initializing: ["active", "terminated"], // Can terminate during init
    active: ["suspended", "terminated"],
    suspended: ["active", "terminated"], // Can resume or terminate
    terminated: [], // Terminal state — no transitions out
  };

  const allowed = validTransitions[currentState] || [];
  if (!allowed.includes(toState)) {
    return {
      valid: false,
      reason: `Invalid state transition for "${agentId}": ${currentState} → ${toState}. Allowed: ${allowed.join(", ") || "none"}`,
    };
  }

  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUARD #4: CONFLICT DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Detect conflicts between two pending proposals.
 *
 * Scenarios:
 *   - Concurrent write: two agents propose changes to the same asset
 *   - State stale: a proposal references state that has since changed
 *   - Authority violation: an agent tries to write outside its scope
 */
export function detectConflict(
  proposalA: DeltaProposal,
  proposalB: DeltaProposal,
  state: NexusCanonicalState
): ConflictReport | null {
  // Both proposals target the same asset → concurrent write conflict
  const assetA = mapProposalToAsset(proposalA.type);
  const assetB = mapProposalToAsset(proposalB.type);

  if (assetA && assetB && assetA === assetB) {
    // If they target the same planet, it's a direct conflict
    if (proposalA.type === proposalB.type) {
      const conflict = resolveConcurrentWriteConflict(
        proposalA,
        proposalB,
        assetA,
        state
      );
      if (conflict) return conflict;
    }

    // Different types targeting the same asset → potential conflict
    // e.g., PLANET_ACTIVATE and PLANET_COMPLETE on the same asset
    const conflict: ConflictReport = {
      agentA: proposalA.agentId,
      agentB: proposalB.agentId,
      type: "concurrent_write",
      description: `Both agents propose changes to "${assetA}": ${proposalA.type} vs ${proposalB.type}`,
      blockedProposal: proposalB.proposalId, // B is blocked, A proceeds
      proceededProposal: proposalA.proposalId,
      detectedAt: Date.now(),
    };
    return conflict;
  }

  return null; // No conflict
}

/**
 * Resolve concurrent write conflicts.
 *
 * Strategy: timestamp-based — earlier proposal wins.
 * If timestamps are equal, the proposal with the lexicographically smaller
 * proposalId wins (deterministic tiebreaker).
 */
function resolveConcurrentWriteConflict(
  a: DeltaProposal,
  b: DeltaProposal,
  asset: string,
  state: NexusCanonicalState
): ConflictReport | null {
  // Same exact operation on same asset → real conflict
  if (a.type === b.type) {
    // Timestamp-based resolution
    const earlier = a.timestamp <= b.timestamp ? a : b;
    const later = earlier === a ? b : a;

    return {
      agentA: earlier.agentId,
      agentB: later.agentId,
      type: "concurrent_write",
      description: `Concurrent ${a.type} on "${asset}". Earlier timestamp wins.`,
      blockedProposal: later.proposalId,
      proceededProposal: earlier.proposalId,
      detectedAt: Date.now(),
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GUARD #5: RUNTIME HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Evaluate overall runtime health based on agent states, error counts,
 * and synchronization status.
 */
export function evaluateRuntimeHealth(state: NexusCanonicalState): {
  healthy: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check: any agent in terminal state with errors
  for (const record of Object.values(state.agentRecords)) {
    if (record.lifecycle === "terminated") {
      issues.push(`Agent "${record.agentId}" is terminated`);
    }
    if (record.consecutiveErrors >= 3) {
      issues.push(`Agent "${record.agentId}" has ${record.consecutiveErrors} consecutive errors`);
    }
  }

  // Check: no active agents
  const activeCount = Object.values(state.agentRecords).filter(
    (r) => r.lifecycle === "active"
  ).length;
  if (activeCount === 0 && Object.keys(state.agentRecords).length > 0) {
    issues.push("No active agents — runtime is idle");
  }

  // Check: stale sync (no sync in over 60 seconds while agents are active)
  if (activeCount > 0 && Date.now() - state.lastSyncAt > 60_000) {
    issues.push(`Last sync was ${Math.round((Date.now() - state.lastSyncAt) / 1000)}s ago`);
  }

  // Check: high rejection rate
  const totalProposals = state.health.proposalsProcessed + state.health.proposalsRejected;
  if (totalProposals > 10) {
    const rejectionRate = state.health.proposalsRejected / totalProposals;
    if (rejectionRate > 0.5) {
      issues.push(`High proposal rejection rate: ${Math.round(rejectionRate * 100)}%`);
    }
  }

  return {
    healthy: issues.length === 0,
    issues,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITE GUARD — RUN ALL CHECKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Run all guards against a delta proposal.
 *
 * This is the single entry point for proposal validation.
 * Returns the first failing guard or success.
 *
 * Order matters:
 *   1. Authority (ownership matrix) — always first
 *   2. Scope (permissions + rate limits)
 *   3. State validity (legal transitions)
 *   4. Conflict detection (run externally against pending proposals)
 */
export function validateProposal(
  proposal: DeltaProposal,
  agent: AgentRuntimeRecord,
  state: NexusCanonicalState
): { valid: boolean; reason?: string } {
  // Guard 1: Authority
  const authority = validateAuthority(proposal, agent);
  if (!authority.valid) return authority;

  // Guard 2: Scope
  const scope = validateScope(proposal, agent, state);
  if (!scope.valid) return scope;

  // Guard 3: State validity
  const stateValidity = validateStateTransition(proposal, agent, state);
  if (!stateValidity.valid) return stateValidity;

  return { valid: true };
}
