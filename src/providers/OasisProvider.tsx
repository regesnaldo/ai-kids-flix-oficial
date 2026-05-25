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
let eventSubscribers: Set<(event: CinematicEvent) => void> = new Set();

/** Reconnection backoff (milliseconds) */
let reconnectDelay = 1_000;
const MAX_RECONNECT_DELAY = 30_000;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/** Whether the store has been initialized */
let initialized = false;

/** Polling interval for REST fallback */
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
 * Connects to SSE endpoint and sets up reconnection logic.
 */
function initializeOasisRuntime(): void {
  if (initialized) return;
  initialized = true;

  // Dynamically import the experience layer (browser-safe)
  import("@/lib/experience/experience-layer").then(
    ({ experienceLayer }) => {
      // Initial snapshot
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

      // Connect to SSE
      connectSSE();
    }
  ).catch((err) => {
    console.error("[OasisProvider] Failed to load experience layer:", err);
  });
}

/** Connect to the SSE endpoint with reconnection logic. */
function connectSSE(): void {
  if (typeof window === "undefined") return;

  import("@/lib/experience/experience-layer").then(
    ({ experienceLayer }) => {
      experienceLayer.connectToRuntimeSync();
      connected = true;
      reconnectDelay = 1_000; // Reset backoff
      notifySubscribers();

      // Start polling fallback (runs in background even with SSE active)
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
        }, 10_000); // Every 10s as safety net
      }
    }
  ).catch(() => {
    // SSE failed — schedule reconnection with backoff
    connected = false;
    notifySubscribers();
    scheduleReconnect();
  });
}

/** Schedule SSE reconnection with exponential backoff. */
function scheduleReconnect(): void {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectSSE();
  }, reconnectDelay);

  // Exponential backoff: 1s → 2s → 4s → 8s → ... → max 30s
  reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
}

/** Cleanup runtime resources. */
function shutdownOasisRuntime(): void {
  initialized = false;
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  import("@/lib/experience/experience-layer").then(
    ({ experienceLayer }) => {
      experienceLayer.disconnectFromRuntimeSync();
    }
  ).catch(() => {});
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
    children,
  });
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
