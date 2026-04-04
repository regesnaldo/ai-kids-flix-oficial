import { agents } from "@/data/agents";

export const agentsByLevel = {
  Fundamentos: agents.filter((agent) => agent.level === "Fundamentos"),
  Intermediário: agents.filter((agent) => agent.level === "Intermediário"),
  Avançado: agents.filter((agent) => agent.level === "Avançado"),
  Mestre: agents.filter((agent) => agent.level === "Mestre"),
} as const;

export function getAgentByOrder(order: number) {
  return agents.find((agent) => agent.discoveryOrder === order) ?? null;
}
