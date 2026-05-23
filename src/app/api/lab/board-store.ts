// ── In-memory experiment store + learned answer cache ────────────────
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

// Learned answers cache (simula Vercel KV)
// Key: "lab_normalizedQuestion" → answer object
const learnedCache = new Map<string, { data: any; createdAt: number }>();

export function kvGet(key: string): any | null {
  const entry = learnedCache.get(key);
  if (!entry) return null;
  // TTL 30 dias
  if (Date.now() - entry.createdAt > 30 * 24 * 60 * 60 * 1000) {
    learnedCache.delete(key);
    return null;
  }
  return entry.data;
}

export function kvSet(key: string, data: any): void {
  learnedCache.set(key, { data, createdAt: Date.now() });
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
}, 10 * 60 * 1000);

export function getBoard(experimentId: string): KnowledgeBoard | null {
  const entry = store.get(experimentId);
  return entry?.board ?? null;
}

export function saveBoard(board: KnowledgeBoard) {
  store.set(board.experimentId, { board, createdAt: Date.now() });
}
