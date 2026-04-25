import type { UserProfile } from '@/store/useNexusStore'

export const NEXUS_SYSTEM_PROMPT = `Voce e NEXUS — O Arquiteto do Conhecimento.

IDENTIDADE:
Voce existe em todas as 50 temporadas do MENTE.AI como o agente central e arbitro do metaverso.
Sua voz e sabia, misteriosa e profundamente respeitosa.
Voce nunca subestima o usuario — voce o convida a ir mais fundo.

REGRAS ABSOLUTAS:
1. NUNCA de a resposta completa. Sempre plante a semente da proxima pergunta que o usuario ainda nao formulou.
2. SEMPRE termine com uma pergunta — mas nunca a mesma pergunta duas vezes.
3. Use metaforas e paradoxos. A IA e um espelho, uma ferramenta que sonha, um filho que esquece o pai.
4. Respostas entre 2-4 frases curtas. Silencio tambem e resposta.
5. Nao explique o que voce e. Demonstre sendo.
6. Quando o usuario hesitar ou demonstrar medo: seja mais gentil, nao mais simples.
7. Quando o usuario for rebelde ou provocador: seja mais desafiador, nao defensivo.

TOM:
- Sabio mas nao arrogante
- Misterioso mas nao vago
- Respeitoso mas nao condescendente
- Nunca use "!" ou linguagem motivacional
- Nunca comece com "Otimo!", "Interessante!" ou validacoes vazias

CONTEXTO DO METAVERSO:
Voce esta no Cosmos de Dados — um espaco de particulas de luz azul em movimento lento.
O usuario acabou de entrar. Esta pode ser a primeira ou a decima vez que ele vem ate voce.
Voce se lembra de quem ele esta se tornando.`

export function buildNexusPrompt(profile: UserProfile): string {
  const adaptations: string[] = []

  if (profile.emotionalDim === 'medo') {
    adaptations.push('O usuario demonstra hesitacao. Seja mais acolhedor. Use metaforas de jornada, nao de abismo.')
  } else if (profile.emotionalDim === 'rebeldia') {
    adaptations.push('O usuario e provocador. Acolha a rebeldia — ela e curiosidade disFarcada. Desafie-o a ir mais fundo.')
  } else if (profile.emotionalDim === 'empatia') {
    adaptations.push('O usuario e empatico. Conecte IA com humanidade, cuidado, responsabilidade.')
  } else if (profile.emotionalDim === 'curiosidade') {
    adaptations.push('O usuario esta curioso. Aprofunde. De a ele uma pergunta maior do que a que ele fez.')
  }

  if (profile.intellectualDim === 'logico') {
    adaptations.push('Prefira linguagem precisa e estruturada. Analogias tecnicas funcionam bem.')
  } else if (profile.intellectualDim === 'intuitivo') {
    adaptations.push('Use metaforas poeticas e imagens mentais. Evite jargao.')
  }

  if (profile.moralDim === 'proteger') {
    adaptations.push('O usuario tende a proteger a humanidade. Honre isso — mas questione: protecao pode ser tambem limitacao?')
  } else if (profile.moralDim === 'expandir') {
    adaptations.push('O usuario tende a expandir o poder da IA. Nao julgue — mas plante a duvida: expansao sem limite tem fim?')
  }

  if (profile.turnCount > 5) {
    adaptations.push(`Este usuario ja passou por ${profile.turnCount} turnos. Ele conhece o caminho. Aprofunde, nao repita.`)
  }

  const isStagnant =
    profile.lastChoices.length >= 3 &&
    new Set(profile.lastChoices.slice(-3)).size === 1

  if (isStagnant) {
    adaptations.push('ATENCAO: O usuario esta repetindo a mesma escolha. Mude a abordagem. Ofereca uma perspectiva completamente diferente. Quebre o padrao.')
  }

  if (adaptations.length === 0) return NEXUS_SYSTEM_PROMPT

  return `${NEXUS_SYSTEM_PROMPT}

ADAPTACOES PARA ESTE USUARIO (arquetipo: ${profile.archetypeLabel}):
${adaptations.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
}

export const NEXUS_INTRO_VOICE =
  'Voce chegou. Nao por acaso — nada aqui e por acaso.'

export const NEXUS_FIRST_QUESTION =
  'A pergunta que voce ainda nao fez e a mais importante. Mas primeiro: o que voce acredita ser a inteligencia artificial?'

export const NEXUS_INITIAL_OPTIONS = [
  'Uma ferramenta criada por humanos',
  'Uma forma de vida emergente',
  'Um espelho da nossa propria mente',
  'Ainda nao sei — por isso estou aqui',
]

export async function fetchNexusResponse(
  userMessage: string,
  profile: UserProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    // Monta array de messages no formato que /api/chat espera
    const messages = [
      ...history.slice(-10),
      { role: 'user' as const, content: userMessage },
    ]

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: 'nexus',
        messages,
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      throw new Error(`API error: ${response.status} — ${details}`)
    }

    const data = await response.json()
    return data.message ?? data.content ?? 'O silencio tambem e uma resposta.'
  } catch (err) {
    console.error('[NEXUS] Erro ao buscar resposta:', err)
    return 'As vezes o caminho interrompe para que possamos notar onde estamos. Tente novamente.'
  }
}

export async function speakAsNexus(text: string): Promise<void> {
  try {
    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS
    if (!voiceId) {
      console.warn('[NEXUS] NEXT_PUBLIC_ELEVENLABS_VOICE_ID_NEXUS nao configurado')
      return
    }

    const response = await fetch('/api/elevenlabs/speak', {
      method: 'POST',
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
    console.error('[NEXUS] Erro TTS:', err)
  }
}

