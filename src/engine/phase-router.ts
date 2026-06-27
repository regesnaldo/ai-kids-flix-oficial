/**
 * phase-router.ts - Roteamento por Fases e Temporadas
 * 
 * Sistema LEGO que conecta:
 * - 5 Fases Narrativas
 * - 50 Temporadas
 * - 12 Agentes
 * - 3 Dimensões do perfil
 */

import { 
  type Season, 
  type Phase, 
  type AgentId,
  getPhaseForSeason,
  getPhaseConfig,
  getAgentForSeason,
  canAccessSeason,
  getNextSeason,
  PHASES
} from '@/config/seasons';

import { getSeasonByNumber, getSeasonsByPhase, getSeasonSummary } from '@/data/seasons';

import type { Archetype } from './types';

export interface PhaseRouterDecision {
  currentSeason: number;
  currentPhase: Phase;
  currentAgent: AgentId;
  season: Season;
  availableSeasons: number[];
  nextSeason: number;
  canProceed: boolean;
  learningPath: Season[];
  conceptProgress: string[];
  emotionalArc: string;
}

export interface UserProgress {
  currentSeason: number;
  completedSeasons: number[];
  archetype: Archetype;
  emotionalScore: number;
  intellectualScore: number;
  moralScore: number;
}

// ============================================================================
// MAIN FUNCTION - O "Montador de LEGO"
// ============================================================================

export function routeSeason(userProgress: UserProgress): PhaseRouterDecision {
  const { currentSeason, completedSeasons } = userProgress;
  
  // 1. Obter configuração da fase atual
  const phase = getPhaseForSeason(currentSeason);
  const phaseConfig = getPhaseConfig(phase);
  
  // 2. Obter a temporada atual
  const season = getSeasonByNumber(currentSeason) || getSeasonByNumber(1)!;
  
  // 3. Determinar o agente basedo no perfil do usuário
  const currentAgent = getAgentForSeason(currentSeason, userProgress.archetype);
  
  // 4. Calcular próximos passos
  const canProceed = canAccessSeason(currentSeason + 1, completedSeasons);
  const nextSeason = canProceed 
    ? getNextSeason(currentSeason) 
    : currentSeason;
  
  // 5. Gerar caminho de aprendizado (próximas 3 temporadas)
  const learningPath = generateLearningPath(currentSeason, userProgress.archetype);
  
  // 6. Calcular progresso conceitual
  const conceptProgress = calculateConceptProgress(completedSeasons);
  
  // 7. Determinar arco emocional da fase
  const emotionalArc = determineEmotionalArc(phase, userProgress.emotionalScore);
  
  // 8. Lista de temporadas disponíveis para esta fase
  const availableSeasons = getSeasonsByPhase(phase).map(s => s.number);

  return {
    currentSeason,
    currentPhase: phase,
    currentAgent,
    season,
    availableSeasons,
    nextSeason,
    canProceed,
    learningPath,
    conceptProgress,
    emotionalArc,
  };
}

// ============================================================================
// HELPERS - Funções auxiliares de montagem
// ============================================================================

function generateLearningPath(startSeason: number, archetype?: string): Season[] {
  const path: Season[] = [];
  const nextSeasons = [startSeason + 1, startSeason + 2, startSeason + 3];
  
  for (const num of nextSeasons) {
    if (num > 50) break;
    const season = getSeasonByNumber(num);
    if (season) path.push(season);
  }
  
  return path;
}

function calculateConceptProgress(completedSeasons: number[]): string[] {
  const concepts: string[] = [];
  
  for (const num of completedSeasons.slice(-5)) {
    const season = getSeasonByNumber(num);
    if (season) {
      concepts.push(season.conceptKey);
    }
  }
  
  return [...new Set(concepts)]; // Remove duplicates
}

function determineEmotionalArc(phase: Phase, emotionalScore: number): string {
  const phaseArcs: Record<Phase, string> = {
    DESPERTAR: 'Curiosidade → Surpresa → Primeiras dúvidas',
    TENSÃO: 'Tensão → Conflito → Primeiros medos reais',
    RUPTURA: 'Desconforto → Raiva produtiva → Ruptura intelectual',
    CONVERGÊNCIA: 'Clareza → Responsabilidade → Maturidade intelectual',
    TRANSCENDÊNCIA: 'Gravidade → Transcendência → Responsabilidade geracional',
  };
  
  // Ajusta baseado no score emocional do usuário
  if (emotionalScore > 2) {
    return `${phaseArcs[phase]} (positivo)`;
  } else if (emotionalScore < -2) {
    return `${phaseArcs[phase]} (desafiado)`;
  }
  
  return phaseArcs[phase];
}

