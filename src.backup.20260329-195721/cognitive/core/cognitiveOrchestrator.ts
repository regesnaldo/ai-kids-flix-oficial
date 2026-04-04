// src/cognitive/core/cognitiveOrchestrator.ts

import {
  EmotionalState,
  EmotionInput,
  EmotionalConfig,
  getNextEmotionalState,
  createInitialEmotionalState,
  calculateEmotionAttentionInfluence,
  EmotionType,
} from './emotionalEngine';

import {
  AttentionState,
  SensoryInput,
  AttentionConfig,
  getNextAttentionState,
  createInitialAttentionState,
  calculateAttentionEmotionInfluence,
} from './attentionEngine';

// ==========================================
// TIPOS DO ORQUESTRADOR
// ==========================================

export interface CognitiveState {
  emotional: EmotionalState;
  attention: AttentionState;
  emotionalArousal: number;      // 0-1, derivado de emotional.intensity
  attentionalValence: number;    // -1 a +1, derivado de attention.currentFocus.type
  cognitiveLoad: number;         // 0-1, média ponderada
  lastUnifiedUpdate: number;     // Timestamp
}

export interface CognitiveConfig {
  emotional: Partial<EmotionalConfig>;
  attention: Partial<AttentionConfig>;
  crossInfluence: {
    attentionToEmotion: number;  // 0-1, default 0.6
    emotionToAttention: number;  // 0-1, default 0.4
  };
}

export const DEFAULT_COGNITIVE_CONFIG: CognitiveConfig = {
  emotional: {},
  attention: {},
  crossInfluence: {
    attentionToEmotion: 0.6,
    emotionToAttention: 0.4,
  },
};

// ==========================================
// FUNÇÃO PRINCIPAL DO ORQUESTRADOR
// ==========================================

export function getNextCognitiveState(
  previous: CognitiveState,
  sensoryInputs: SensoryInput[],
  emotionInput: EmotionInput | null,
  deltaTime: number,
  config: Partial<CognitiveConfig> = {}
): CognitiveState {
  const mergedConfig: CognitiveConfig = {
    emotional: config.emotional || {},
    attention: config.attention || {},
    crossInfluence: {
      attentionToEmotion: config.crossInfluence?.attentionToEmotion ?? 0.6,
      emotionToAttention: config.crossInfluence?.emotionToAttention ?? 0.4,
    },
  };

  // ==========================================
  // PASSO 1: Atualizar Atenção (porta de entrada sensorial)
  // ==========================================
  const nextAttention = getNextAttentionState(
    previous.attention,
    sensoryInputs,
    deltaTime,
    mergedConfig.attention
  );

  // ==========================================
  // PASSO 2: Extrair hint emocional da atenção
  // ==========================================
  const attentionHint = calculateAttentionEmotionInfluence(nextAttention);
  // Retorna: { emotionHint: EmotionType, intensityModifier: number }

  // ==========================================
  // PASSO 3: Converter hint em EmotionInput (se aplicável)
  // ==========================================
  const emotionFromAttention: EmotionInput | null = attentionHint
    ? {
        type: attentionHint.emotionHint,
        intensity: nextAttention.globalArousal * attentionHint.intensityModifier,
        source: 'attention_system',
        priority: mergedConfig.crossInfluence.attentionToEmotion,
      }
    : null;

  // ==========================================
  // PASSO 4: Combinar inputs emocionais (externo + atenção)
  // ==========================================
  let combinedEmotionInput: EmotionInput | null = null;

  if (emotionInput && emotionFromAttention) {
    // Blend dos dois inputs (externo tem prioridade)
    combinedEmotionInput = {
      type: emotionInput.type,
      intensity: Math.max(emotionInput.intensity, emotionFromAttention.intensity),
      priority: Math.max(
        emotionInput.priority ?? 0,
        emotionFromAttention.priority ?? 0
      ),
      source: emotionInput.source || 'combined',
    };
  } else if (emotionInput) {
    combinedEmotionInput = emotionInput;
  } else if (emotionFromAttention) {
    combinedEmotionInput = emotionFromAttention;
  }

  // ==========================================
  // PASSO 5: Atualizar Emoção
  // ==========================================
  const nextEmotional = getNextEmotionalState(
    previous.emotional,
    combinedEmotionInput,
    deltaTime,
    mergedConfig.emotional
  );

  // ==========================================
  // PASSO 6: Extrair hint de atenção da emoção
  // ==========================================
  const emotionHint = calculateEmotionAttentionInfluence(nextEmotional);
  // Retorna: { attentionHint: string, arousalModifier: number }

  // ==========================================
  // PASSO 7: Modificar atenção com influência emocional
  // ==========================================
  const modifiedAttention: AttentionState = {
    ...nextAttention,
    globalArousal: Math.min(
      1,
      Math.max(0, nextAttention.globalArousal * emotionHint.arousalModifier)
    ),
  };

  // ==========================================
  // PASSO 8: Calcular métricas derivadas
  // ==========================================
  const emotionalArousal = nextEmotional.intensity;
  const attentionalValence = calculateValence(modifiedAttention);
  const cognitiveLoad =
    (emotionalArousal * 0.5 + modifiedAttention.globalArousal * 0.5);

  // ==========================================
  // RETORNAR NOVO ESTADO (IMUTÁVEL)
  // ==========================================
  return {
    emotional: nextEmotional,
    attention: modifiedAttention,
    emotionalArousal,
    attentionalValence,
    cognitiveLoad,
    lastUnifiedUpdate: Date.now(),
  };
}

// ==========================================
// HELPERS INTERNOS
// ==========================================

function calculateValence(attention: AttentionState): number {
  // Mapear tipos de foco para valência (-1 a +1)
  const weights: Record<string, number> = {
    threat: -0.8,
    danger: -0.9,
    disgust: -0.6,
    fear: -0.7,
    anger: -0.5,
    opportunity: 0.8,
    joy: 0.7,
    social: 0.5,
    curiosity: 0.6,
    internal: 0,
    none: 0,
    visual: 0.1,
    auditory: 0.1,
  };

  const baseValence = weights[attention.currentFocus.type] || 0;
  
  // Modificar baseado em globalArousal (mais arousal = mais extremo)
  return baseValence * (0.5 + attention.globalArousal * 0.5);
}

// ==========================================
// ESTADO INICIAL
// ==========================================

export function createInitialCognitiveState(): CognitiveState {
  const now = Date.now();
  return {
    emotional: createInitialEmotionalState(),
    attention: createInitialAttentionState(),
    emotionalArousal: 0,
    attentionalValence: 0,
    cognitiveLoad: 0,
    lastUnifiedUpdate: now,
  };
}

// ==========================================
// MAPEAMENTO DE EMOÇÕES (para uso futuro)
// ==========================================

export function mapAttentionHintToEmotion(hint: string): EmotionType {
  const mapping: Record<string, EmotionType> = {
    threat: 'fear',
    danger: 'fear',
    opportunity: 'joy',
    novelty: 'curiosity',
    social: 'joy',
    internal: 'neutral',
    none: 'neutral',
    visual: 'curiosity',
    auditory: 'curiosity',
  };
  return mapping[hint] || 'neutral';
}

export function mapEmotionToAttentionHint(emotion: EmotionType): string {
  const mapping: Record<EmotionType, string> = {
    neutral: 'internal',
    joy: 'opportunity',
    sadness: 'internal',
    anger: 'threat',
    fear: 'threat',
    surprise: 'novelty',
    disgust: 'threat',
    curiosity: 'novelty',
  };
  return mapping[emotion] || 'none';
}