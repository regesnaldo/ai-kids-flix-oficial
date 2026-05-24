/**
 * ─── NAVIGATION STORE — Zustand Cross-Section State ───────────────────────────
 *
 * Client-side store that holds:
 * - Active navigation hints (beacons) from AI responses
 * - Mission continuity state (persisted to localStorage)
 * - Cross-section handoff payload for seamless navigation
 * - LAB state machine context
 *
 * This store is the bridge between the server-side hint extraction
 * and the client-side HUD rendering. It survives page navigation
 * via Zustand persist middleware.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  NavigationHint,
  NavigationHintBundle,
  BeaconUIObject,
  PlatformSection,
  CrossSectionPayload,
  MissionState,
  LabStateContext,
  LabState,
} from "@/lib/navigation-hints/types";
import {
  generateBeacons,
  getActiveBeacons,
} from "@/lib/navigation-hints/beacon-factory";
import {
  createMission,
  unlockNode,
  visitNode,
  completeNode,
  advanceMission,
  getNextSuggestedPath,
  persistMissionToStorage,
  loadMissionFromStorage,
} from "@/lib/navigation-hints/mission-store";
import {
  createLabState,
  transition as labTransition,
  addActiveAgent,
  completeAgent,
  addBoardTag,
  calculateProgress,
} from "@/lib/navigation-hints/lab-state-machine";
import {
  createHandoffPayload,
  detectCurrentSection,
  isPayloadValid,
} from "@/lib/navigation-hints/cross-section-handoff";

// ─── STORE INTERFACE ──────────────────────────────────────────────────────────

interface NavigationState {
  // ── Beacons ──────────────────────────────────────────────────────────────
  /** Active beacons driving HUD pulse indicators */
  beacons: BeaconUIObject[];
  /** Raw hints from the most recent AI response */
  pendingHints: NavigationHint[];

  // ── Mission Continuity ───────────────────────────────────────────────────
  /** Current mission state (persisted) */
  mission: MissionState | null;

  // ── Cross-Section Handoff ────────────────────────────────────────────────
  /** Active handoff payload (consumed once by destination) */
  handoffPayload: CrossSectionPayload | null;

  // ── LAB State Machine ────────────────────────────────────────────────────
  /** Current LAB system state */
  labState: LabStateContext;

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Process a navigation hint bundle from the chat API */
  processHints: (bundle: NavigationHintBundle) => void;

  /** Add a single beacon manually (e.g., from trigger rules) */
  addBeacon: (beacon: BeaconUIObject) => void;

  /** Dismiss a beacon (user acknowledged it) */
  dismissBeacon: (beaconId: string) => void;

  /** Clear expired beacons */
  purgeExpiredBeacons: () => void;

  /** Initialize or resume a mission */
  initMission: (threadId: string) => void;

  /** Unlock a node in the mission */
  unlockMissionNode: (
    section: PlatformSection,
    label: string,
    unlockType: import("@/lib/navigation-hints/types").UnlockType
  ) => void;

  /** Mark a node as visited */
  visitMissionNode: (nodeId: string) => void;

  /** Mark a node as completed */
  completeMissionNode: (nodeId: string) => void;

  /** Record a discovery in the mission */
  recordMissionDiscovery: (tag: string, section: PlatformSection) => void;

  /** Get the next suggested path */
  getNextPath: () => PlatformSection | null;

  // ── Handoff Actions ──────────────────────────────────────────────────────

  /** Push handoff context before navigating away */
  pushHandoff: (destination: PlatformSection) => void;

  /** Consume handoff context on destination mount */
  consumeHandoff: () => CrossSectionPayload | null;

  /** Clear stale handoff payload */
  clearHandoff: () => void;

  // ── LAB Actions ──────────────────────────────────────────────────────────

  /** Transition LAB to a new state */
  labTransitionTo: (to: LabState, options?: {
    activeAgents?: string[];
    completedAgents?: string[];
    boardTags?: string[];
    experimentId?: string;
  }) => void;

  /** Add an agent to the active pipeline */
  labAddAgent: (agentId: string) => void;

  /** Mark an agent as completed */
  labCompleteAgent: (agentId: string) => void;

  /** Add a tag to the knowledge board */
  labAddTag: (tag: string) => void;

  /** Reset LAB state */
  labReset: (experimentId?: string) => void;
}

