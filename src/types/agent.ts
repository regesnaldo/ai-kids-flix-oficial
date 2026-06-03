export interface Agent {
  id: string;
  name: string;
  color: string;
  description: string;
  expertise: string;
}

export type AgentId = "nexus" | "cipher" | "kaos" | "aurora" | "volt" | "ethos";

// ─── Legacy agent types (used by agentMapper) ───────────────────────────

export interface AgentRaw {
  id?: string;
  name: string;
  role?: string;
  tag?: string;
  color?: string;
  desc?: string;
  description?: string;
}

export interface AgentFull {
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string;
  tag: string;
}

export interface Category {
  title: string;
  items: string[];
}
