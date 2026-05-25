// ── In-memory experiment store + learned answer cache + rate limiting ─
export interface KnowledgeBoard {
  experimentId: string;
  topic: string;
  facts: string[];
  currentAgent: string;
  completedAgents: string[];
  agentOutputs: Record<string, string>;
  history: AgentStep[];
}

export interface AgentStep {
  agent: string;
  output: string;
  facts: string[];
  timestamp: number;
}

const store = new Map<string, { board: KnowledgeBoard; createdAt: number }>();
const learnedCache = new Map<string, { data: any; createdAt: number }>();
const rlCounters = new Map<string, { value: number; expiresAt: number }>();

// ── KV simulation ────────────────────────────────────────────────────
export function kvGet(key: string): any | null {
  const entry = learnedCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > 30 * 24 * 60 * 60 * 1000) {
    learnedCache.delete(key);
    return null;
  }
  return entry.data;
}

export function kvSet(key: string, data: any): void {
  learnedCache.set(key, { data, createdAt: Date.now() });
}

/** Atomic increment with TTL in seconds. Returns new value. */
export function kvIncr(key: string, ttlSeconds: number): number {
  const now = Date.now();
  const existing = rlCounters.get(key);
  if (existing && existing.expiresAt > now) {
    existing.value += 1;
    return existing.value;
  }
  rlCounters.set(key, { value: 1, expiresAt: now + ttlSeconds * 1000 });
  return 1;
}

/** Get counter value. Returns 0 if expired or not found. */
export function kvGetCounter(key: string): number {
  const existing = rlCounters.get(key);
  if (!existing || existing.expiresAt < Date.now()) {
    rlCounters.delete(key);
    return 0;
  }
  return existing.value;
}

/** Decrement a counter safely */
export function kvDecr(key: string): number {
  const existing = rlCounters.get(key);
  if (!existing || existing.expiresAt < Date.now()) {
    rlCounters.delete(key);
    return 0;
  }
  existing.value = Math.max(0, existing.value - 1);
  return existing.value;
}

// Cleanup a cada 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now - value.createdAt > 24 * 60 * 60 * 1000) store.delete(key);
  }
  for (const [key, value] of learnedCache) {
    if (now - value.createdAt > 30 * 24 * 60 * 60 * 1000) learnedCache.delete(key);
  }
  for (const [key, value] of rlCounters) {
    if (value.expiresAt < now) rlCounters.delete(key);
  }
}, 10 * 60 * 1000);

export function getBoard(experimentId: string): KnowledgeBoard | null {
  const entry = store.get(experimentId);
  return entry?.board ?? null;
}

export function saveBoard(board: KnowledgeBoard) {
  store.set(board.experimentId, { board, createdAt: Date.now() });
}
