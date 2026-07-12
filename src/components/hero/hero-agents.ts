/**
 * MENTE.AI — Hero Agent Configuration
 *
 * Define os agentes que orbitam o NEXUS no Hero cinematográfico.
 * Cores e identidade sensorial vêm de @/canon/agents/presence —
 * NÃO duplica o canon, apenas seleciona quais agentes aparecem no hero.
 */

import { AGENT_PRESENCE } from '@/canon/agents/presence'

export interface HeroAgent {
  id: string
  name: string
  role: string
  color: string
  colorSecondary: string
  orbitRadius: number
  orbitSpeed: number
  orbitPhase: number
  orbitHeight: number
  planetSize: number
}

/** Agentes ativos no hero (canon: SYSTEM_ONLINE_AGENTS = nexus, volt, aurora) */
export const HERO_AGENTS: HeroAgent[] = [
  {
    id: 'volt',
    name: 'VOLT',
    role: 'Energia & Motivação',
    color: AGENT_PRESENCE.volt.color,
    colorSecondary: AGENT_PRESENCE.volt.colorSecondary,
    orbitRadius: 4.5,
    orbitSpeed: 0.15,
    orbitPhase: 0,
    orbitHeight: 0.3,
    planetSize: 0.55,
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    role: 'Análise & Padrões',
    color: AGENT_PRESENCE.cipher.color,
    colorSecondary: AGENT_PRESENCE.cipher.colorSecondary,
    orbitRadius: 6.0,
    orbitSpeed: 0.10,
    orbitPhase: Math.PI * 0.67,
    orbitHeight: -0.2,
    planetSize: 0.55,
  },
  {
    id: 'aurora',
    name: 'AURORA',
    role: 'Visão & Criação',
    color: AGENT_PRESENCE.aurora.color,
    colorSecondary: AGENT_PRESENCE.aurora.colorSecondary,
    orbitRadius: 5.2,
    orbitSpeed: 0.12,
    orbitPhase: Math.PI * 1.33,
    orbitHeight: 0.5,
    planetSize: 0.55,
  },
]

export const NEXUS_COLOR = '#00f0ff'
export const NEXUS_GOLD = '#FFD700'

/**
 * Calcula a posição orbital de um agente no tempo `time` (segundos).
 * Usado por AgentPlanet e EnergyLink — stateless, sempre sincronizado.
 */
export function getOrbitPosition(agent: HeroAgent, time: number): [number, number, number] {
  const angle = agent.orbitPhase + time * agent.orbitSpeed
  return [
    Math.cos(angle) * agent.orbitRadius,
    agent.orbitHeight + Math.sin(time * 0.3 + agent.orbitPhase) * 0.15,
    Math.sin(angle) * agent.orbitRadius,
  ]
}
