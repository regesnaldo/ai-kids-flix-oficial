"use client";

/**
 * ─── OASIS PROVIDER — Cinematic Experience Context ──────────────────────────
 *
 * Wraps the MENTE.AI application with the ExperienceLayer context.
 * Every component that needs runtime state accesses it through useOasis().
 *
 * WHAT IT DOES:
 *   1. Wraps children with ExperienceLayer context
 *   2. Connects to SSE endpoint /api/ws/runtime-sync
 *   3. Distributes RenderCommands to child components via context
 *   4. Manages reconnection logic (exponential backoff)
 *   5. Exposes useOasis() hook as the single UI entry point
 *
 * RULES:
 *   - Components call useOasis(), NEVER import from @/lib/nexus
 *   - Components call triggerTransition(), NEVER submitProposal()
 *   - Zero direct calls to NexusRuntime from components
 *
 * PHASE 5: Cinematic Experience Layer & Oasis Runtime
 *
 * Usage:
 *   // In layout.tsx:
 *   import { OasisProvider } from "@/providers/OasisProvider";
 *   <OasisProvider><App /></OasisProvider>
 *
 *   // In any component:
 *   import { useOasis } from "@/providers/OasisProvider";
 *   const { currentScene, triggerTransition, cognitiveProfile } = useOasis();
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";
import type {
  ExperienceSnapshot,
  CinematicEvent,
  SceneId,
  TransitionState,
  HealthStatus,
} from "@/lib/experience/experience.types";

// ═══════════════════════════════════════════════════════════════════════════════
// OASIS CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

/** What useOasis() returns. */
export interface OasisContext {
  /** Current cinematic scene */
  currentScene: SceneId;

  /** Current transition state (idle | transitioning | complete) */
  transitionState: TransitionState;

  /** Cognitive profile from Memory Keeper */
  cognitiveProfile: {
    userLevel: "beginner" | "intermediate" | "advanced";
    emotionalScore: number;
    intellectualScore: number;
    moralScore: number;
    archetype: string;
    recentInsights: string[];
  };

  /** Player progression summary */
  progressionSnapshot: {
    activePlanet: string | null;
    completed: string[];
    available: string[];
    totalCompleted: number;
  };

  /** Current health status */
  healthStatus: HealthStatus;

  /** HUD signals for the ScannerRing and other HUD components */
  hudSignals: Array<{
    type: string;
    level: number;
    label: string;
    planetId?: string;
  }>;

  /** Trigger a scene transition */
  triggerTransition: (
    to: SceneId,
    style?: "warp" | "fade" | "glitch" | "portal"
  ) => void;

  /** Subscribe to live CinematicEvents */
  subscribeToEvents: (
    callback: (event: CinematicEvent) => void
  ) => () => void;

  /** Whether the SSE connection is active */
  isConnected: boolean;

  /** Timestamp of last snapshot */
  lastSnapshotAt: number;
}

const DEFAULT_OASIS: OasisContext = {
  currentScene: "home",
  transitionState: { phase: "idle" },
  cognitiveProfile: {
    userLevel: "beginner",
      emotionalScore: 0.5,
    intellectualScore: 0,
    moralScore: 0,
    archetype: "explorer",
    recentInsights: [],
  },
  progressionSnapshot: {
    activePlanet: null,
    completed: [],
    available: [],
    totalCompleted: 0,
  },
  healthStatus: "optimal",
  hudSignals: [],
  triggerTransition: () => {},
  subscribeToEvents: () => () => {},
  isConnected: false,
  lastSnapshotAt: 0,
};

const OasisReactContext = createContext<OasisContext>(DEFAULT_OASIS);

// ═══════════════════════════════════════════════════════════════════════════════
// STORE (module-level, shared across all provider instances)
// ═══════════════════════════════════════════════════════════════════════════════

/** Subscribers notified on every store change. */
let oasisSubscribers: (() => void)[] = [];

/** The current snapshot — updated by the SSE connection and polling. */
let currentSnapshot: ExperienceSnapshot | null = null;

/** SSE connection state */
let connected = false;

/** CinematicEvent subscribers from useOasis hooks */
const eventSubscribers: Set<(event: CinematicEvent) => void> = new Set();

/** Whether the store has been initialized */
let initialized = false;

/** Polling interval */
let pollInterval: ReturnType<typeof setInterval> | null = null;

function notifySubscribers(): void {
  for (const subscriber of oasisSubscribers) {
    try { subscriber(); } catch { /* resilient */ }
  }
}

function subscribeToStore(callback: () => void): () => void {
  oasisSubscribers.push(callback);
  return () => {
    oasisSubscribers = oasisSubscribers.filter((s) => s !== callback);
  };
}

