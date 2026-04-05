export interface AgentRaw {
  name: string;
  tag: string;
  description: string;
  id?: string;
  role?: string;
  color?: string;
  desc?: string;
}

export interface AgentFull {
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string;
  tag: string;
}

export type AgentUI = AgentFull;

export interface Category {
  title: string;
  items: string[];
}
