/**
 * MENTE.AI — Showcase derivado do catálogo canônico
 * src/data/agents-showcase.ts
 *
 * Adapter que mapeia ALL_AGENTS (@/canon) para o shape AgentShowcase.
 * Fonte única de verdade: @/canon/agents/all-agents.ts (12 agentes canônicos).
 */

import { ALL_AGENTS, type AgentDefinition } from "@/canon/agents/all-agents";

export interface AgentShowcase {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  description: string;
  image: string;
  themeGlow: string;
}

const COLOR_BY_ID: Record<string, string> = {
  nexus: "#3B82F6",
  kaos: "#EF4444",
  cipher: "#10B981",
  lyra: "#EC4899",
  axiom: "#0EA5E9",
  stratos: "#64748B",
  terra: "#22C55E",
  prism: "#8B5CF6",
  janus: "#F59E0B",
  volt: "#F59E0B",
  aurora: "#EC4899",
  ethos: "#F59E0B",
};

const CATEGORY_BY_DIMENSION: Record<AgentDefinition["dimension"], string> = {
  intellectual: "INTELIGÊNCIA",
  creative: "INOVAÇÃO",
  ethical: "ÉTICA",
  scientific: "ANÁLISE",
  practical: "ESTRATÉGIA",
  emotional: "EMPATIA",
  aesthetic: "CRIATIVIDADE",
  philosophical: "FILOSOFIA",
  social: "CONEXÃO",
  political: "LIDERANÇA",
  spiritual: "ESPIRITUALIDADE",
  mystical: "MÍSTICA",
};

function extractSubtitle(name: string): string {
  const match = name.match(/"([^"]+)"/);
  if (!match) return name;
  const epithet = match[1].toLowerCase();
  return epithet.charAt(0).toUpperCase() + epithet.slice(1);
}

function toAgentShowcase(agent: AgentDefinition): AgentShowcase {
  const color = COLOR_BY_ID[agent.id] ?? "#8B5CF6";
  return {
    id: agent.id,
    name: agent.name.split('"')[0].trim(),
    subtitle: extractSubtitle(agent.name),
    category: CATEGORY_BY_DIMENSION[agent.dimension],
    categoryColor: color,
    description: agent.laboratoryTask,
    image: `/images/agentes/${agent.id}.png`,
    themeGlow: color,
  };
}

export const agentsShowcase: AgentShowcase[] = ALL_AGENTS.map(toAgentShowcase);