function getSnapshot(): ExperienceSnapshot | null {
  return currentSnapshot;
}

/**
 * Initialize the Oasis runtime — called once when OasisProvider mounts.
 * Sets up event subscriptions and REST polling (no SSE to avoid Vercel timeout).
 */
function initializeOasisRuntime(): void {
  if (initialized) return;
  initialized = true;

  // Dynamically import the experience layer (browser-safe)
  import("@/lib/experience/experience-layer").then(
    ({ experienceLayer }) => {
      const snapshot = experienceLayer.getExperienceSnapshot();
      currentSnapshot = snapshot;
      notifySubscribers();

      // Subscribe to cinematic events through the experience layer
      experienceLayer.subscribeToEvents((event) => {
        // Forward to component subscribers
        for (const sub of eventSubscribers) {
          try { sub(event); } catch { /* resilient */ }
        }

        // Refresh snapshot on state-changing events
        if (
          event.type === "PLANET_ENTER" ||
          event.type === "PLANET_EXIT" ||
          event.type === "HUD_REFRESH" ||
          event.type === "HEALTH_CHANGE" ||
          event.type === "REWARD_UNLOCK"
        ) {
          const fresh = experienceLayer.getExperienceSnapshot();
          currentSnapshot = fresh;
          notifySubscribers();
        }
      });

      // REST polling every 10s (replaces SSE to avoid Vercel timeout)
      if (!pollInterval) {
        pollInterval = setInterval(() => {
          const snapshot = experienceLayer.getExperienceSnapshot();
          if (
            !currentSnapshot ||
            snapshot.progressionSnapshot.totalCompleted !==
              currentSnapshot.progressionSnapshot.totalCompleted ||
            snapshot.healthStatus !== currentSnapshot.healthStatus
          ) {
            currentSnapshot = snapshot;
            notifySubscribers();
          }
        }, 10_000);
      }
    }
  ).catch((err) => {
    console.error("[OasisProvider] Failed to load experience layer:", err);
    // TODO: [MENTE.AI] adicionar feedback visual ao usuário
  });
}

/** Cleanup runtime resources. */
function shutdownOasisRuntime(): void {
  initialized = false;
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  connected = false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

export function OasisProvider({ children }: { children: ReactNode }) {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    initializeOasisRuntime();

    return () => {
      mounted.current = false;
      shutdownOasisRuntime();
    };
  }, []);

  return React.createElement(OasisReactContext.Provider, {
    value: DEFAULT_OASIS, // Placeholder — real values come from useSyncExternalStore
  }, children);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK — useOasis()
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * useOasis() — the single entry point for components to access runtime state.
 *
 * Components call this hook. They NEVER import from @/lib/nexus.
 * All runtime state flows through this hook.
 */
export function useOasis(): OasisContext {
  // Sync with the external store
  const snapshot = useSyncExternalStore(
    subscribeToStore,
    getSnapshot,
    getSnapshot // SSR snapshot (same — defaults to null)
  );

  // Track connection state
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStore(() => {
      setIsConnected(connected);
    });
    setIsConnected(connected);
    return unsub;
  }, []);

  // Subscribe to cinematic events
  const subscribeToEvents = useCallback(
    (callback: (event: CinematicEvent) => void): (() => void) => {
      eventSubscribers.add(callback);
      return () => {
        eventSubscribers.delete(callback);
      };
    },
    []
  );

  // Trigger transition through experience layer
  const triggerTransition = useCallback(
    (to: SceneId, style: "warp" | "fade" | "glitch" | "portal" = "warp") => {
      import("@/lib/experience/experience-layer").then(
        ({ experienceLayer }) => {
          experienceLayer.triggerTransition(to, style);
          // Refresh snapshot after transition
          const fresh = experienceLayer.getExperienceSnapshot();
          currentSnapshot = fresh;
          notifySubscribers();
        }
      ).catch((err) => {
        console.error("[useOasis] Transition failed:", err);
        // TODO: [MENTE.AI] adicionar feedback visual ao usuário
      });
    },
    []
  );

  // If no snapshot yet, return defaults
  if (!snapshot) {
    return {
      ...DEFAULT_OASIS,
      subscribeToEvents,
      triggerTransition,
    };
  }

  return {
    currentScene: snapshot.currentScene,
    transitionState: snapshot.transitionState,
    cognitiveProfile: snapshot.cognitiveProfile,
    progressionSnapshot: snapshot.progressionSnapshot,
    healthStatus: snapshot.healthStatus,
    hudSignals: snapshot.hudSignals,
    triggerTransition,
    subscribeToEvents,
    isConnected,
    lastSnapshotAt: snapshot.timestamp,
  };
}
