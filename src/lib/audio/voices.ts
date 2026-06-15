export const VOICE_IDS: Record<string, string> = {
  nexus: process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS || 'pNInz6obpgDQGcFmaJgB',
}

export const DEFAULT_VOICE_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_DEFAULT || 'pNInz6obpgDQGcFmaJgB'

export function getAgentVoiceId(agentId: string): string {
  return VOICE_IDS[agentId] || DEFAULT_VOICE_ID
}
