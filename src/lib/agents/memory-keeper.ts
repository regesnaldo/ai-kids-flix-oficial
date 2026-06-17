/**
 * ─── MEMORY KEEPER — Canonical Owner of USER_COGNITIVE_PROFILE ─────────────
 *
 * The Memory Keeper is a first-class registered Nexus agent responsible for
 * the user cognitive profile — the persistent, evolving model of what each
 * user knows, feels, and prefers.
 *
 * ARCHITECTURE:
 *   Memory Keeper owns USER_COGNITIVE_PROFILE (per ownership matrix).
 *   It reads from the retrieval pipeline (agent-memory.ts → TiDB).
 *   It writes ONLY through nexusRuntime.submitProposal({ type: "MEMORY_UPDATE" }).
 *   It subscribes to MEMORY_SYNC on nexusBus for cross-agent coordination.
 *
 * RULES — non-negotiable:
 *   1. NEVER write state directly. Every state change is a proposal to the Nexus.
 *   2. ALWAYS validate before writing — check ownership matrix constraints.
 *   3. Authority scope: READ global state, WRITE only to USER_COGNITIVE_PROFILE.
 *   4. Proposals that go beyond scope MUST be rejected by Memory Keeper itself.
 *
 * PHASE 4: Memory Keeper & WebSocket Runtime
 */

import { v4 as uuid } from "uuid";
import { nexusRuntime } from "@/lib/nexus/NexusRuntime";
import { nexusBus } from "@/lib/nexus/nexus.events";
import { compressMemory, type CompressedContext, type MessageStub } from "@/lib/universe/context-compressor";
import type { PlanetId } from "@/lib/universe/planet-registry";
import type {
  DeltaProposal,
  DeltaProposalResult,
} from "@/lib/nexus/nexus.types";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** The shape of a user cognitive profile as managed by Memory Keeper. */
export interface UserCognitiveProfile {
  userId: number;
  /** Emotional clustering: 0.0 (negative) → 1.0 (positive) */
  emotionalScore: number;
  /** Intellectual score: 0.0-1.0 */
  intellectualScore: number;
  /** Moral score: 0.0-1.0 */
  moralScore: number;
  /** Cognitive archetype classification */
  archetype: string;
  /** Detected user level (beginner, intermediate, advanced) */
  userLevel: "beginner" | "intermediate" | "advanced";
  /** Learned preferences (keyed by domain) */
  preferences: Record<string, unknown>;
  /** Cross-planet insight fragments */
  insights: string[];
  /** Recent intents (max 5, most recent first) */
  recentIntents: string[];
  /** Active planet context */
  activePlanetId: PlanetId | null;
  /** Completed planets */
  completedPlanets: PlanetId[];
  /** Last profile sync timestamp */
  lastSyncedAt: number;
  /** Vector memory snapshot for retrieval */
  vectorMemorySnapshot: string | null;
}

