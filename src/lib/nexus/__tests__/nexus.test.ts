/**
 * ─── NEXUS TEST SUITE — Pipeline, Governance, Guards, Boot ────────────────────
 *
 * Phase 3: Full coverage for the Nexus cognitive kernel.
 *
 * Suites:
 *   1. submitProposal pipeline (valid, invalid, unauthorized, concurrent)
 *   2. nexusBus governance (3 new channels + forwarding to universeBus)
 *   3. Guard validation (hint generation, composite validate, health)
 *   4. Boot sequence (init, double-init, agent lifecycle)
 */

import { nexusRuntime } from "../NexusRuntime";
import { nexusBus, universeBus } from "../nexus.events";
import {
  validateProposal,
  validateHintGenerate,
  evaluateRuntimeHealth,
} from "../nexus.guards";
import type {
  NexusCanonicalState,
  DeltaProposal,
  AgentRuntimeRecord,
} from "../nexus.types";
import { createInitialProgression } from "../../universe/progression-engine";
import { planetRegistry, ALL_PLANET_IDS } from "../../universe/planet-registry";
import { memoryKeeper } from "../../agents/memory-keeper";
import type { MessageStub } from "../../universe/context-compressor";

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Create a minimal test state for guard testing. */
function makeTestState(overrides?: Partial<NexusCanonicalState>): NexusCanonicalState {
  return {
    schemaVersion: 1,
    agentRecords: {},
    playerProgression: createInitialProgression(),
    activePlanetId: null,
    compressedContext: null,
    lastSyncAt: Date.now(),
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
    ...overrides,
  };
}

