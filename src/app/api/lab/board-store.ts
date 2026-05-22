// ── In-memory experiment store (com TTL de 24h) ──────────────────────
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

// Cleanup a cada 10 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store) {
    if (now - value.createdAt > 24 * 60 * 60 * 1000) store.delete(key);
  }
}, 10 * 60 * 1000);

export function getBoard(experimentId: string): KnowledgeBoard | null {
  const entry = store.get(experimentId);
  return entry?.board ?? null;
}

export function saveBoard(board: KnowledgeBoard) {
  store.set(board.experimentId, { board, createdAt: Date.now() });
}
