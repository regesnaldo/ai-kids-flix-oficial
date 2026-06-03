import type { Agent } from "@/types/agent";

const AGENTS: Agent[] = [
  {
    id: "nexus",
    name: "NEXUS",
    color: "#3B82F6",
    description: "O estrategista da inteligência artificial",
    expertise: "Fundamentos, lógica, arquitetura de IA",
  },
  {
    id: "cipher",
    name: "CIPHER",
    color: "#10B981",
    description: "O decifrador de códigos",
    expertise: "Redes neurais, deep learning, algoritmos",
  },
  {
    id: "kaos",
    name: "KAOS",
    color: "#F59E0B",
    description: "O explorador do inesperado",
    expertise: "Criatividade, ética, futuro da IA",
  },
  {
    id: "aurora",
    name: "AURORA",
    color: "#EC4899",
    description: "A visionária da inovação",
    expertise: "IA generativa, LLMs, NLP",
  },
  {
    id: "volt",
    name: "VOLT",
    color: "#8B5CF6",
    description: "O engenheiro de sistemas",
    expertise: "Machine learning, computação, otimização",
  },
  {
    id: "ethos",
    name: "ETHOS",
    color: "#06B6D4",
    description: "O guardião da ética digital",
    expertise: "Ética em IA, segurança, impacto social",
  },
];

export function getAgents(): Agent[] {
  return AGENTS;
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export const DEFAULT_AGENT_ID = "nexus";
