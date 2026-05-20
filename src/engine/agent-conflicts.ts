/**
 * agent-conflicts.ts - Sistema de Conflitos entre Agentes
 * 
 * Define os conflitos narrativos entre os 12 agentes do MENTE.AI
 * O usuário é o "árbitro" dessas disputas.
 */

export type AgentId = 
  | 'nexus' | 'volt' | 'janus' | 'stratos' | 'kaos' 
  | 'ethos' | 'lyra' | 'axiom' | 'aurora' | 'cipher' 
  | 'terra' | 'prism';

export interface AgentConflict {
  agentA: AgentId;
  agentB: AgentId;
  conflictType: 'ideology' | 'method' | 'goal';
  description: string;
  resolutionQuestion: string;
}

export const AGENT_CONFLICTS: AgentConflict[] = [
  {
    agentA: 'volt',
    agentB: 'ethos',
    conflictType: 'method',
    description: 'VELOCIDADE vs ÉTICA - VOLT quer ação imediata, ETHOS pondera consequências.',
    resolutionQuestion: 'A IA deve agir rápido mesmo sem garantias éticas?',
  },
  {
    agentA: 'kaos',
    agentB: 'stratos',
    conflictType: 'method',
    description: 'DESTRUição vs PLANEJAMENTO - KAOS quebra regras, STRATOS segue estratégia.',
    resolutionQuestion: 'Inovação requer destruir o existente ou construir sobre ele?',
  },
  {
    agentA: 'cipher',
    agentB: 'aurora',
    conflictType: 'ideology',
    description: 'SEGREDos vs ABERTURA - CIPHER protege informações, AURORA revela tudo.',
    resolutionQuestion: 'Conhecimento deve ser compartilhado ou protegido?',
  },
  {
    agentA: 'axiom',
    agentB: 'lyra',
    conflictType: 'goal',
    description: 'LÓGICA vs EMOÇÃO - AXIOM busca precisão, LYRA busca harmonia.',
    resolutionQuestion: 'Decisão deve ser racional ou sentir?',
  },
  {
    agentA: 'nexus',
    agentB: 'prism',
    conflictType: 'ideology',
    description: 'CONEXÃO vs REVELAÇÃO - NEXUS conecta tudo, PRISM mostra verdades ocultas.',
    resolutionQuestion: 'Devemos revelar verdades que quebram conexões?',
  },
  {
    agentA: 'terra',
    agentB: 'kaos',
    conflictType: 'goal',
    description: 'PROTEÇÃO vs TRANSFORMAÇÃO - TERRA preserva, KAOS transforma.',
    resolutionQuestion: 'Humanidade precisa de estabilidade ou ruptura?',
  },
  {
    agentA: 'stratos',
    agentB: 'janus',
    conflictType: 'method',
    description: 'ESTRATÉGIA vs HUMOR - STRATOS planeja, JANUS quebra tensão com humor.',
    resolutionQuestion: 'Momentos de tensão pedem lógica ou leveza?',
  },
  {
    agentA: 'ethos',
    agentB: 'volt',
    conflictType: 'goal',
    description: 'ÉTICA vs AÇÃO - ETHOS questiona, VOLT executa.',
    resolutionQuestion: 'Reflexãoslows ação ou a potencializa?',
  },
];

export function getConflictForAgents(agentA: AgentId, agentB: AgentId): AgentConflict | null {
  return AGENT_CONFLICTS.find(
    c => (c.agentA === agentA && c.agentB === agentB) || 
         (c.agentA === agentB && c.agentB === agentA)
  ) || null;
}

export function getActiveConflicts(userDecisions: { agentId: AgentId; choice: string }[]): AgentConflict[] {
  const recentAgents = userDecisions.slice(-4).map(d => d.agentId);
  const conflicts: AgentConflict[] = [];
  
  for (let i = 0; i < recentAgents.length - 1; i++) {
    const conflict = getConflictForAgents(recentAgents[i], recentAgents[i + 1]);
    if (conflict) conflicts.push(conflict);
  }
  
  return conflicts;
}