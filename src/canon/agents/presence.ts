/**
 * ─── AGENT PRESENCE ────────────────────────────────────────────────────────
 * Extensão do canon — identidade sensorial dos 12 agentes.
 * Fonte única de verdade para cor, frequência, partícula e ritmo.
 * Consumido por: MemoryGalaxy, colorEngine, audioEngine, beaconFactory.
 * NÃO duplica AgentDefinition — apenas adiciona camada de presença.
 */

export type ParticleShape = 'sphere' | 'ring' | 'fractal' | 'wave' | 'burst' | 'helix'
export type AnimationRhythm = 'pulse' | 'orbit' | 'breathe' | 'burst' | 'flow' | 'flicker'

export interface AgentPresence {
  id: string
  color: string        // cor principal (hex)
  colorSecondary: string // cor secundária (hex)
  frequency: number    // frequência base em Hz (Tone.js)
  particleShape: ParticleShape
  animationRhythm: AnimationRhythm
  glowIntensity: number // 0-1
  description: string  // identidade sensorial em 1 frase
}

export const AGENT_PRESENCE: Record<string, AgentPresence> = {
  nexus: {
    id: 'nexus',
    color: '#00f0ff',
    colorSecondary: '#0088cc',
    frequency: 528,       // Hz — frequência do "amor e conexão", centro
    particleShape: 'sphere',
    animationRhythm: 'pulse',
    glowIntensity: 1,
    description: 'Centro gravitacional — pulso constante, presença total',
  },
  volt: {
    id: 'volt',
    color: '#f97316',
    colorSecondary: '#dc2626',
    frequency: 741,       // Hz — expressão e soluções, energia
    particleShape: 'burst',
    animationRhythm: 'burst',
    glowIntensity: 0.9,
    description: 'Energia cinética — explosões rítmicas, impulso puro',
  },
  aurora: {
    id: 'aurora',
    color: '#a855f7',
    colorSecondary: '#6366f1',
    frequency: 396,       // Hz — liberar medo, criação fluida
    particleShape: 'wave',
    animationRhythm: 'flow',
    glowIntensity: 0.85,
    description: 'Fluxo criativo — ondas suaves, aurora em movimento',
  },
  kaos: {
    id: 'kaos',
    color: '#ef4444',
    colorSecondary: '#7f1d1d',
    frequency: 285,       // Hz — campos de energia, disrupção
    particleShape: 'fractal',
    animationRhythm: 'burst',
    glowIntensity: 0.95,
    description: 'Disrupção controlada — fractais explosivos, caos criativo',
  },
  cipher: {
    id: 'cipher',
    color: '#10b981',
    colorSecondary: '#065f46',
    frequency: 417,       // Hz — mudança e facilitar, padrões ocultos
    particleShape: 'helix',
    animationRhythm: 'orbit',
    glowIntensity: 0.8,
    description: 'Padrões ocultos — hélice rotacional, código vivo',
  },
  ethos: {
    id: 'ethos',
    color: '#3b82f6',
    colorSecondary: '#1e3a8a',
    frequency: 639,       // Hz — conexões e relacionamentos, ética
    particleShape: 'ring',
    animationRhythm: 'breathe',
    glowIntensity: 0.75,
    description: 'Equilíbrio moral — respiração lenta, presença ética',
  },
  janus: {
    id: 'janus',
    color: '#8b5cf6',
    colorSecondary: '#4c1d95',
    frequency: 852,       // Hz — despertar intuição, dualidade
    particleShape: 'wave',
    animationRhythm: 'flicker',
    glowIntensity: 0.85,
    description: 'Dualidade em tensão — oscilação entre estados opostos',
  },
  lyra: {
    id: 'lyra',
    color: '#ec4899',
    colorSecondary: '#831843',
    frequency: 432,       // Hz — harmonia universal, beleza
    particleShape: 'wave',
    animationRhythm: 'flow',
    glowIntensity: 0.8,
    description: 'Harmonia sensorial — ondas musicais, sinestesia pura',
  },
  prism: {
    id: 'prism',
    color: '#fbbf24',
    colorSecondary: '#92400e',
    frequency: 963,       // Hz — consciência pura, múltiplas perspectivas
    particleShape: 'fractal',
    animationRhythm: 'pulse',
    glowIntensity: 0.9,
    description: 'Perspectivas múltiplas — prisma em rotação, luz fragmentada',
  },
  stratos: {
    id: 'stratos',
    color: '#06b6d4',
    colorSecondary: '#164e63',
    frequency: 174,       // Hz — fundação e segurança, estratégia
    particleShape: 'ring',
    animationRhythm: 'orbit',
    glowIntensity: 0.75,
    description: 'Visão estratégica — órbitas calculadas, movimento preciso',
  },
  terra: {
    id: 'terra',
    color: '#84cc16',
    colorSecondary: '#365314',
    frequency: 256,       // Hz — dó fundamental, equilíbrio natural
    particleShape: 'sphere',
    animationRhythm: 'breathe',
    glowIntensity: 0.7,
    description: 'Enraizamento vivo — respiração da terra, presença orgânica',
  },
  axiom: {
    id: 'axiom',
    color: '#e2e8f0',
    colorSecondary: '#475569',
    frequency: 315,       // Hz — clareza matemática, verdade absoluta
    particleShape: 'helix',
    animationRhythm: 'orbit',
    glowIntensity: 0.65,
    description: 'Verdade matemática — hélice perfeita, ordem cristalina',
  },
}

/** Helper: retorna presença de um agente pelo ID */
export function getAgentPresence(agentId: string): AgentPresence | null {
  return AGENT_PRESENCE[agentId] ?? null
}

/** Helper: retorna cor principal pelo ID (fallback: branco) */
export function getAgentColor(agentId: string): string {
  return AGENT_PRESENCE[agentId]?.color ?? '#ffffff'
}

/** Helper: retorna frequência pelo ID (fallback: 440 Hz — lá padrão) */
export function getAgentFrequency(agentId: string): number {
  return AGENT_PRESENCE[agentId]?.frequency ?? 440
}
