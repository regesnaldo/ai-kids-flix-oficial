/**
 * ─── NEXUSRUNTIME — Cognitive Kernel Singleton ────────────────────────────────
 *
 * The Nexus is the cognitive kernel of MENTE.AI.
 *
 * Responsibilities:
 *   1. CANONICAL STATE HOLDER — single source of truth for runtime topology
 *   2. AGENT ORCHESTRATION — register, lifecycle, authority injection
 *   3. EVENT BUS AUTHORITY — governed event emission through nexusBus
 *   4. RUNTIME HEALTH MONITOR — state validation, conflict detection, sync
 *
 * What the Nexus does NOT do:
 *   - Execute business logic (agents do that)
 *   - Generate educational content (agents do that)
 *   - Directly render frontend experiences (components do that)
 *   - Write to canonical state directly (validates delta proposals)
 *
 * All existing components are PRESERVED:
 *   - universeBus       → wrapped by nexusBus (nexus.events.ts)
 *   - planetRegistry     → read by Nexus for agent registration
 *   - progression-engine → pure functions used for state validation
 *   - context-compressor → memory compaction, Nexus governs access
 *   - audio-manager      → lifecycle managed by Nexus
 *   - ALL_AGENTS         → registered into Nexus agentRecords
 *
 * PHASE 0: Foundation Hardening — Extraction (not rewrite)
 */

import { v4 as uuid } from "uuid";
import { planetRegistry, ALL_PLANET_IDS, type PlanetId } from "../universe/planet-registry";
import { createInitialProgression } from "../universe/progression-engine";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { nexusBus } from "./nexus.events";
import { validateProposal, detectConflict, evaluateRuntimeHealth } from "./nexus.guards";
import type {
  NexusCanonicalState,
  NexusHealthMetrics,
  AgentRuntimeRecord,
  AgentLifecycleState,
  AgentAuthorityScope,
  DeltaProposal,
  DeltaProposalType,
  DeltaProposalResult,
  DeltaPayloadMap,
  SessionContext,
  ConflictReport,
} from "./nexus.types";
import {
  NEXUS_SCHEMA_VERSION,
  DEFAULT_UNIVERSE_AGENT_SCOPE,
  OWNERSHIP_MATRIX,
} from "./nexus.types";

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

class NexusRuntime {
  // ── PRIVATE STATE ──────────────────────────────────────────────────────────

  private state: NexusCanonicalState;
  private initialized = false;
  private pendingProposals: DeltaProposal[] = [];
  private startTime: number = 0;
  private validationTimes: number[] = []; // Rolling window for avg calculation

  // ── CONSTRUCTOR ────────────────────────────────────────────────────────────