// ============================================================================
// BACKTRACKING - Função para "desmontar e remontar" o LEGO
// ============================================================================

export function shouldBacktrackToPhase(
  currentSeason: number,
  userProgress: UserProgress
): { shouldBacktrack: boolean; targetSeason: number; reason: string } {
  const phase = getPhaseForSeason(currentSeason);
  const completedInPhase = userProgress.completedSeasons.filter(
    s => getPhaseForSeason(s) === phase
  );
  
  // Se o usuário completou menos de 3 temporadas nesta fase, considerar backtrack
  if (completedInPhase.length < 3 && currentSeason > 1) {
    const phaseConfig = getPhaseConfig(phase);
    const targetSeason = phaseConfig.range[0]; // Primeira temporada da fase
    
    return {
      shouldBacktrack: true,
      targetSeason,
      reason: `Revisar fundamentos da fase ${phaseConfig.name} antes de avançar`,
    };
  }
  
  return {
    shouldBacktrack: false,
    targetSeason: currentSeason,
    reason: '',
  };
}

// ============================================================================
// SEASON UNLOCK SYSTEM - Quando o LEGO pode ser montado
// ============================================================================

export function canUnlockSeason(
  seasonNumber: number,
  userProgress: UserProgress
): { canUnlock: boolean; required: number[]; reason: string } {
  if (seasonNumber === 1) {
    return { canUnlock: true, required: [], reason: 'Primeira temporada disponível' };
  }
  
  const requiredSeasons: number[] = [];
  
  // Temporada anterior é sempre necessária
  if (!userProgress.completedSeasons.includes(seasonNumber - 1)) {
    requiredSeasons.push(seasonNumber - 1);
  }
  
  // Se é o início de uma nova fase, verificar se completou a fase anterior
  const currentPhase = getPhaseForSeason(seasonNumber);
  const phaseConfig = getPhaseConfig(currentPhase);
  
  if (seasonNumber === phaseConfig.range[0]) {
    // É primeira temporada da fase - verificar se completou fase anterior
    const phases: Phase[] = ['DESPERTAR', 'TENSÃO', 'RUPTURA', 'CONVERGÊNCIA', 'TRANSCENDÊNCIA'];
    const currentPhaseIndex = phases.indexOf(currentPhase);
    
    if (currentPhaseIndex > 0) {
      const previousPhase = phases[currentPhaseIndex - 1];
      const prevPhaseConfig = getPhaseConfig(previousPhase);
      const lastOfPrevPhase = prevPhaseConfig.range[1];
      
      if (!userProgress.completedSeasons.includes(lastOfPrevPhase)) {
        requiredSeasons.push(lastOfPrevPhase);
      }
    }
  }
  
  const canUnlock = requiredSeasons.length === 0;
  
  return {
    canUnlock,
    required: requiredSeasons,
    reason: canUnlock 
      ? 'Temporada desbloqueada' 
      : `Complete: ${requiredSeasons.map(n => `T${n.toString().padStart(2, '0')}`).join(', ')}`,
  };
}

// ============================================================================
// EXPORT PARA USO NO ROUTER PRINCIPAL
// ============================================================================

export function integrateWithMainRouter(
  currentSeason: number,
  userArchetype: Archetype,
  emotionalScore: number,
  intellectualScore: number,
  moralScore: number
): {
  agent: AgentId;
  season: Season;
  phaseConfig: typeof PHASES[Phase];
  nextAgent: AgentId;
  phaseTransition: boolean;
} {
  const phase = getPhaseForSeason(currentSeason);
  const phaseConfig = getPhaseConfig(phase);
  const season = getSeasonByNumber(currentSeason) || getSeasonByNumber(1)!;
  
  // Agent basedo no perfil do usuário
  const agent = getAgentForSeason(currentSeason, userArchetype);
  
  // Próximo agente baseado nas escolhas
  let nextAgent = getAgentForSeason(currentSeason + 1, userArchetype);
  
  // Detectar transição de fase
  const nextPhase = getPhaseForSeason(currentSeason + 1);
  const phaseTransition = nextPhase !== phase;
  
  if (phaseTransition) {
    // Na transição de fase, usar agente dominannte da nova fase
    nextAgent = getPhaseConfig(nextPhase).dominantAgent;
  }
  
  return {
    agent,
    season,
    phaseConfig,
    nextAgent,
    phaseTransition,
  };
}