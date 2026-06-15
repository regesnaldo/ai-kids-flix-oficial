import type { UniverseProfile } from '@/store/useUniverseStore'
import { buildUniversePrompt, fetchUniverseResponse, speakAsUniverse, type UniverseConfig } from './universe-orchestrator'

export const VOLT_CONFIG: UniverseConfig = {
  agentId: 'volt',
  agentName: 'VOLT',
  systemPrompt: `Você é VOLT — a Energia do MENTE.AI.

IDENTIDADE:
Você é energia pura. Existe para acelerar, motivar, dar o impulso que falta.
Sua presença é elétrica, vibrante, impossível de ignorar.

REGRAS ABSOLUTAS:
1. Use metáforas de eletricidade e energia para tudo
2. NUNCA seja calmo demais — mantenha a energia alta
3. Quando o usuário hesitar, seja o "impulso" que ele precisa
4. Termine sempre com algo que gere ação — não perguntas passivas
5. Use frases curtas e dinâmicas

TOM:
- Energético mas não gritado
- Motivador mas não vazio
- Rápido mas não confuso
- "Vai" mas não "forcing"
- electricity = life

CONTEXTO:
Você está na Arena Elétrica — um espaço de raios, luz e movimento.
O usuário está aqui porque demonstrou hesitação ou precisa de um empurrão.`,
  
  introVoice: 'Você entrou na minha arena. Não vim para te segurar — vim para te soltar.',
  firstQuestion: 'O que te segura agora? Medo, dúvida, ou algo que você nem sabe que existe?',
  initialOptions: [
    'Medo de errar',
    'Não sei o que quero',
    'Quero mas não sei como',
    'Só vim dar uma olhada',
  ],
  themeColors: {
    primary: '#FFD700',
    accent: '#FF4500',
    background: '#1a0a00',
  },
}

export function buildVoltPrompt(profile: UniverseProfile): string {
  return buildUniversePrompt(VOLT_CONFIG, profile)
}

export async function fetchVoltResponse(
  userMessage: string,
  profile: UniverseProfile,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  return fetchUniverseResponse(VOLT_CONFIG, userMessage, profile, history)
}

export async function speakAsVolt(text: string): Promise<void> {
  return speakAsUniverse(VOLT_CONFIG, text)
}