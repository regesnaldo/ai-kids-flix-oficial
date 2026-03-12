export interface AgentFull {
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string;
  description: string;
  tag: string;
}

const FALLBACK_COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#3b82f6", "#10b981"];

export const mapAgentsToFullModel = (rawAgents: any[]): AgentFull[] => {
  return rawAgents.map((agent, index) => ({
    id: agent.id || `agent-${index}`,
    name: agent.name || "Agente",
    role: agent.role || agent.tag || "Mentor",
    color: agent.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    desc: agent.desc || (agent.description ? agent.description.substring(0, 60) + "..." : ""),
    description: agent.description || "",
    tag: agent.tag || "IA"
  }));
};
