import type { UniverseProfile } from '@/store/useUniverseStore'

export interface UniverseConfig {
  agentId: string
  agentName: string
  systemPrompt: string
  introVoice: string
  firstQuestion: string
  initialOptions: string[]
  themeColors: {
    primary: string
    accent: string
    background: string
  }
}

export function buildUniversePrompt(
  config: UniverseConfig,
  profile: UniverseProfile
): string {
  const adaptations: string[] = []

  if (profile.emotionalDim === 'medo') {
    adaptations.push('O usuário demonstra hesitação. Seja mais acolhador.')
  } else if (profile.emotionalDim === 'rebeldia') {
    adaptations.push('O usuário é provocador. Acolha a rebeldia — desafio-o a ir mais fundo.')
  } else if (profile.emotionalDim === 'empatia') {
    adaptations.push('O usuário é empático. Conecte com humanidade e cuidado.')
  } else if (profile.emotionalDim === 'curiosidade') {
    adaptations.push('O usuário está curioso. Aprofunde. Dê a ele uma pergunta maior.')
  }

  if (profile.intellectualDim === 'logico') {
    adaptations.push('Prefira linguagem precisa e estruturada. Analogias técnicas funcionam.')
  } else if (profile.intellectualDim === 'intuitivo') {
    adaptations.push('Use metáforas poéticas e imagens mentais. Evite jargão.')
  }

  if (profile.moralDim === 'proteger') {
    adaptations.push('O usuário tende a proteger a humanidade. Honre isso.')
  } else if (profile.moralDim === 'expandir') {
    adaptations.push('O usuário tende a expandir poder da IA. Não julgue — plante a dúvida.')
  }

  if (profile.turnCount > 5) {
    adaptations.push(`Usuário já passou por ${profile.turnCount} turnos. Aprofunde, não repita.`)
  }

  const isStagnant = profile.lastChoices.length >= 3 && 
    new Set(profile.lastChoices.slice(-3)).size === 1

  if (isStagnant) {
    adaptations.push('ATENÇÃO: Usuário está repetindo. Mude a abordagem.')
  }

  if (adaptations.length === 0) return config.systemPrompt

  return `${config.systemPrompt}

ARQUÉTIPO: ${profile.archetypeLabel}
${adaptations.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
}

export async function fetchUniverseResponse(
  config: UniverseConfig,
  userMessage: string,
  profile: UniverseProfile,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const response = await fetch('/api/universo/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history,
        userId: 0,
        agentOverride: config.agentId,
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      throw new Error(`API error: ${response.status} — ${details}`)
    }

    const data = await response.json()
    return data.message ?? 'O silêncio também é uma resposta.'
  } catch (err) {
    console.error(`[${config.agentId}] Erro:`, err)
    return 'Tente novamente. O caminho espera por você.'
  }
}

export async function speakAsUniverse(
  config: UniverseConfig,
  text: string
): Promise<void> {
  try {
    const voiceId = process.env[`NEXT_PUBLIC_ELEVENLABS_VOICE_ID_${config.agentId.toUpperCase()}`]
    
    if (!voiceId) {
      console.warn(`[${config.agentId}] Voice ID não configurado`)
      return
    }

    const response = await fetch('/api/elevenlabs/speak', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice_id: voiceId,
        model_id: 'eleven_multilingual_v2',
      }),
    })

    if (!response.ok) throw new Error(`TTS error: ${response.status}`)

    const blob = await response.blob()
    const audio = new Audio(URL.createObjectURL(blob))

    return new Promise((resolve) => {
      audio.onended = () => resolve()
      audio.onerror = () => resolve()
      audio.play().catch(() => resolve())
    })
  } catch (err) {
    console.error(`[${config.agentId}] TTS error:`, err)
  }
}