  constructor() {
    this.state = this.createEmptyState();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initialize the Nexus runtime.
   *
   * Registers ALL existing agents from ALL_AGENTS + planetRegistry.
   * Sets up the initial canonical state.
   * Call once at application startup.
   */
  init(): void {
    if (this.initialized) {
      console.warn("[NexusRuntime] Already initialized. Skipping.");
      return;
    }

    this.startTime = Date.now();

    // Register all universe agents (12 planets)
    for (const planetId of ALL_PLANET_IDS) {
      const planet = planetRegistry[planetId];
      const agentDef = ALL_AGENTS.find((a) => a.id === planetId);

      if (agentDef) {
        this.registerAgent({
          agentId: planetId,
          name: agentDef.name,
          scope: {
            ...DEFAULT_UNIVERSE_AGENT_SCOPE,
            planetAccess: [planetId],
            maxContextTokens: planet.maxContextTokens,
            canBroadcastEvents: planetId === "nexus", // Only NEXUS agent can broadcast directly
          },
        });
      }
    }

    // Register future agents here (Memory Keeper, etc.)

    this.initialized = true;
    this.state.lastSyncAt = Date.now();
    this.state.health.activeAgents = this.countActiveAgents();

    // Broadcast initialization
    nexusBus.emit({
      type: "RUNTIME_HEALTH",
      subtype: "HEARTBEAT",
      metrics: this.getHealthMetrics(),
      uptimeMs: 0,
    });

    console.log(
      `[NexusRuntime] Initialized — ${Object.keys(this.state.agentRecords).length} agents registered`
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AGENT ORCHESTRATION
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Register an agent into the Nexus runtime.
   *
   * Lifecycle: unregistered → initializing → active
   * Authority scope is injected at registration time.
   */
  registerAgent(params: {
    agentId: string;
    name: string;
    scope?: Partial<AgentAuthorityScope>;
  }): AgentRuntimeRecord {
    const { agentId, name, scope } = params;

    if (this.state.agentRecords[agentId]) {
      console.warn(`[NexusRuntime] Agent "${agentId}" already registered. Updating scope.`);
      return this.state.agentRecords[agentId];
    }

    const fullScope: AgentAuthorityScope = {
      ...DEFAULT_UNIVERSE_AGENT_SCOPE,
      ...scope,
    };

    const record: AgentRuntimeRecord = {
      agentId,
      name,
      lifecycle: "initializing",
      scope: fullScope,
      registeredAt: Date.now(),
      lastStateChangeAt: Date.now(),
      sessionContext: null,
      consecutiveErrors: 0,
      lastProposalAt: 0,
    };

    this.state.agentRecords[agentId] = record;
    this.transitionAgent(agentId, "active", "Registration complete");

    nexusBus.emit({
      type: "AGENT_LIFECYCLE",
      subtype: "REGISTERED",
      agentId,
      scope: fullScope,
    });

    return record;
  }

  /**
   * Transition an agent between lifecycle states.
   * Only the Nexus may call this — agents cannot transition themselves directly.
   */
  transitionAgent(
    agentId: string,
    toState: AgentLifecycleState,
    reason: string
  ): boolean {
    const record = this.state.agentRecords[agentId];
    if (!record) {
      console.error(`[NexusRuntime] Cannot transition unknown agent: "${agentId}"`);
      return false;
    }

    const fromState = record.lifecycle;

    // Validate transition (one-directional state machine)
    const validTransitions: Record<AgentLifecycleState, AgentLifecycleState[]> = {
      unregistered: ["initializing"],
      initializing: ["active", "terminated"],
      active: ["suspended", "terminated"],
      suspended: ["active", "terminated"],
      terminated: [],
    };

    if (!validTransitions[fromState].includes(toState)) {
      console.error(
        `[NexusRuntime] Invalid transition for "${agentId}": ${fromState} → ${toState}`
      );
      return false;
    }

    record.lifecycle = toState;
    record.lastStateChangeAt = Date.now();

    if (toState === "terminated" || toState === "suspended") {
      record.sessionContext = null;
    }

    this.state.health.activeAgents = this.countActiveAgents();
    this.state.health.suspendedAgents = this.countSuspendedAgents();

    nexusBus.emit({
      type: "AGENT_LIFECYCLE",
      subtype: "STATE_TRANSITION",
      agentId,
      fromState,
      toState,
      reason,
    });

    return true;
  }

  /**
   * Get an agent's runtime record.
   */
  getAgent(agentId: string): AgentRuntimeRecord | null {
    return this.state.agentRecords[agentId] || null;
  }

  /**
   * Get all registered agents.
   */
  getAllAgents(): AgentRuntimeRecord[] {
    return Object.values(this.state.agentRecords);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DELTA PROPOSAL PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Submit a delta proposal from an agent.
   *
   * The agent NEVER writes directly. It proposes a delta.
   * The Nexus validates, checks for conflicts, then applies or rejects.
   *
   * @returns DeltaProposalResult with accepted/rejected + new state or reason
   */
  submitProposal<T extends DeltaProposalType>(
    proposal: DeltaProposal<T>
  ): DeltaProposalResult {
    const startTime = performance.now();

    // Step 1: Resolve agent
    const agent = this.state.agentRecords[proposal.agentId];
    if (!agent) {
      return {
        accepted: false,
        proposalId: proposal.proposalId,
        reason: `Agent "${proposal.agentId}" is not registered`,
        validationTimeMs: 0,
      };
    }

    // Step 2: Run guards (authority → scope → state validity)
    const guardResult = validateProposal(proposal as DeltaProposal, agent, this.state);
    if (!guardResult.valid) {
      agent.consecutiveErrors++;
      this.state.health.proposalsRejected++;
      this.checkErrorThreshold(agent);

      return {
        accepted: false,
        proposalId: proposal.proposalId,
        reason: guardResult.reason || "Guard validation failed",
        validationTimeMs: performance.now() - startTime,
      };
    }

    // Step 3: Check for conflicts with pending proposals
    for (const pending of this.pendingProposals) {
      if (pending.agentId === proposal.agentId) continue;
      if (pending.proposalId === proposal.proposalId) continue;

      const conflict = detectConflict(
        proposal as DeltaProposal,
        pending,
        this.state
      );
      if (conflict) {
        agent.consecutiveErrors++;
        this.state.health.proposalsRejected++;
        this.state.health.conflictsDetected++;

        return {
          accepted: false,
          proposalId: proposal.proposalId,
          reason: conflict.description,
          conflict,
          validationTimeMs: performance.now() - startTime,
        };
      }
    }

    // Step 4: Apply the delta
    this.pendingProposals.push(proposal as DeltaProposal);
    this.applyDelta(proposal as DeltaProposal, agent);

    // Step 5: Clean up processed proposals
    this.pendingProposals = this.pendingProposals.filter(
      (p) => p.proposalId !== proposal.proposalId
    );

    // Update metrics
    const elapsed = performance.now() - startTime;
    this.validationTimes.push(elapsed);
    if (this.validationTimes.length > 100) this.validationTimes.shift();

    agent.consecutiveErrors = 0;
    agent.lastProposalAt = proposal.timestamp;
    this.state.health.proposalsProcessed++;
    this.state.lastSyncAt = Date.now();
    this.state.health.avgValidationTimeMs =
      this.validationTimes.reduce((a, b) => a + b, 0) / this.validationTimes.length;

    return {
      accepted: true,
      proposalId: proposal.proposalId,
      newState: this.getSnapshot(),
      validationTimeMs: elapsed,
    };
  }

  /**
   * Apply a validated delta to the canonical state.
   * Internal — only called by submitProposal after all guards pass.
   */
  private applyDelta(proposal: DeltaProposal, agent: AgentRuntimeRecord): void {
    switch (proposal.type) {
      case "PROGRESSION_INIT": {
        const { playerProgression } = (proposal as DeltaProposal<"PROGRESSION_INIT">).payload;
        this.state.playerProgression = playerProgression;
        break;
      }

      case "PLANET_ACTIVATE": {
        const { planetId } = (proposal as DeltaProposal<"PLANET_ACTIVATE">).payload;
        if (this.state.playerProgression) {
          this.state.playerProgression = {
            ...this.state.playerProgression,
            activePlanet: planetId,
            available: this.state.playerProgression.available.filter((id) => id !== planetId),
          };
        }
        this.state.activePlanetId = planetId;
        break;
      }

      case "PLANET_COMPLETE": {
        const { planetId } = (proposal as DeltaProposal<"PLANET_COMPLETE">).payload;
        if (this.state.playerProgression) {
          const planet = planetRegistry[planetId];
          const newlyUnlocked = planet.unlocks.filter(
            (id) =>
              !this.state.playerProgression!.completed.includes(id) &&
              !this.state.playerProgression!.available.includes(id)
          );
          this.state.playerProgression = {
            ...this.state.playerProgression,
            completed: [...this.state.playerProgression.completed, planetId],
            activePlanet: null,
            available: [...this.state.playerProgression.available, ...newlyUnlocked],
            totalCompleted: this.state.playerProgression.completed.length + 1,
          };
        }
        break;
      }

      case "AGENT_STATE_CHANGE": {
        const { agentId, toState, reason } = (proposal as DeltaProposal<"AGENT_STATE_CHANGE">).payload;
        this.transitionAgent(agentId, toState, reason);
        break;
      }

      case "HINT_GENERATE":
      case "HINT_CLEAR":
      case "MEMORY_UPDATE":
      case "CONTEXT_SYNC":
        // Delegate to specialized handlers (future phases)
        // For Phase 0-2, these are accepted but no-op for in-memory state
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CANONICAL STATE ACCESS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get a read-only snapshot of the canonical state.
   * Agents call this to understand current runtime topology.
   * They NEVER receive a mutable reference.
   */
  getSnapshot(): Readonly<NexusCanonicalState> {
    // structuredClone not available in jsdom (test env) — JSON round-trip as fallback
    if (typeof structuredClone === "function") {
      return Object.freeze(structuredClone(this.state));
    }
    return Object.freeze(JSON.parse(JSON.stringify(this.state)));
  }

  /**
   * Get the raw state (internal use only — not exposed to agents).
   */
  private getState(): NexusCanonicalState {
    return this.state;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RUNTIME HEALTH
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get current runtime health metrics.
   */
  getHealthMetrics(): NexusHealthMetrics {
    return { ...this.state.health };
  }

  /**
   * Run a full health evaluation.
   * Returns whether the runtime is healthy and any issues found.
   */
  runHealthCheck(): { healthy: boolean; issues: string[] } {
    const result = evaluateRuntimeHealth(this.state);
    const wasHealthy = this.state.health.healthy;

    this.state.health.healthy = result.healthy;
    this.state.health.lastError = result.issues[0] || null;

    if (wasHealthy !== result.healthy) {
      nexusBus.emit({
        type: "RUNTIME_HEALTH",
        subtype: "STATE_TRANSITION",
        previousState: wasHealthy ? "healthy" : "unhealthy",
        newState: result.healthy ? "healthy" : "unhealthy",
        trigger: result.issues[0] || "unknown",
      });
    }

    return result;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Create a session context for an agent.
   */
  createSession(agentId: string, planetId: PlanetId): SessionContext | null {
    const agent = this.state.agentRecords[agentId];
    if (!agent || agent.lifecycle !== "active") return null;

    const session: SessionContext = {
      sessionId: uuid(),
      agentId,
      planetId,
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
      turnCount: 0,
      planetState: "active",
    };

    agent.sessionContext = session;
    return session;
  }

  /**
   * End a session for an agent.
   */
  endSession(agentId: string): void {
    const agent = this.state.agentRecords[agentId];
    if (agent) {
      agent.sessionContext = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY SYNC
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Request a memory sync from the Memory Keeper.
   * Nexus never modifies user cognitive profile directly —
   * it emits a MEMORY_SYNC event and the Memory Keeper responds.
   */
  requestMemorySync(userId: number, planetId: PlanetId): void {
    nexusBus.emit({
      type: "MEMORY_SYNC",
      subtype: "CONTEXT_COMPACTION_REQUESTED",
      planetId,
      currentTokens: this.state.compressedContext?.estimatedTokens || 0,
      maxTokens: planetRegistry[planetId]?.maxContextTokens || 4000,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  private createEmptyState(): NexusCanonicalState {
    return {
      schemaVersion: NEXUS_SCHEMA_VERSION,
      agentRecords: {},
      playerProgression: createInitialProgression(),
      activePlanetId: null,
      compressedContext: null,
      lastSyncAt: 0,
      health: {
        activeAgents: 0,
        suspendedAgents: 0,
        proposalsProcessed: 0,
        proposalsRejected: 0,
        conflictsDetected: 0,
        avgValidationTimeMs: 0,
        healthy: true,
        lastError: null,
      },
    };
  }

  private countActiveAgents(): number {
    return Object.values(this.state.agentRecords).filter(
      (r) => r.lifecycle === "active"
    ).length;
  }

  private countSuspendedAgents(): number {
    return Object.values(this.state.agentRecords).filter(
      (r) => r.lifecycle === "suspended"
    ).length;
  }

  /**
   * Check if an agent has exceeded the error threshold.
   * If consecutiveErrors >= 5, suspend the agent.
   */
  private checkErrorThreshold(agent: AgentRuntimeRecord): void {
    if (agent.consecutiveErrors >= 5 && agent.lifecycle === "active") {
      this.transitionAgent(
        agent.agentId,
        "suspended",
        `Error threshold exceeded: ${agent.consecutiveErrors} consecutive errors`
      );

      nexusBus.emit({
        type: "AGENT_LIFECYCLE",
        subtype: "ERROR_THRESHOLD_EXCEEDED",
        agentId: agent.agentId,
        errorCount: agent.consecutiveErrors,
        action: "suspended",
      });
    }
  }

  /** Diagnostic: is the runtime initialized? */
  get isInitialized(): boolean {
    return this.initialized;
  }

  /** Diagnostic: uptime in milliseconds */
  get uptimeMs(): number {
    return this.startTime ? Date.now() - this.startTime : 0;
  }

  /**
   * Reset the runtime to empty state. For TESTING ONLY.
   * Resets all agent records, progression, health metrics.
   * Also resets nexusBus subscribers to isolate tests.
   */
  reset(): void {
    if (process.env.NODE_ENV !== "test") {
      throw new Error(
        "NexusRuntime.reset() is only available in test environments"
      );
    }
    this.state = this.createEmptyState();
    this.initialized = false;
    this.pendingProposals = [];
    this.validationTimes = [];
    this.startTime = 0;
    nexusBus.reset();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The single NexusRuntime instance for the entire MENTE.AI application.
 *
 * Usage:
 *   import { nexusRuntime } from "@/lib/nexus";
 *
 *   // Initialize at app startup
 *   nexusRuntime.init();
 *
 *   // Agent submits a proposal
 *   const result = nexusRuntime.submitProposal({
 *     proposalId: uuid(),
 *     agentId: "kaos",
 *     type: "PLANET_ACTIVATE",
 *     timestamp: Date.now(),
 *     payload: { planetId: "kaos" },
 *   });
 *
 *   // Read canonical state (snapshot)
 *   const state = nexusRuntime.getSnapshot();
 */
export const nexusRuntime = new NexusRuntime();
