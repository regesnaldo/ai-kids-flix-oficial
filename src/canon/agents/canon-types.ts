// ═══════════════════════════════════════════════════════════════════════════
// CANON TYPES — Tipos compartilhados do sistema de agentes MENTE.AI
// ═══════════════════════════════════════════════════════════════════════════
// Extraídos de canon.ts para permitir que arquivos por agente importem
// os tipos sem criar dependência circular com o barrel re-export.

export type AgentId =
  | 'nexus' | 'cipher' | 'kaos' | 'aurora'
  | 'volt' | 'ethos' | 'lyra' | 'axiom'
  | 'stratos' | 'terra' | 'prism' | 'janus'

export const AGENT_ORDER: AgentId[] = [
  'nexus', 'cipher', 'kaos', 'aurora',
  'volt', 'ethos', 'lyra', 'axiom',
  'stratos', 'terra', 'prism', 'janus',
]

export interface AgentIdentity {
  id: string
  name: string
  role: string
  color: string
  glowColor: string
  aestheticDescription: string
}

export interface AgentCognition {
  systemPrompt: string
  tone: string
  communicationStyle: string
  maxParagraphs: number
  memoryScope: ('conversation' | 'experiment' | 'global')[]
  allowedActions: string[]
}

export interface AgentRelationships {
  precedes: string | null
  succeeds: string | null
  synergyWith: string[]
  conflictWith: string[]
}

export interface AgentDefinition {
  identity: AgentIdentity
  cognition: AgentCognition
  relationships: AgentRelationships
}
