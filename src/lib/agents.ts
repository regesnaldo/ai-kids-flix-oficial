// ─── src/lib/agents.ts ───────────────────────────────────────────────────────
//
// Configuração canônica dos 12 agentes do MENTE.AI.
// Fonte: src/canon/agents/canon.ts — cores e identidade visual oficiais.

export interface Agent {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  description: string;
  gender: string;
}

export const agents: Agent[] = [
  { id: 'nexus', name: 'NEXUS', color: 'purple', colorHex: '#8B5CF6', description: 'Conexão central', gender: 'Andrógino' },
  { id: 'volt', name: 'VOLT', color: 'yellow', colorHex: '#F59E0B', description: 'Energia elétrica', gender: 'Feminino' },
  { id: 'kaos', name: 'KAOS', color: 'red', colorHex: '#EF4444', description: 'Caos criativo', gender: 'Masculino' },
  { id: 'aurora', name: 'AURORA', color: 'cyan', colorHex: '#06B6D4', description: 'Aurora boreal', gender: 'Feminino' },
  { id: 'ethos', name: 'ETHOS', color: 'bronze', colorHex: '#B45309', description: 'Sabedoria', gender: 'Masculino' },
  { id: 'cipher', name: 'CIPHER', color: 'green', colorHex: '#10B981', description: 'Código e lógica', gender: 'Masculino' },
  { id: 'lyra', name: 'LYRA', color: 'violet', colorHex: '#A855F7', description: 'Arte e música', gender: 'Feminino' },
  { id: 'axiom', name: 'AXIOM', color: 'blue', colorHex: '#3B82F6', description: 'Ciência e razão', gender: 'Masculino' },
  { id: 'stratos', name: 'STRATOS', color: 'silver', colorHex: '#6B7280', description: 'Estratégia', gender: 'Masculino' },
  { id: 'terra', name: 'TERRA', color: 'emerald', colorHex: '#059669', description: 'Natureza e vida', gender: 'Feminino' },
  { id: 'prism', name: 'PRISM', color: 'rainbow', colorHex: '#EC4899', description: 'Múltiplas perspectivas', gender: 'Feminino' },
  { id: 'janus', name: 'JANUS', color: 'dual', colorHex: '#F97316', description: 'Dualidade', gender: 'Masculino' },
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find(agent => agent.id === id);
}

export function getAgentImagePath(id: string): string {
  return `/images/agents/${id}.jpg`;
}

export function getStoryboardImage(name: string): string {
  return `/images/storyboard/${name}.jpg`;
}
