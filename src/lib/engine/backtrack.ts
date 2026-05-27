import { loadProfile, saveProfile } from "./profiler";

interface HistoryEntry {
  agent: string;
  timestamp: number;
  reason: string;
}

const HISTORY_KEY = "mente_ai_narrative_history_v1";

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(history: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (error) { console.error('[MENTE.AI] Error in engine/backtrack.ts:', error); }
}

export function pushTransition(agent: string, reason: string) {
  const history = loadHistory();
  history.push({ agent, timestamp: Date.now(), reason });
  saveHistory(history.slice(-50));
}

export function getHistory(): HistoryEntry[] {
  return loadHistory();
}

export function backtrack(steps: number = 1): HistoryEntry | null {
  const history = loadHistory();
  if (history.length < 2) return null;
  const target = Math.max(0, history.length - 1 - steps);
  const entry = history[target];
  if (entry) {
    const profile = loadProfile();
    profile.currentAgent = entry.agent;
    saveProfile(profile);
  }
  return entry ?? null;
}

export function getLastAgent(): string | null {
  const history = loadHistory();
  return history.length > 0 ? history[history.length - 1].agent : null;
}
