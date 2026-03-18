 // src/cognitive/core/emotionalEngine.ts

export type EmotionType = 'neutral' | 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'curiosity';

export interface RGB { r: number; g: number; b: number; }

export interface EmotionalMemoryEntry {
  emotion: EmotionType;
  intensity: number;
  timestamp: number;
  ttl: number;
  source?: string;
}

export interface EmotionalState {
  dominantEmotion: EmotionType;
  intensity: number;
  targetColor: RGB;
  emotionalMemory: EmotionalMemoryEntry[];
  lastUpdate: number;
  stability: number;
}

export interface EmotionInput {
  type: EmotionType;
  intensity: number;
  priority?: number;
  source?: string;
}

export interface EmotionalConfig {
  decayRate: number;
  memoryTtlBase: number;
  memoryTtlIntensityFactor: number;
  maxMemoryEntries: number;
  neutralThreshold: number;
  emotionColors: Record<EmotionType, RGB>;
  blendInfluence: number;
}

export const DEFAULT_EMOTION_COLORS: Record<EmotionType, RGB> = {
  neutral: { r: 128, g: 128, b: 128 },
  joy: { r: 255, g: 200, b: 50 },
  sadness: { r: 70, g: 130, b: 180 },
  anger: { r: 220, g: 30, b: 30 },
  fear: { r: 128, g: 0, b: 128 },
  surprise: { r: 255, g: 140, b: 0 },
  disgust: { r: 100, g: 120, b: 50 },
  curiosity: { r: 50, g: 200, b: 200 },
};

export const DEFAULT_EMOTIONAL_CONFIG: EmotionalConfig = {
  decayRate: 0.4,
  memoryTtlBase: 3000,
  memoryTtlIntensityFactor: 7000,
  maxMemoryEntries: 10,
  neutralThreshold: 0.02,
  emotionColors: DEFAULT_EMOTION_COLORS,
  blendInfluence: 0.2,
};

export function createInitialEmotionalState(): EmotionalState {
  return {
    dominantEmotion: 'neutral',
    intensity: 0,
    targetColor: DEFAULT_EMOTION_COLORS.neutral,
    emotionalMemory: [],
    lastUpdate: Date.now(),
    stability: 1,
  };
}

export function getNextEmotionalState(
  previousState: EmotionalState,
  input: EmotionInput | null,
  deltaTime: number,
  config: Partial<EmotionalConfig> = {}
): EmotionalState {
  const cfg = { ...DEFAULT_EMOTIONAL_CONFIG, ...config };
  const now = Date.now();

  let updatedMemory = previousState.emotionalMemory
    .map(e => ({ ...e, ttl: e.ttl - (deltaTime * 1000) }))
    .filter(e => e.ttl > 0)
    .slice(-cfg.maxMemoryEntries);

  if (input) {
    updatedMemory = [...updatedMemory, {
      emotion: input.type,
      intensity: input.intensity,
      timestamp: now,
      ttl: cfg.memoryTtlBase + (input.intensity * cfg.memoryTtlIntensityFactor),
      source: input.source,
    }].slice(-cfg.maxMemoryEntries);
  }

  const weights = new Map<EmotionType, number>();
  updatedMemory.forEach(e => {
    weights.set(e.emotion, (weights.get(e.emotion) || 0) + (e.intensity * e.ttl / 10000));
  });
  if (input) {
    weights.set(input.type, (weights.get(input.type) || 0) + (input.intensity * 1.5));
  }

  let dominant: EmotionType = 'neutral';
  let maxWeight = 0;
  weights.forEach((w, e) => { if (w > maxWeight) { maxWeight = w; dominant = e; } });

  let intensity = Math.min(maxWeight / 3, 1.0);
  if (!input && updatedMemory.length === 0) {
    intensity = previousState.intensity * Math.pow(1 - cfg.decayRate, deltaTime);
    if (intensity < cfg.neutralThreshold) {
      return { dominantEmotion: 'neutral', intensity: 0, targetColor: cfg.emotionColors.neutral, emotionalMemory: [], lastUpdate: now, stability: 0 };
    }
  }

  // Histerese simplificada (sem erro de tipo)
  const prevWeight = weights.get(previousState.dominantEmotion) || 0;
  if (maxWeight - prevWeight < 0.15) {
    dominant = previousState.dominantEmotion;
  }

  const base = cfg.emotionColors[dominant];
  const neu = cfg.emotionColors.neutral;
  const t = Math.max(0.1, intensity);
  const targetColor = {
    r: Math.round(base.r * t + neu.r * (1 - t)),
    g: Math.round(base.g * t + neu.g * (1 - t)),
    b: Math.round(base.b * t + neu.b * (1 - t)),
  };

  return {
    dominantEmotion: dominant,
    intensity: Math.max(0, Math.min(1, intensity)),
    targetColor,
    emotionalMemory: updatedMemory,
    lastUpdate: now,
    stability: dominant === previousState.dominantEmotion ? Math.min(1, previousState.stability + deltaTime * 0.5) : 0,
  };
}

export function calculateEmotionAttentionInfluence(emotionalState: EmotionalState): { attentionHint: string; arousalModifier: number } {
  const map: Record<EmotionType, string> = { neutral: 'internal', joy: 'opportunity', sadness: 'internal', anger: 'threat', fear: 'threat', surprise: 'novelty', disgust: 'threat', curiosity: 'novelty' };
  return { attentionHint: map[emotionalState.dominantEmotion] || 'none', arousalModifier: 0.3 + emotionalState.intensity * 0.7 };
}

export function rgbToCss(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
} 