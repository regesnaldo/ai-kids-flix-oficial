// conflict-engine.ts
// Cena 9 — Agent Conflict System Runtime
// MASTER_SCREENPLAY.md ACT II Scene 9

import { AGENT_CONFLICTS } from '../../engine/agent-conflicts'

export interface ConflictContext {
  agentId: string
  conflictsWith: string[]
  nexusIntervenes: boolean
  tensionLevel: number // 0-100
}

export function detectConflict(agentId: string): ConflictContext | null {
  const conflict = AGENT_CONFLICTS.find(
    c => c.agentA === agentId || c.agentB === agentId
  )
  if (!conflict) return null
  return {
    agentId,
    conflictsWith: conflict.agentA === agentId 
      ? [conflict.agentB] 
      : [conflict.agentA],
    nexusIntervenes: true,
    tensionLevel: 50,
  }
}

export function injectConflictIntoPrompt(
  basePrompt: string,
  agentId: string
): string {
  const conflict = detectConflict(agentId)
  if (!conflict) return basePrompt
  return `${basePrompt}

// CONFLICT CONTEXT — injected by NEXUS
// This agent is in tension with: ${conflict.conflictsWith.join(', ')}
// Tension level: ${conflict.tensionLevel}/100
// NEXUS monitors this interaction: ${conflict.nexusIntervenes}
// Adjust response tone accordingly.`
}

export function getNexusIntervention(agentId: string): string | null {
  const conflict = detectConflict(agentId)
  if (!conflict || !conflict.nexusIntervenes) return null
  return `NEXUS INTERVENTION: Conflict detected between ${agentId} 
and ${conflict.conflictsWith.join(', ')}. 
Routing through arbitration layer.`
}
