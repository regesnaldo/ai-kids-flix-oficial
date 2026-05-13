/**
 * narrative-transitions.ts - Sistema de Transições Narrativas
 * 
 * Gerencia as transições entre universos dos agentes
 * O agente atual planta a semente da próxima transição
 */

import type { AgentId } from './agent-conflicts';

export interface NarrativeTransition {
  fromAgent: AgentId;
  toAgent: AgentId;
  triggerPhrase: string;
  transitionMessage: string;
  visualEffect: 'fade' | 'dissolve' | 'expand' | 'contract';
  audioCue: string;
}

const TRANSITIONS: NarrativeTransition[] = [
  {
    fromAgent: 'nexus',
    toAgent: 'volt',
    triggerPhrase: 'hesitação|zona de conforto|medo',
    transitionMessage: 'Você hesita. NEXUS detecta. A energia muda...',
    visualEffect: 'expand',
    audioCue: 'electric_surge',
  },
  {
    fromAgent: 'nexus',
    toAgent: 'axiom',
    triggerPhrase: 'lógica|prova|análise',
    transitionMessage: 'NEXUS percebe sua mente analítica. O cosmos se organiza...',
    visualEffect: 'dissolve',
    audioCue: ' crystalline',
  },
  {
    fromAgent: 'volt',
    toAgent: 'ethos',
    triggerPhrase: 'consequência|ético|segurança',
    transitionMessage: 'A energia atinge um limite. ETHOS aparece com uma pergunta...',
    visualEffect: 'fade',
    audioCue: 'deep_resonance',
  },
  {
    fromAgent: 'ethos',
    toAgent: 'kaos',
    triggerPhrase: 'rebelde|inovar|quebrar',
    transitionMessage: 'ETHOS sorri. As regras se dissolvem. KAOS emerge...',
    visualEffect: 'expand',
    audioCue: 'chaos_burst',
  },
  {
    fromAgent: 'kaos',
    toAgent: 'stratos',
    triggerPhrase: 'planejar|estratégia|organizar',
    transitionMessage: 'O caos se estabiliza. STRATOS assume o controle...',
    visualEffect: 'contract',
    audioCue: 'chess_piece',
  },
  {
    fromAgent: 'stratos',
    toAgent: 'prism',
    triggerPhrase: 'novo|perspectiva|diferente',
    transitionMessage: 'O tabuleiro se fragmenta. PRISM refrata a realidade...',
    visualEffect: 'dissolve',
    audioCue: 'prism_shatter',
  },
  {
    fromAgent: 'prism',
    toAgent: 'aurora',
    triggerPhrase: 'curiosidade|explorar|descobrir',
    transitionMessage: 'As realidades se fundem. AURORA abre novos horizontes...',
    visualEffect: 'expand',
    audioCue: 'dawn_light',
  },
  {
    fromAgent: 'aurora',
    toAgent: 'lyra',
    triggerPhrase: 'sentir|emoção|arte',
    transitionMessage: 'A luz ganha cor. LYRA traduz em melodias...',
    visualEffect: 'fade',
    audioCue: 'harmonic_wave',
  },
  {
    fromAgent: 'lyra',
    toAgent: 'terra',
    triggerPhrase: 'humano|empatia|cuidar',
    transitionMessage: 'A melodia toca o coração. TERRA ancora na realidade...',
    visualEffect: 'fade',
    audioCue: 'earth_growth',
  },
  {
    fromAgent: 'terra',
    toAgent: 'cipher',
    triggerPhrase: 'segredo|mistério|codificar',
    transitionMessage: 'TERRA detecta padrões. CIPHER revela o oculto...',
    visualEffect: 'dissolve',
    audioCue: 'code_unlock',
  },
  {
    fromAgent: 'cipher',
    toAgent: 'janus',
    triggerPhrase: 'tensão|humor|rir',
    transitionMessage: 'Os códigos se divertem. JANUS quebra a tensão...',
    visualEffect: 'expand',
    audioCue: 'laugh_quantum',
  },
  {
    fromAgent: 'janus',
    toAgent: 'nexus',
    triggerPhrase: 'retorno|conectar|unificar',
    transitionMessage: 'A experiência se fecha. NEXUS reconecta os pontos...',
    visualEffect: 'contract',
    audioCue: 'nexus_pulse',
  },
];

export function findTransition(fromAgent: AgentId, userText: string): NarrativeTransition | null {
  const lowerText = userText.toLowerCase();
  
  const matching = TRANSITIONS.filter(t => 
    t.fromAgent === fromAgent && 
    new RegExp(t.triggerPhrase, 'i').test(lowerText)
  );
  
  if (matching.length === 0) {
    const defaultTransition = TRANSITIONS.find(t => t.fromAgent === fromAgent);
    return defaultTransition || null;
  }
  
  return matching[Math.floor(Math.random() * matching.length)];
}

export function getNextAgentForTransition(
  fromAgent: AgentId, 
  archetype: string
): AgentId {
  const transitionMap: Record<string, AgentId> = {
    analytical: 'axiom',
    rebel: 'kaos',
    paralyzed: 'volt',
    empathetic: 'terra',
    strategic: 'stratos',
    creative: 'prism',
  };
  
  return transitionMap[archetype] || 'nexus';
}

export function shouldTriggerTransition(
  currentAgent: AgentId,
  consecutiveChoices: number,
  emotionalScore: number
): boolean {
  return consecutiveChoices >= 3 || Math.abs(emotionalScore) > 2.5;
}