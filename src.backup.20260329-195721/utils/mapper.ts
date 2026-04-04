// Tipagem para garantir consistência
export interface AgentFull {
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string; // Descrição curta para o Hero
  description: string; // Descrição longa
  tag: string;
}

// Cores padrão para agentes que não possuem cor definida
const FALLBACK_COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#3b82f6"];

export const mapAgentsToFullModel = (rawAgents: any[]): AgentFull[] => {
  return rawAgents.map((agent, index) => ({
    id: agent.id || `agent-${index}-${(agent.name || 'unknown').toLowerCase()}`,
    name: agent.name,
    // Se o agents.ts não tem 'role', usamos a 'tag' ou um padrão
    role: agent.role || agent.tag || "Specialist",
    // Atribuição de cor baseada no índice para evitar cinza/bug visual
    color: agent.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    // 'desc' é o que o HeroBanner usa. Se não existir, pega o início da description
    desc: agent.desc || agent.description?.slice(0, 80) + "..." || "",
    description: agent.description || "",
    tag: agent.tag || "AI"
  }));
};