// ─── STORE IMPLEMENTATION ─────────────────────────────────────────────────────

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────────────
      beacons: [],
      pendingHints: [],
      mission: null,
      handoffPayload: null,
      labState: createLabState(),

      // ── Beacon Actions ───────────────────────────────────────────────────

      processHints: (bundle) => {
        const newBeacons = generateBeacons(bundle.hints);
        set((state) => {
          // Merge with existing, replacing same-section beacons
          const existingIds = new Set(newBeacons.map((b) => b.section));
          const kept = state.beacons.filter(
            (b) => !existingIds.has(b.section) && !b.dismissed
          );
          return {
            pendingHints: bundle.hints,
            beacons: [...kept, ...newBeacons].sort(
              (a, b) => b.priority - a.priority
            ),
          };
        });
      },

      addBeacon: (beacon) => {
        set((state) => ({
          beacons: [...state.beacons.filter((b) => b.id !== beacon.id), beacon],
        }));
      },

      dismissBeacon: (beaconId) => {
        set((state) => ({
          beacons: state.beacons.map((b) =>
            b.id === beaconId ? { ...b, dismissed: true } : b
          ),
        }));
      },

      purgeExpiredBeacons: () => {
        set((state) => ({
          beacons: getActiveBeacons(state.beacons),
        }));
      },

      // ── Mission Actions ──────────────────────────────────────────────────

      initMission: (threadId) => {
        const existing = get().mission;
        if (existing && existing.threadId === threadId) return; // Already initialized

        // Try loading from localStorage first (survives page reloads)
        const stored = loadMissionFromStorage();
        if (stored && stored.threadId === threadId) {
          set({ mission: stored });
          return;
        }

        const mission = createMission(threadId);
        persistMissionToStorage(mission);
        set({ mission });
      },

      unlockMissionNode: (section, label, unlockType) => {
        set((state) => {
          if (!state.mission) return state;
          const updated = unlockNode(state.mission, section, label, unlockType);
          persistMissionToStorage(updated);
          return { mission: updated };
        });
      },

      visitMissionNode: (nodeId) => {
        set((state) => {
          if (!state.mission) return state;
          const updated = visitNode(state.mission, nodeId);
          persistMissionToStorage(updated);
          return { mission: updated };
        });
      },

      completeMissionNode: (nodeId) => {
        set((state) => {
          if (!state.mission) return state;
          const updated = completeNode(state.mission, nodeId);
          persistMissionToStorage(updated);
          return { mission: updated };
        });
      },

      recordMissionDiscovery: (tag, section) => {
        set((state) => {
          if (!state.mission) return state;
          const updated = advanceMission(state.mission, { tag, section });
          persistMissionToStorage(updated);
          return { mission: updated };
        });
      },

      getNextPath: () => {
        const { mission } = get();
        if (!mission) return null;
        return getNextSuggestedPath(mission);
      },

      // ── Handoff Actions ──────────────────────────────────────────────────

      pushHandoff: (destination) => {
        const { mission, pendingHints } = get();
        if (!mission && pendingHints.length === 0) return;

        const origin = detectCurrentSection();
        const payload = createHandoffPayload(origin, destination, {
          missionId: mission?.missionId ?? null,
          lastDiscoveryTag: mission?.lastDiscovery?.tag ?? null,
          activeExperimentId: null,
          transferredHints: pendingHints,
        });

        set({ handoffPayload: payload });
      },

      consumeHandoff: () => {
        const payload = get().handoffPayload;
        if (!payload) return null;
        if (!isPayloadValid(payload)) {
          set({ handoffPayload: null });
          return null;
        }
        set({ handoffPayload: null });
        return payload;
      },

      clearHandoff: () => {
        set({ handoffPayload: null });
      },

      // ── LAB Actions ──────────────────────────────────────────────────────

      labTransitionTo: (to, options) => {
        set((state) => {
          const progress = options?.completedAgents
            ? calculateProgress(options.completedAgents)
            : state.labState.progressPercent;

          return {
            labState: labTransition(state.labState, to, {
              ...options,
              progressPercent: progress,
              boardTags: options?.boardTags ?? state.labState.boardTags,
            }),
          };
        });
      },

      labAddAgent: (agentId) => {
        set((state) => ({
          labState: addActiveAgent(state.labState, agentId),
        }));
      },

      labCompleteAgent: (agentId) => {
        set((state) => ({
          labState: completeAgent(state.labState, agentId),
        }));
      },

      labAddTag: (tag) => {
        set((state) => ({
          labState: addBoardTag(state.labState, tag),
        }));
      },

      labReset: (experimentId) => {
        set({ labState: createLabState(experimentId) });
      },
    }),
    {
      name: "mente-ai-navigation-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mission: state.mission,
        beacons: state.beacons,
        // Do NOT persist: handoffPayload (ephemeral), labState (per-session)
      }),
    }
  )
);
