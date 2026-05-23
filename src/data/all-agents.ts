/**
 * MENTE.AI — Adapter sobre o catálogo canônico de agentes
 * src/data/all-agents.ts
 *
 * Mapeia ALL_AGENTS (@/canon) para o shape HomeAgent usado na UI estilo Netflix.
 * Fonte única de verdade: @/canon/agents/all-agents.ts (12 agentes canônicos).
 */

import { ALL_AGENTS, type AgentDefinition } from "@/canon/agents/all-agents";

export interface HomeAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  longDescription: string;
  image: string;
  color: string;
  category: string;
  level: string;
  features: string[];
  /** Raw personality data for AI prompt generation */
  personality: {
    tone: string;
    values: string[];
    approach: string;
  };
  /** The agent's laboratory task — used as narrative goal in series */
  laboratoryTask: string;
  /** Agent dimension for filtering */
  dimension: string;
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
  intellectual: "Fundamentos",
  creative: "Inovação",
  ethical: "Ética",
  scientific: "Análise",
  practical: "Estratégia",
  emotional: "Empatia",
  aesthetic: "Criatividade",
  philosophical: "Filosofia",
  social: "Conexão",
  political: "Liderança",
  spiritual: "Espiritualidade",
  mystical: "Mística",
};

const LEVEL_BY_CANONICAL: Record<AgentDefinition["level"], string> = {
  archetypal: "Avançado",
  primordial: "Expert",
  mythic: "Intermediário",
  human: "Iniciante",
};

function toHomeAgent(agent: AgentDefinition): HomeAgent {
  return {
    id: agent.id,
    name: agent.name,
    role: agent.personality.approach.slice(0, 40),
    description: agent.laboratoryTask,
    longDescription: agent.personality.approach,
    image: `/images/agentes/${agent.id}.png`,
    color: COLOR_BY_ID[agent.id] ?? "#8B5CF6",
    category: CATEGORY_BY_DIMENSION[agent.dimension],
    level: LEVEL_BY_CANONICAL[agent.level],
    features: agent.personality.values,
    personality: {
      tone: agent.personality.tone,
      values: agent.personality.values,
      approach: agent.personality.approach,
    },
    laboratoryTask: agent.laboratoryTask,
    dimension: agent.dimension,
  };
}

export const allAgents: HomeAgent[] = ALL_AGENTS.map(toHomeAgent);

// Fileiras para a página inicial (estilo Netflix)
export const AGENT_ROWS = [
  { title: "Em Destaque",         agents: allAgents.slice(0, 6)  },
  { title: "Mais Populares",      agents: allAgents.slice(6, 12) },
  { title: "Conhecer os Agentes", agents: allAgents.slice(0, 4)  },
  { title: "Nível Avançado",      agents: allAgents.filter((a) => a.level === "Avançado" || a.level === "Expert") },
];