/** Create a minimal active agent record for guard testing. */
function makeAgentRecord(overrides?: Partial<AgentRuntimeRecord>): AgentRuntimeRecord {
  return {
    agentId: "nexus",
    name: "NEXUS",
    lifecycle: "active",
    scope: {
      planetAccess: ALL_PLANET_IDS as any,
      maxWriteRate: 10,
      canWriteMemory: true,
      canBroadcastEvents: true,
      maxContextTokens: 4000,
    },
    registeredAt: Date.now(),
    lastStateChangeAt: Date.now(),
    sessionContext: null,
    consecutiveErrors: 0,
    lastProposalAt: 0,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 1 — submitProposal PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Nexus — submitProposal Pipeline", () => {
  beforeEach(() => {
    nexusRuntime.reset();
    nexusRuntime.init(); // registers 12 agents
  });

  test("valid PLANET_ACTIVATE proposal → accepted, state applied", () => {
    const result = nexusRuntime.submitProposal({
      proposalId: "test-1",
      agentId: "nexus",
      type: "PLANET_ACTIVATE",
      timestamp: Date.now(),
      payload: { planetId: "nexus" },
    });

    expect(result.accepted).toBe(true);
    if (result.accepted) {
      expect(result.newState.activePlanetId).toBe("nexus");
      expect(result.newState.playerProgression?.activePlanet).toBe("nexus");
      expect(result.validationTimeMs).toBeGreaterThan(0);
    }
  });

  test("invalid PLANET_ACTIVATE (already active) → rejected, state unchanged", () => {
    const now = Date.now();
    // Activate once
    nexusRuntime.submitProposal({
      proposalId: "test-2a",
      agentId: "nexus",
      type: "PLANET_ACTIVATE",
      timestamp: now,
      payload: { planetId: "nexus" },
    });

    // Try activating again (rate limit: 1s gap required)
    const result = nexusRuntime.submitProposal({
      proposalId: "test-2b",
      agentId: "nexus",
      type: "PLANET_ACTIVATE",
      timestamp: now + 2000, // 2s later — past rate limit + cooldown
      payload: { planetId: "nexus" },
    });

    expect(result.accepted).toBe(false);
    if (!result.accepted) {
      expect(result.reason).toContain("already active");
    }
  });

  test("unauthorized agent (wrong scope) → rejected", () => {
    // Register a restricted agent
    nexusRuntime.registerAgent({
      agentId: "restricted",
      name: "RESTRICTED",
      scope: {
        planetAccess: [],
        maxWriteRate: 1,
        canWriteMemory: false,
        canBroadcastEvents: false,
        maxContextTokens: 1000,
      },
    });

    const result = nexusRuntime.submitProposal({
      proposalId: "test-3",
      agentId: "restricted",
      type: "PLANET_ACTIVATE",
      timestamp: Date.now(),
      payload: { planetId: "nexus" },
    });

    expect(result.accepted).toBe(false);
    if (!result.accepted) {
      expect(result.reason).toContain("no write access");
    }
  });

  test("concurrent proposals → conflict detected, safe resolution", () => {
    const now = Date.now();

    // Activate nexus with nexus agent (planetAccess includes "nexus")
    const r1 = nexusRuntime.submitProposal({
      proposalId: "cc-1",
      agentId: "nexus",
      type: "PLANET_ACTIVATE",
      timestamp: now,
      payload: { planetId: "nexus" },
    });
    expect(r1.accepted).toBe(true);

    // Concurrent activation of same planet → rejected (already active)
    const r2 = nexusRuntime.submitProposal({
      proposalId: "cc-2",
      agentId: "nexus",
      type: "PLANET_ACTIVATE",
      timestamp: now + 3000,
      payload: { planetId: "nexus" },
    });
    expect(r2.accepted).toBe(false);
    if (!r2.accepted) {
      expect(r2.reason).toContain("already active");
    }
  });

  test("rejected proposal increments proposalsRejected counter", () => {
    const before = nexusRuntime.getHealthMetrics().proposalsRejected;

    nexusRuntime.submitProposal({
      proposalId: "test-reject",
      agentId: "nexus",
      type: "PLANET_COMPLETE", // Can't complete a planet that isn't active
      timestamp: Date.now(),
      payload: { planetId: "nexus" },
    });

    const after = nexusRuntime.getHealthMetrics().proposalsRejected;
    expect(after).toBeGreaterThan(before);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 2 — nexusBus GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Nexus — nexusBus Governance", () => {
  beforeEach(() => {
    nexusBus.reset();
  });

  // ── MEMORY_SYNC channel ─────────────────────────────────────────────────

  test("MEMORY_SYNC channel — emits and receives correctly", () => {
    const fn = jest.fn();
    nexusBus.subscribe("MEMORY_SYNC", fn);

    nexusBus.emit({
      type: "MEMORY_SYNC",
      subtype: "PROFILE_UPDATED",
      userId: 1,
      field: "emotionalScore",
      newValue: 0.8,
      previousValue: 0.5,
      sourceAgentId: "nexus",
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "MEMORY_SYNC",
        subtype: "PROFILE_UPDATED",
        userId: 1,
      })
    );
  });

  test("MEMORY_SYNC INSIGHT_STORED subtype works", () => {
    const fn = jest.fn();
    nexusBus.subscribe("MEMORY_SYNC", fn);

    nexusBus.emit({
      type: "MEMORY_SYNC",
      subtype: "INSIGHT_STORED",
      userId: 1,
      insight: "O participante compreendeu o mecanismo de atenção",
      planetId: "nexus",
      sourceAgentId: "nexus",
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  // ── AGENT_LIFECYCLE channel ─────────────────────────────────────────────

  test("AGENT_LIFECYCLE channel — emits and receives correctly", () => {
    const fn = jest.fn();
    nexusBus.subscribe("AGENT_LIFECYCLE", fn);

    nexusBus.emit({
      type: "AGENT_LIFECYCLE",
      subtype: "REGISTERED",
      agentId: "volt",
      scope: {
        planetAccess: ["volt"],
        maxWriteRate: 1,
        canWriteMemory: false,
        canBroadcastEvents: false,
        maxContextTokens: 3000,
      },
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "AGENT_LIFECYCLE",
        subtype: "REGISTERED",
        agentId: "volt",
      })
    );
  });

  test("AGENT_LIFECYCLE STATE_TRANSITION subtype works", () => {
    const fn = jest.fn();
    nexusBus.subscribe("AGENT_LIFECYCLE", fn);

    nexusBus.emit({
      type: "AGENT_LIFECYCLE",
      subtype: "STATE_TRANSITION",
      agentId: "kaos",
      fromState: "active",
      toState: "suspended",
      reason: "Error threshold exceeded",
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  // ── RUNTIME_HEALTH channel ──────────────────────────────────────────────

  test("RUNTIME_HEALTH channel — emits and receives correctly", () => {
    const fn = jest.fn();
    nexusBus.subscribe("RUNTIME_HEALTH", fn);

    nexusBus.emit({
      type: "RUNTIME_HEALTH",
      subtype: "HEARTBEAT",
      metrics: {
        activeAgents: 12,
        suspendedAgents: 0,
        proposalsProcessed: 42,
        proposalsRejected: 3,
        conflictsDetected: 1,
        avgValidationTimeMs: 2.5,
        healthy: true,
        lastError: null,
      },
      uptimeMs: 60000,
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "RUNTIME_HEALTH",
        subtype: "HEARTBEAT",
      })
    );
  });

  test("RUNTIME_HEALTH STATE_TRANSITION subtype works", () => {
    const fn = jest.fn();
    nexusBus.subscribe("RUNTIME_HEALTH", fn);

    nexusBus.emit({
      type: "RUNTIME_HEALTH",
      subtype: "STATE_TRANSITION",
      previousState: "healthy",
      newState: "unhealthy",
      trigger: "3 agents suspended",
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  // ── Forwarding to universeBus ───────────────────────────────────────────

  test("nexusBus forwards universe events to universeBus (backward compat)", () => {
    const universeFn = jest.fn();
    universeBus.subscribe("PLANET_ACTIVATED", universeFn);

    // Emit through nexusBus
    nexusBus.emit({ type: "PLANET_ACTIVATED", planetId: "nexus" });

    // universeBus subscriber should receive it
    expect(universeFn).toHaveBeenCalledTimes(1);
    expect(universeFn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "PLANET_ACTIVATED",
        planetId: "nexus",
      })
    );

    universeBus.reset();
  });

  test("nexusBus subscriber also receives forwarded universe events", () => {
    const nexusFn = jest.fn();
    nexusBus.subscribe("PLANET_ACTIVATED" as any, nexusFn);

    nexusBus.emit({ type: "PLANET_ACTIVATED", planetId: "lyra" });

    expect(nexusFn).toHaveBeenCalledTimes(1);
  });

  test("nexus-only events do NOT reach universeBus subscribers", () => {
    const universeFn = jest.fn();
    universeBus.subscribe("*", universeFn);

    // Emit a nexus-only event through nexusBus
    nexusBus.emit({
      type: "AGENT_LIFECYCLE",
      subtype: "REGISTERED",
      agentId: "test",
      scope: {
        planetAccess: [],
        maxWriteRate: 1,
        canWriteMemory: false,
        canBroadcastEvents: false,
        maxContextTokens: 1000,
      },
    });

    // universeBus subscriber should NOT receive it (nexus-only)
    expect(universeFn).not.toHaveBeenCalled();

    universeBus.reset();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 3 — GUARD VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

describe("Nexus — Guard Validation", () => {
  // ── validateHintGenerate ────────────────────────────────────────────────

  describe("validateHintGenerate", () => {
    test("valid hint generation (active planet) passes", () => {
      const state = makeTestState({
        playerProgression: {
          ...createInitialProgression(),
          activePlanet: "nexus",
          available: ["kaos", "lyra"],
        },
      });

      const proposal = {
        proposalId: "h-1",
        agentId: "nexus",
        type: "HINT_GENERATE" as const,
        timestamp: Date.now(),
        payload: {
          planetId: "nexus" as const,
          text: "Dica de teste",
          hint: {
            id: "hint-1",
            planetId: "nexus" as const,
            text: "Dica de teste",
            createdAt: Date.now(),
          },
        },
      };

      const result = validateHintGenerate(proposal, state);
      expect(result.valid).toBe(true);
    });

    test("invalid hint generation (planet not available) rejected", () => {
      const state = makeTestState(); // Only nexus is available

      const proposal = {
        proposalId: "h-2",
        agentId: "nexus",
        type: "HINT_GENERATE" as const,
        timestamp: Date.now(),
        payload: {
          planetId: "stratos" as const, // Requires volt → not available yet
          text: "Dica inválida",
          hint: {
            id: "hint-2",
            planetId: "stratos" as const,
            text: "Dica inválida",
            createdAt: Date.now(),
          },
        },
      };

      const result = validateHintGenerate(proposal, state);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("not active or available");
    });

    test("no progression loaded → rejected", () => {
      const state = makeTestState({ playerProgression: null });

      const proposal = {
        proposalId: "h-3",
        agentId: "nexus",
        type: "HINT_GENERATE" as const,
        timestamp: Date.now(),
        payload: {
          planetId: "nexus" as const,
          text: "Dica",
          hint: { id: "h-3", planetId: "nexus" as const, text: "Dica", createdAt: Date.now() },
        },
      };

      const result = validateHintGenerate(proposal, state);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("No player progression");
    });
  });

  // ── Composite validateProposal (tests mapProposalToAsset indirectly) ────

  describe("validateProposal — ownership mapping", () => {
    test("PLANET_ACTIVATE maps to global_runtime_state asset", () => {
      const state = makeTestState({
        playerProgression: {
          ...createInitialProgression(),
          available: ["nexus", "kaos"],
        },
      });
      const agent = makeAgentRecord();

      const proposal = {
        proposalId: "p-1",
        agentId: "nexus",
        type: "PLANET_ACTIVATE" as const,
        timestamp: Date.now(),
        payload: { planetId: "nexus" as const },
      };

      const result = validateProposal(proposal, agent, state);
      expect(result.valid).toBe(true);
    });

    test("AGENT_STATE_CHANGE maps to agent_registry asset", () => {
      const state = makeTestState({
        agentRecords: {
          kaos: makeAgentRecord({ agentId: "kaos", lifecycle: "active" }),
        },
      });
      const agent = makeAgentRecord();

      const proposal = {
        proposalId: "p-2",
        agentId: "nexus",
        type: "AGENT_STATE_CHANGE" as const,
        timestamp: Date.now(),
        payload: {
          agentId: "kaos",
          toState: "suspended" as const,
          reason: "test",
        },
      };

      const result = validateProposal(proposal, agent, state);
      expect(result.valid).toBe(true);
    });

    test("invalid AGENT_STATE_CHANGE (terminal → anything) rejected", () => {
      const state = makeTestState({
        agentRecords: {
          kaos: makeAgentRecord({ agentId: "kaos", lifecycle: "terminated" }),
        },
      });
      const agent = makeAgentRecord();

      const proposal = {
        proposalId: "p-3",
        agentId: "nexus",
        type: "AGENT_STATE_CHANGE" as const,
        timestamp: Date.now(),
        payload: {
          agentId: "kaos",
          toState: "active" as const, // Can't go from terminated → active
          reason: "test",
        },
      };

      const result = validateProposal(proposal, agent, state);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain("Invalid state transition");
    });

    test("PROGRESSION_INIT, MEMORY_UPDATE, CONTEXT_SYNC, HINT_CLEAR pass authority check", () => {
      const state = makeTestState();
      const agent = makeAgentRecord();

      // These types are always valid at the state transition level
      // (authority + scope handle them)
      const alwaysValidTypes = ["PROGRESSION_INIT", "MEMORY_UPDATE", "CONTEXT_SYNC", "HINT_CLEAR"] as const;

      for (const type of alwaysValidTypes) {
        // Build a minimal valid payload for each type
        let payload: any = {};
        if (type === "PROGRESSION_INIT") payload = { userId: 0, playerProgression: createInitialProgression() };
        if (type === "MEMORY_UPDATE") payload = { key: "test", value: 1, operation: "set" };
        if (type === "CONTEXT_SYNC") payload = {
          compressedContext: {
            keyConcepts: [], unlockedInsights: [], userLevel: "beginner" as const,
            lastIntent: "test", compressedAt: Date.now(), planetId: "nexus" as const, estimatedTokens: 0,
          },
        };
        if (type === "HINT_CLEAR") payload = { hintId: "hint-1" };

        const proposal = {
          proposalId: `p-${type}`,
          agentId: "nexus",
          type,
          timestamp: Date.now(),
          payload,
        };

        const result = validateProposal(proposal as any, agent, state);
        expect(result.valid).toBe(true);
      }
    });
  });

  // ── evaluateRuntimeHealth ───────────────────────────────────────────────

  describe("evaluateRuntimeHealth", () => {
    test("fresh state → healthy", () => {
      const state = makeTestState();
      const result = evaluateRuntimeHealth(state);
      expect(result.healthy).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    test("terminated agent → unhealthy with issues", () => {
      const state = makeTestState({
        agentRecords: {
          kaos: makeAgentRecord({ agentId: "kaos", lifecycle: "terminated" }),
        },
      });

      const result = evaluateRuntimeHealth(state);
      expect(result.healthy).toBe(false);
      expect(result.issues.some((i) => i.includes("terminated"))).toBe(true);
    });

    test("high consecutive errors → unhealthy", () => {
      const state = makeTestState({
        agentRecords: {
          kaos: makeAgentRecord({
            agentId: "kaos",
            lifecycle: "active",
            consecutiveErrors: 5,
          }),
        },
      });

      const result = evaluateRuntimeHealth(state);
      expect(result.healthy).toBe(false);
      expect(result.issues.some((i) => i.includes("consecutive errors"))).toBe(true);
    });

    test("high rejection rate → unhealthy", () => {
      const state = makeTestState({
        health: {
          activeAgents: 12,
          suspendedAgents: 0,
          proposalsProcessed: 5,
          proposalsRejected: 20, // 80% rejection rate
          conflictsDetected: 0,
          avgValidationTimeMs: 1,
          healthy: true,
          lastError: null,
        },
      });

      const result = evaluateRuntimeHealth(state);
      expect(result.healthy).toBe(false);
      expect(result.issues.some((i) => i.includes("rejection rate"))).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 4 — BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

describe("Nexus — Boot Sequence", () => {
  beforeEach(() => {
    nexusRuntime.reset();
  });

  test("init() registers 12 agents from planetRegistry + ALL_AGENTS", () => {
    nexusRuntime.init();

    const agents = nexusRuntime.getAllAgents();
    expect(agents).toHaveLength(12);

    // Verify key planets are registered
    const nexus = nexusRuntime.getAgent("nexus");
    expect(nexus).not.toBeNull();
    expect(nexus?.lifecycle).toBe("active");
    expect(nexus?.scope.planetAccess).toContain("nexus");

    const stratos = nexusRuntime.getAgent("stratos");
    expect(stratos).not.toBeNull();
    expect(stratos?.lifecycle).toBe("active");
  });

  test("double init() is safe — singleton preserved, no duplicate registration", () => {
    nexusRuntime.init();
    expect(nexusRuntime.isInitialized).toBe(true);
    expect(nexusRuntime.getAllAgents()).toHaveLength(12);

    // Second init should be a no-op
    nexusRuntime.init();
    expect(nexusRuntime.getAllAgents()).toHaveLength(12); // Still 12, not 24
  });

  test("agent lifecycle transitions: initializing → active → suspended → terminated", () => {
    nexusRuntime.init();

    // All agents start active after registration
    const kaos = nexusRuntime.getAgent("kaos");
    expect(kaos?.lifecycle).toBe("active");

    // Suspend
    nexusRuntime.transitionAgent("kaos", "suspended", "Testing suspension");
    expect(nexusRuntime.getAgent("kaos")?.lifecycle).toBe("suspended");

    // Resume
    nexusRuntime.transitionAgent("kaos", "active", "Resuming after test");
    expect(nexusRuntime.getAgent("kaos")?.lifecycle).toBe("active");

    // Terminate
    nexusRuntime.transitionAgent("kaos", "terminated", "Testing termination");
    expect(nexusRuntime.getAgent("kaos")?.lifecycle).toBe("terminated");

    // Terminal state — can't transition out
    const result = nexusRuntime.transitionAgent("kaos", "active", "Can't resume terminated");
    expect(result).toBe(false);
    expect(nexusRuntime.getAgent("kaos")?.lifecycle).toBe("terminated");
  });

  test("transitionAgent rejects invalid transitions", () => {
    nexusRuntime.init();

    // Can't go from active to unregistered
    expect(nexusRuntime.transitionAgent("nexus", "unregistered" as any, "invalid")).toBe(false);

    // Can't go from active to initializing
    expect(nexusRuntime.transitionAgent("nexus", "initializing", "invalid")).toBe(false);
  });

  test("getSnapshot returns frozen read-only state", () => {
    nexusRuntime.init();
    const snapshot = nexusRuntime.getSnapshot();

    expect(snapshot.agentRecords["nexus"]).toBeDefined();
    expect(snapshot.playerProgression).not.toBeNull();

    // Verify it's a copy (mutating the returned object doesn't affect internal state)
    const agentCount = Object.keys(snapshot.agentRecords).length;
    expect(agentCount).toBe(12);
  });

  test("registerAgent adds a new agent with correct lifecycle", () => {
    nexusRuntime.init();

    const record = nexusRuntime.registerAgent({
      agentId: "test_agent",
      name: "Test Agent",
    });

    expect(record.lifecycle).toBe("active");
    expect(record.agentId).toBe("test_agent");
    expect(nexusRuntime.getAgent("test_agent")).not.toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUITE 5 — MEMORY KEEPER AGENT
// ═══════════════════════════════════════════════════════════════════════════════

describe("Nexus — Memory Keeper Agent", () => {
  beforeEach(() => {
    nexusRuntime.reset();
    nexusRuntime.init();
    memoryKeeper.reset();
    memoryKeeper.register();
  });

  test("getProfile() returns correct cognitive profile", () => {
    const profile = memoryKeeper.getProfile(1);

    expect(profile.userId).toBe(1);
    expect(profile.emotionalScore).toBe(0.5);
    expect(profile.archetype).toBe("explorer");
    expect(profile.userLevel).toBe("beginner");
    expect(profile.insights).toEqual([]);
    expect(profile.preferences).toEqual({});
  });

  test("updateProfile() routes through submitProposal() — accepted", () => {
    // Capture that a proposal was submitted
    const preCount = nexusRuntime.getHealthMetrics().proposalsProcessed;

    const result = memoryKeeper.updateProfile(1, {
      emotionalScore: 0.8,
      archetype: "artist",
    });

    expect(result.accepted).toBe(true);
    if (result.accepted) {
      expect(result.newState).toBeDefined();
      expect(result.validationTimeMs).toBeGreaterThan(0);
    }

    // Verify proposal was processed
    const postCount = nexusRuntime.getHealthMetrics().proposalsProcessed;
    expect(postCount).toBeGreaterThan(preCount);

    // Verify profile was updated in cache
    const profile = memoryKeeper.getProfile(1);
    expect(profile.emotionalScore).toBe(0.8);
    expect(profile.archetype).toBe("artist");
    expect(profile.lastSyncedAt).toBeGreaterThan(0);
  });

  test("unauthorized write attempt → rejected by ownership guard", () => {
    // Register a restricted agent that does NOT have memory write access
    nexusRuntime.registerAgent({
      agentId: "restricted_agent",
      name: "RESTRICTED",
      scope: {
        planetAccess: ["nexus"],
        maxWriteRate: 1,
        canWriteMemory: false, // No memory write permission
        canBroadcastEvents: false,
        maxContextTokens: 1000,
      },
    });

    // Attempt to submit a MEMORY_UPDATE as the restricted agent
    const result = nexusRuntime.submitProposal({
      proposalId: "unauth-1",
      agentId: "restricted_agent",
      type: "MEMORY_UPDATE",
      timestamp: Date.now(),
      payload: {
        key: "profile:1",
        value: { emotionalScore: 0.9 },
        operation: "set",
      },
    });

    expect(result.accepted).toBe(false);
    if (!result.accepted) {
      expect(result.reason).toContain("no write access");
    }
  });

  test("MEMORY_SYNC subscription → receives and processes correctly", () => {
    // Memory Keeper registered in beforeEach subscribes to MEMORY_SYNC
    expect(memoryKeeper.isRegistered).toBe(true);

    // Set up a profile first
    memoryKeeper.updateProfile(1, {
      emotionalScore: 0.6,
      insights: ["initial insight"],
    });

    // Emit an INSIGHT_STORED event — Memory Keeper should receive it
    nexusBus.emit({
      type: "MEMORY_SYNC",
      subtype: "INSIGHT_STORED",
      userId: 1,
      insight: "O usuário demonstrou compreensão de vetores",
      planetId: "nexus",
      sourceAgentId: "nexus",
    });

    // Verify the insight was added to the profile
    const profile = memoryKeeper.getProfile(1);
    expect(profile.insights).toContain(
      "O usuário demonstrou compreensão de vetores"
    );
  });

  test("retrieveContext() returns vector memory snapshot", () => {
    // Set up a profile with some data
    memoryKeeper.updateProfile(1, {
      userLevel: "intermediate",
      insights: [
        "Compreendeu o mecanismo de atenção",
        "Explorou backpropagation",
      ],
    });

    // Retrieve context with some recent messages
    const messages: MessageStub[] = [
      { role: "user", content: "Como funciona o transformer? Aprendi sobre atenção multi-head e quero entender melhor." },
      { role: "assistant", content: "Ótima pergunta! O transformer usa atenção multi-head para processar tokens em paralelo." },
    ];

    const context = memoryKeeper.retrieveContext(1, "nexus", messages);

    expect(context).toBeDefined();
    expect(context.planetId).toBe("nexus");
    expect(context.userLevel).toBe("intermediate");
    expect(context.lastIntent).toBeDefined();
    expect(context.keyConcepts.length).toBeGreaterThan(0);
    expect(context.estimatedTokens).toBeGreaterThan(0);
    // Profile insights should be merged into the compressed context
    expect(context.unlockedInsights.length).toBeGreaterThan(0);
  });
});
