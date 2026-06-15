/**
 * seasons.ts - Schema das 50 Temporadas (LEGO Blocks)
 * 
 * Define a estrutura modular das 5 fases, 50 temporadas e 500 módulos
 * Cada temporada é um "bloco LEGO" que pode ser combinado de diferentes formas
 */

// ============================================================================
// TIPOS BASE - Os "Blocos LEGO" fundamentais
// ============================================================================

export type Phase = 'DESPERTAR' | 'TENSÃO' | 'RUPTURA' | 'CONVERGÊNCIA' | 'TRANSCENDÊNCIA';

export type AgentId = 
  | 'nexus' | 'volt' | 'janus' | 'stratos' | 'kaos' 
  | 'ethos' | 'lyra' | 'axiom' | 'aurora' | 'cipher' 
  | 'terra' | 'prism' | 'gaia' | 'luna' | 'echo' | 'ignis' | 'aeon' | 'oraculo';

export type ConceptKey = 
  | 'machine-learning' | 'prompts' | 'padroes' | 'vies-algoritmico'
  | 'reinforcement-learning' | 'processamento-paralelo' | 'black-box'
  | 'smart-cities' | 'sistemas-preditivos' | 'automacao' | 'deepfake'
  | 'ia-generativa' | 'ia-emocional' | 'ia-juridica' | 'human-in-loop'
  | 'agi' | 'pos-trabalho' | 'biotech-ia' | 'geopolitica-ia';

// ============================================================================
// CONFIGURAÇÃO DAS FASES - As "Bases" do LEGO
// ============================================================================

export interface PhaseConfig {
  id: Phase;
  name: string;
  range: [number, number]; // T01-T10, T11-T20, etc.
  concept: string;
  emotion: string;
  dominantAgent: AgentId;
  guideAgents: AgentId[];
  provokeAgents: AgentId[];
}

export const PHASES: Record<Phase, PhaseConfig> = {
  DESPERTAR: {
    id: 'DESPERTAR',
    name: 'Despertar',
    range: [1, 10],
    concept: 'O que é IA e como ela aprende',
    emotion: 'Curiosidade · Surpresa · Primeiras dúvidas',
    dominantAgent: 'nexus',
    guideAgents: ['gaia', 'luna'],
    provokeAgents: ['volt', 'ignis'],
  },
  TENSÃO: {
    id: 'TENSÃO',
    name: 'Tensão',
    range: [11, 20],
    concept: 'IA na sociedade e primeiros dilemas éticos',
    emotion: 'Tensão · Conflito · Primeiros medos reais',
    dominantAgent: 'volt',
    guideAgents: ['ignis', 'echo'],
    provokeAgents: ['stratos', 'kaos'],
  },
  RUPTURA: {
    id: 'RUPTURA',
    name: 'Ruptura',
    range: [21, 30],
    concept: 'Paradigmas quebrados · IA avançada e seus limites',
    emotion: 'Desconforto · Raiva produtiva · Ruptura intelectual',
    dominantAgent: 'ignis',
    guideAgents: ['echo', 'kaos'],
    provokeAgents: ['janus', 'nexus'],
  },
  CONVERGÊNCIA: {
    id: 'CONVERGÊNCIA',
    name: 'Convergência',
    range: [31, 40],
    concept: 'Síntese · IA colaborativa · Humano e máquina juntos',
    emotion: 'Clareza · Responsabilidade · Maturidade intelectual',
    dominantAgent: 'stratos',
    guideAgents: ['aeon', 'oraculo'],
    provokeAgents: ['luna', 'kaos'],
  },
  TRANSCENDÊNCIA: {
    id: 'TRANSCENDÊNCIA',
    name: 'Transcendência',
    range: [41, 50],
    concept: 'IA e o futuro da humanidade · Consciência · Propósito',
    emotion: 'Gravidade · Transcendência · Responsabilidade geracional',
    dominantAgent: 'ethos',
    guideAgents: ['aeon', 'oraculo'],
    provokeAgents: ['volt', 'nexus'],
  },
};

// ============================================================================
// INTERFACE DA TEMPORADA - O "Bloco LEGO" individual
// ============================================================================

export interface Season {
  number: number;           // 1-50
  phase: Phase;
  title: string;
  theme: string;
  centralDilemma: string;
  agent: AgentId;
  conceptKey: ConceptKey;
  conceptDescription: string;
  modules: number;           // 10 módulos por temporada
}

// ============================================================================
// HELPERS - Funções paraMontar o LEGO
// ============================================================================

export function getPhaseForSeason(seasonNumber: number): Phase {
  if (seasonNumber <= 10) return 'DESPERTAR';
  if (seasonNumber <= 20) return 'TENSÃO';
  if (seasonNumber <= 30) return 'RUPTURA';
  if (seasonNumber <= 40) return 'CONVERGÊNCIA';
  return 'TRANSCENDÊNCIA';
}

export function getPhaseConfig(phase: Phase): PhaseConfig {
  return PHASES[phase];
}

export function getSeasonInPhase(seasonNumber: number): number {
  const phase = getPhaseForSeason(seasonNumber);
  const config = PHASES[phase];
  return seasonNumber - config.range[0] + 1;
}

export function getAgentForSeason(seasonNumber: number, userArchetype?: string): AgentId {
  const phase = getPhaseForSeason(seasonNumber);
  const config = PHASES[phase];
  
  // Se o usuário tem um perfil definido, ajusta o agente
  if (userArchetype) {
    const archetypeAgentMap: Record<string, AgentId> = {
      analytical: 'axiom',
      rebel: 'kaos',
      paralyzed: 'volt',
      empathetic: 'terra',
      strategic: 'stratos',
      creative: 'prism',
    };
    return archetypeAgentMap[userArchetype] || config.dominantAgent;
  }
  
  return config.dominantAgent;
}

export function getNextSeason(currentSeason: number, userChoice?: string): number {
  // Se o usuário fez uma escolha específica, pode pular fases
  const choiceImpact: Record<string, number> = {
    'expand': 3,
    'protect': 2,
    'question': 1,
    'accept': 0,
    'reject': -1,
  };
  
  const impact = userChoice ? (choiceImpact[userChoice.toLowerCase()] || 0) : 0;
  const nextSeason = Math.max(1, Math.min(50, currentSeason + 1 + impact));
  
  return nextSeason;
}

export function canAccessSeason(seasonNumber: number, completedSeasons: number[]): boolean {
  if (seasonNumber === 1) return true;
  return completedSeasons.includes(seasonNumber - 1);
}

// ============================================================================
// VALIDAÇÃO - Ensina que os LEGO se encaixam
// ============================================================================

export function validateSeason(season: Partial<Season>): season is Season {
  return (
    season.number !== undefined &&
    season.number >= 1 &&
    season.number <= 50 &&
    season.phase !== undefined &&
    season.agent !== undefined
  );
}