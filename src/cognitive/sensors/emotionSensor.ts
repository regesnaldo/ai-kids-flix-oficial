import { LabState, updateLabState } from '../core/labState'

const emotionalKeywords = {
  high: ['medo', 'ansiedade', 'panico', 'desesperado', 'perdido', 'sozinho'],
  positive: ['feliz', 'animado', 'motivado', 'confiante'],
  low: ['cansado', 'triste', 'desanimado', 'vazio']
}

function detectEmotionScore(text: string): number {
  let score = 0
  const lower = text.toLowerCase()

  emotionalKeywords.high.forEach(word => {
    if (lower.includes(word)) score += 25
  })

  emotionalKeywords.positive.forEach(word => {
    if (lower.includes(word)) score += 10
  })

  emotionalKeywords.low.forEach(word => {
    if (lower.includes(word)) score += 15
  })

  return Math.min(score, 100)
}

export function applyEmotionSensor(
  state: LabState,
  userText: string
): LabState {
  const emotionalValue = detectEmotionScore(userText)

  return updateLabState(state, {
    emotional: emotionalValue
  })
}
