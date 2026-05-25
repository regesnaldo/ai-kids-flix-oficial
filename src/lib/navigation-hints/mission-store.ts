/**
 * ─── NAVIGATION HINTS — Mission Continuity Store ──────────────────────────────
 *
 * Persists mission state across sessions. Tracks which nodes are unlocked,
 * visited, and completed. Drives progression scoring and layer advancement.
 *
 * Persistence: localStorage (client-side, survives navigation)
 *             + memory cache (server-side, per-request in API routes)
 *
 * This module is the "memory of the journey" — it remembers what the
 * user has discovered so the system can guide them forward, not in circles.
 */

import type {
  MissionState,
  MissionNode,
  PlatformSection,
  NavigationHint,
  UnlockType,
} from "./types";
import { PLATFORM_SECTIONS } from "./types";

// ─── IN-MEMORY CACHE ──────────────────────────────────────────────────────────

/** Server-side cache (cleared on cold start, rebuilt from API calls) */
const missionCache = new Map<string, MissionState>();

// ─── MISSION STATE FACTORY ────────────────────────────────────────────────────

export function createMission(
  threadId: string,
  firstDiscovery?: { tag: string; section: PlatformSection }
): MissionState {
  const now = Date.now();
  return {
    missionId: `mission_${threadId}_${now}`,
    threadId,
    startedAt: now,
    lastActivityAt: now,
    currentNode: null,
    unlockedNodes: [],
    progressionScore: 0,
    currentLayer: 0,
    lastDiscovery: firstDiscovery
      ? { tag: firstDiscovery.tag, section: firstDiscovery.section, timestamp: now }
      : null,
  };
}

// ─── NODE MANAGEMENT ──────────────────────────────────────────────────────────

let nodeCounter = 0;

function generateNodeId(): string {
  nodeCounter++;
  return `node_${Date.now()}_${nodeCounter}`;
}

export function unlockNode(
  state: MissionState,
  section: PlatformSection,
  label: string,
  unlockType: UnlockType,
  prerequisiteNodeId?: string
): MissionState {
  // Prevent duplicate unlocks for the same section+label combination
  const exists = state.unlockedNodes.find(
    (n) => n.section === section && n.label === label
  );
  if (exists) return state;

  const node: MissionNode = {
    nodeId: generateNodeId(),
    section,
    label,
    unlockedAt: Date.now(),
    visitedAt: null,
    completedAt: null,
    unlockSource: unlockType,
    prerequisiteNodeId: prerequisiteNodeId ?? null,
  };

  return {
    ...state,
    unlockedNodes: [...state.unlockedNodes, node],
    lastActivityAt: Date.now(),
  };
}

export function visitNode(state: MissionState, nodeId: string): MissionState {
  return {
    ...state,
    unlockedNodes: state.unlockedNodes.map((n) =>
      n.nodeId === nodeId && n.visitedAt === null
        ? { ...n, visitedAt: Date.now() }
        : n
    ),
    currentNode: nodeId,
    lastActivityAt: Date.now(),
  };
}

export function completeNode(state: MissionState, nodeId: string): MissionState {
  const updated = state.unlockedNodes.map((n) =>
    n.nodeId === nodeId ? { ...n, completedAt: Date.now() } : n
  );

  const completedCount = updated.filter((n) => n.completedAt !== null).length;
  const totalNodes = Math.max(updated.length, 1);
  const progressionScore = Math.round((completedCount / totalNodes) * 100);

  const currentLayer = calculateLayer(progressionScore);

  return {
    ...state,
    unlockedNodes: updated,
    progressionScore,
    currentLayer,
    lastActivityAt: Date.now(),
  };
}

function calculateLayer(score: number): number {
  if (score >= 75) return 3; // mastery
  if (score >= 50) return 2; // deep
  if (score >= 25) return 1; // exploring
  return 0; // surface
}

// ─── PROGRESSION METHODS ──────────────────────────────────────────────────────

export function advanceMission(
  state: MissionState,
  discovery: { tag: string; section: PlatformSection }
): MissionState {
  return {
    ...state,
    lastDiscovery: {
      tag: discovery.tag,
      section: discovery.section,
      timestamp: Date.now(),
    },
    lastActivityAt: Date.now(),
    progressionScore: Math.min(100, state.progressionScore + 2),
  };
}

export function getNextSuggestedPath(
  state: MissionState
): PlatformSection | null {
  // If no nodes unlocked, suggest first exploration
  if (state.unlockedNodes.length === 0) {
    return "home";
  }

  // Find incomplete nodes sorted by unlock order
  const incomplete = state.unlockedNodes.filter((n) => !n.completedAt);
  if (incomplete.length === 0) {
    // All nodes complete — suggest next layer
    if (state.currentLayer < 3) return "explore";
    return "lab";
  }

  // Suggest the earliest incomplete node's section
  const next = incomplete[0];
  return next.section;
}

// ─── DISCOVERY TRACKING ───────────────────────────────────────────────────────

export function recordDiscovery(
  state: MissionState,
  tag: string,
  section: PlatformSection
): MissionState {
  return {
    ...state,
    lastDiscovery: { tag, section, timestamp: Date.now() },
    lastActivityAt: Date.now(),
  };
}

export function getUnvisitedNodes(
  state: MissionState
): MissionNode[] {
  return state.unlockedNodes.filter((n) => n.visitedAt === null);
}

export function getActiveMissionNodes(
  state: MissionState
): MissionNode[] {
  return state.unlockedNodes.filter((n) => !n.completedAt);
}

// ─── CACHE MANAGEMENT ─────────────────────────────────────────────────────────

export function getMission(missionId: string): MissionState | undefined {
  return missionCache.get(missionId);
}

export function getMissionByThread(threadId: string): MissionState | undefined {
  for (const mission of missionCache.values()) {
    if (mission.threadId === threadId) return mission;
  }
  return undefined;
}

export function saveMission(state: MissionState): void {
  missionCache.set(state.missionId, state);
}

export function deleteMission(missionId: string): boolean {
  return missionCache.delete(missionId);
}

// ─── CLIENT-SIDE PERSISTENCE ──────────────────────────────────────────────────

const LOCAL_STORAGE_KEY = "mente_ai_mission_state";

export function loadMissionFromStorage(): MissionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MissionState;
    // Validate basic shape
    if (!parsed.missionId || !parsed.threadId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function persistMissionToStorage(state: MissionState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("[MissionStore] Failed to persist to localStorage");
  }
}

// ─── LAYER LABELS ─────────────────────────────────────────────────────────────

export function getLayerLabel(layer: number): string {
  const labels: Record<number, string> = {
    0: "Superfície",
    1: "Explorando",
    2: "Profundo",
    3: "Maestria",
  };
  return labels[layer] ?? "Desconhecido";
}

export function getLayerDescription(layer: number): string {
  const descriptions: Record<number, string> = {
    0: "Primeiros contatos com o sistema",
    1: "Descobrindo conexões entre territórios",
    2: "Compreensão profunda dos padrões",
    3: "Domínio completo do ecossistema",
  };
  return descriptions[layer] ?? "";
}