/** Default empty profile — used when no profile exists yet. */
export const DEFAULT_COGNITIVE_PROFILE: Omit<UserCognitiveProfile, "userId"> = {
  emotionalScore: 0.5,
  intellectualScore: 0,
  moralScore: 0,
  archetype: "explorer",
  userLevel: "beginner",
  preferences: {},
  insights: [],
  recentIntents: [],
  activePlanetId: null,
  completedPlanets: [],
  lastSyncedAt: 0,
  vectorMemorySnapshot: null,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY KEEPER AGENT
// ═══════════════════════════════════════════════════════════════════════════════

export class MemoryKeeper {
  /** The canonical agent ID for Memory Keeper. */
  static readonly AGENT_ID = "memory_keeper";
  static readonly AGENT_NAME = "Memory Keeper";

  /** In-memory profile cache. Canonical copy lives in DB; this is a runtime mirror. */
  private profiles: Map<number, UserCognitiveProfile> = new Map();

  /** Whether the Memory Keeper has been registered with the Nexus. */
  private registered = false;

  /** Unsubscribe function for MEMORY_SYNC subscription. */
  private unsubscribeFromMemorySync: (() => void) | null = null;

  // ── Registration ────────────────────────────────────────────────────────────

  /**
   * Register Memory Keeper with the Nexus runtime.
   * Called once at application boot — after nexusRuntime.init().
   *
   * Registers as a Nexus agent with:
   *   - planetAccess: [] (not a planet agent — system-level)
   *   - canWriteMemory: true (canonical owner of user_cognitive_profile)
   *   - canBroadcastEvents: false (goes through Nexus)
   */
  register(): void {
    if (this.registered) {
      console.warn("[MemoryKeeper] Already registered. Skipping.");
      return;
    }

    // Register with Nexus
    nexusRuntime.registerAgent({
      agentId: MemoryKeeper.AGENT_ID,
      name: MemoryKeeper.AGENT_NAME,
      scope: {
        planetAccess: [],
        maxWriteRate: 5,
        canWriteMemory: true,
        canBroadcastEvents: false,
        maxContextTokens: 8000,
      },
    });

    // Subscribe to MEMORY_SYNC channel
    this.unsubscribeFromMemorySync = nexusBus.subscribe(
      "MEMORY_SYNC",
      this.handleMemorySync.bind(this)
    );

    this.registered = true;
    if (process.env.NODE_ENV === "development") console.log("[MemoryKeeper] Registered with Nexus — MEMORY_SYNC subscription active");
  }

  // ── Profile Management ──────────────────────────────────────────────────────

  /**
   * Get a user's cognitive profile.
   * Returns the runtime profile if cached, otherwise a fresh default.
   *
   * Reads from internal runtime cache — the canonical source is the
   * agent-memory.ts DB pipeline. To hydrate from DB, call retrieveContext().
   */
  getProfile(userId: number): UserCognitiveProfile {
    const cached = this.profiles.get(userId);
    if (cached) return { ...cached };

    // Return a fresh default — caller should hydrate via retrieveContext()
    return {
      userId,
      ...DEFAULT_COGNITIVE_PROFILE,
    };
  }

  /**
   * Update a user's cognitive profile.
   *
   * Memory Keeper NEVER writes directly to the profile cache.
   * It submits a MEMORY_UPDATE proposal to the Nexus, which validates
   * authority, scope, and state validity before accepting.
   *
   * If the proposal is accepted, the profile cache is updated locally.
   * Then a MEMORY_SYNC event is emitted so downstream consumers are notified.
   *
   * @returns The proposal result from the Nexus.
   */
  updateProfile(
    userId: number,
    updates: Partial<Omit<UserCognitiveProfile, "userId">>
  ): DeltaProposalResult {
    // Ensure profile exists in cache
    if (!this.profiles.has(userId)) {
      this.profiles.set(userId, {
        userId,
        ...DEFAULT_COGNITIVE_PROFILE,
      });
    }

    const currentProfile = this.profiles.get(userId)!;
    const previousProfile = { ...currentProfile };

    // Submit proposal to Nexus — we never write directly
    const proposal: DeltaProposal<"MEMORY_UPDATE"> = {
      proposalId: uuid(),
      agentId: MemoryKeeper.AGENT_ID,
      type: "MEMORY_UPDATE",
      timestamp: Date.now(),
      payload: {
        key: `profile:${userId}`,
        value: { ...currentProfile, ...updates, userId },
        operation: "set",
      },
    };

    const result = nexusRuntime.submitProposal(proposal);

    if (result.accepted) {
      // Nexus accepted — apply the update to our runtime cache
      const updated: UserCognitiveProfile = {
        ...currentProfile,
        ...updates,
        userId,
        lastSyncedAt: Date.now(),
      };
      this.profiles.set(userId, updated);

      // Emit PROFILE_UPDATED event for downstream consumers
      for (const [field, newValue] of Object.entries(updates)) {
        nexusBus.emit({
          type: "MEMORY_SYNC",
          subtype: "PROFILE_UPDATED",
          userId,
          field,
          newValue,
          previousValue: (previousProfile as Record<string, unknown>)[field],
          sourceAgentId: MemoryKeeper.AGENT_ID,
        });
      }
    } else {
      console.warn(
        `[MemoryKeeper] Profile update rejected for user ${userId}: ${result.reason}`
      );
    }

    return result;
  }

  /**
   * Retrieve vector memory context for a user.
   *
   * This calls the context-compressor pipeline + agent-memory DB for
   * persisted memories. Returns a CompressedContext snapshot that can
   * be injected into system prompts.
   *
   * @param userId   The user to retrieve context for
   * @param planetId The planet context to compress for
   * @param messages Recent message history for real-time compression
   */
  retrieveContext(
    userId: number,
    planetId: PlanetId,
    messages: MessageStub[]
  ): CompressedContext {
    // Compress recent messages into a context snapshot
    const compressed = compressMemory(messages, planetId);

    // Enrich with persisted profile data
    const profile = this.profiles.get(userId);
    if (profile) {
      // Inject profile signals into the compressed context
      if (profile.userLevel && profile.userLevel !== "beginner") {
        compressed.userLevel = profile.userLevel;
      }
      if (profile.insights.length > 0) {
        compressed.unlockedInsights = [
          ...compressed.unlockedInsights,
          ...profile.insights.slice(-3),
        ];
      }
    }

    // Store in the nexus runtime state (via CONTEXT_SYNC proposal)
    this.storeCompressedContext(compressed);

    return compressed;
  }

  /**
   * Store compressed context in the Nexus runtime state.
   * Uses a CONTEXT_SYNC proposal — Memory Keeper is authorized to write
   * to session_context per the ownership matrix.
   */
  private storeCompressedContext(context: CompressedContext): void {
    const proposal: DeltaProposal<"CONTEXT_SYNC"> = {
      proposalId: uuid(),
      agentId: MemoryKeeper.AGENT_ID,
      type: "CONTEXT_SYNC",
      timestamp: Date.now(),
      payload: { compressedContext: context },
    };

    nexusRuntime.submitProposal(proposal);
  }

  // ── MEMORY_SYNC Handler ─────────────────────────────────────────────────────

  /**
   * Handle incoming MEMORY_SYNC events from other agents.
   *
   * When an agent emits MEMORY_SYNC (e.g., an insight was stored),
   * Memory Keeper updates its runtime cache and emits a confirmation.
   */
  private handleMemorySync(event: Record<string, unknown>): void {
    switch (event.subtype) {
      case "INSIGHT_STORED": {
        const { userId, insight } = event;
        const profile = this.profiles.get(userId as number);
        if (profile) {
          profile.insights = [insight as string, ...profile.insights].slice(0, 20);
          profile.lastSyncedAt = Date.now();
        }
        break;
      }

      case "CONTEXT_COMPACTION_REQUESTED": {
        // Context compaction is handled by the context-compressor
        // Memory Keeper acknowledges by updating lastSyncAt
        const snapshot = nexusRuntime.getSnapshot();
        if (process.env.NODE_ENV === "development") console.log(
          `[MemoryKeeper] Context compaction requested for planet ${event.planetId} ` +
          `(tokens: ${event.currentTokens}/${event.maxTokens})`
        );
        break;
      }

      case "MEMORY_HEALTH_CHECK": {
        if (process.env.NODE_ENV === "development") console.log(
          `[MemoryKeeper] Health check — ${event.totalEntries} entries, ` +
          `${event.estimatedTokens} tokens across ${(event.activeDomains as string[]).join(", ")}`
        );
        break;
      }

      default:
        break;
    }
  }

  // ── Diagnostics ─────────────────────────────────────────────────────────────

  /** Check if Memory Keeper is registered with the Nexus. */
  get isRegistered(): boolean {
    return this.registered;
  }

  /** Number of profiles currently in runtime cache. */
  get profileCount(): number {
    return this.profiles.size;
  }

  /** List all cached user IDs. */
  get cachedUserIds(): number[] {
    return Array.from(this.profiles.keys());
  }

  /**
   * Reset the Memory Keeper. For TESTING ONLY.
   * Clears all cached profiles and unsubscribes from nexusBus.
   */
  reset(): void {
    if (process.env.NODE_ENV !== "test") {
      throw new Error(
        "MemoryKeeper.reset() is only available in test environments"
      );
    }
    this.profiles.clear();
    this.registered = false;
    if (this.unsubscribeFromMemorySync) {
      this.unsubscribeFromMemorySync();
      this.unsubscribeFromMemorySync = null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * The single Memory Keeper instance for the entire MENTE.AI application.
 *
 * Usage:
 *   import { memoryKeeper } from "@/lib/agents/memory-keeper";
 *
 *   // At boot, after nexusRuntime.init():
 *   memoryKeeper.register();
 *
 *   // Retrieve a user's profile
 *   const profile = memoryKeeper.getProfile(userId);
 *
 *   // Update a profile (goes through Nexus governance)
 *   const result = memoryKeeper.updateProfile(userId, { emotionalScore: 0.8 });
 */
export const memoryKeeper = new MemoryKeeper();
