import { AgentFull, Category } from "@/types/agent";

const DEFAULT_COLOR = "#6366F1";

export function buildCategories(agents: AgentFull[], maxPerCategory = 10): Category[] {
  const byTag = agents.reduce((acc, agent) => {
    const key = agent.tag || "geral";
    if (!acc[key]) acc[key] = [];
    if (!acc[key].includes(agent.name)) {
      acc[key].push(agent.name);
    }
    return acc;
  }, {} as Record<string, string[]>);

  const categories = Object.entries(byTag)
    .map(([title, items]) => ({
      title: title.charAt(0).toUpperCase() + title.slice(1),
      items: items.slice(0, maxPerCategory),
    }))
    .filter((cat) => cat.items.length > 0);

  return categories;
}

export function getHeroAgent(agents: AgentFull[]): AgentFull | null {
  if (!agents.length) return null;
  const prioritized = agents.filter((a) => a.role === "mentor");
  return prioritized[0] || agents[0] || null;
}
