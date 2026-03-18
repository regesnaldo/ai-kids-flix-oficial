 // src/cognitive/core/attentionEngine.ts

import type { EmotionType } from './emotionalEngine';

export type AttentionFocusType = 'visual' | 'auditory' | 'internal' | 'social' | 'threat' | 'opportunity' | 'novelty' | 'none';

export interface AttentionFocus {
  type: AttentionFocusType;
  target: string;
  priority: number;
  stability: number;
  sourceData?: unknown;
}

export interface SensoryInput {
  type: AttentionFocusType;
  intensity: number;
  id: string;
  source?: string;
}

export interface AttentionMemoryEntry {
  focus: AttentionFocus;
  enteredAt: number;
  duration: number;
  exitIntensity: number;
}

export interface AttentionState {
  currentFocus: AttentionFocus;
  previousFocus: AttentionFocus | null;
  attentionMemory: AttentionMemoryEntry[];
  globalArousal: number;
  lastShiftTime: number;
}

export interface AttentionConfig {
  noveltyBonus: number;
  continuityBonus: number;
  decayRate: number;
  memoryTtl: number;
  maxMemoryEntries: number;
  arousalDecayThreshold: number;
}

export const DEFAULT_ATTENTION_CONFIG: AttentionConfig = {
  noveltyBonus: 0.3,
  continuityBonus: 0.2,
  decayRate: 0.2,
  memoryTtl: 30000,
  maxMemoryEntries: 10,
  arousalDecayThreshold: 0.7,
};

export function createInitialAttentionState(): AttentionState {
  return {
    currentFocus: { type: 'none', target: '', priority: 0, stability: 1 },
    previousFocus: null,
    attentionMemory: [],
    globalArousal: 0.5,
    lastShiftTime: Date.now(),
  };
}

export function getNextAttentionState(
  previousState: AttentionState,
  sensoryInputs: SensoryInput[],
  deltaTime: number,
  config: Partial<AttentionConfig> = {}
): AttentionState {
  const cfg = { ...DEFAULT_ATTENTION_CONFIG, ...config };
  const now = Date.now();

  const candidates = sensoryInputs.map(inp => {
    const novelty = !previousState.attentionMemory.some(m => m.focus.target === inp.id) ? cfg.noveltyBonus : 0;
    const continuity = inp.type === previousState.currentFocus.type ? cfg.continuityBonus : 0;
    return { input: inp, priority: Math.min(1, inp.intensity + novelty + continuity) };
  });

  let best: { input: SensoryInput; priority: number } | null = null;
  let bestP = 0;
  for (const c of candidates) { if (c.priority > bestP) { bestP = c.priority; best = c; } }

  let newFocus: AttentionFocus;
  let changed = false;

  if (best && best.priority > 0.3) {
    newFocus = {
      type: best.input.type,
      target: best.input.id,
      priority: best.priority,
      stability: previousState.currentFocus.type === best.input.type
        ? Math.min(1, previousState.currentFocus.stability + deltaTime * 0.5)
        : 0,
      sourceData: best.input,
    };
    changed = previousState.currentFocus.type !== newFocus.type;
  } else {
    newFocus = {
      ...previousState.currentFocus,
      priority: Math.max(0, previousState.currentFocus.priority - deltaTime * cfg.decayRate),
    };
    if (newFocus.priority < 0.1) {
      newFocus = { type: 'none', target: '', priority: 0, stability: 1 };
      changed = previousState.currentFocus.type !== 'none';
    }
  }

  let memory = previousState.attentionMemory;
  if (changed && previousState.currentFocus.type !== 'none') {
    memory = [...memory, {
      focus: previousState.currentFocus,
      enteredAt: previousState.lastShiftTime,
      duration: now - previousState.lastShiftTime,
      exitIntensity: previousState.currentFocus.priority,
    }].filter(e => (now - e.enteredAt) < cfg.memoryTtl).slice(-cfg.maxMemoryEntries);
  }

  let arousal = previousState.globalArousal;
  if (best && best.priority > cfg.arousalDecayThreshold) {
    arousal = Math.min(1, arousal + deltaTime * 0.5);
  } else {
    arousal = Math.max(0, arousal - deltaTime * cfg.decayRate);
  }

  return {
    currentFocus: newFocus,
    previousFocus: changed ? previousState.currentFocus : previousState.previousFocus,
    attentionMemory: memory,
    globalArousal: arousal,
    lastShiftTime: changed ? now : previousState.lastShiftTime,
  };
}

export function calculateAttentionEmotionInfluence(attentionState: AttentionState): { emotionHint: EmotionType; intensityModifier: number } {
  const map: Record<AttentionFocusType, EmotionType> = {
    threat: 'fear',
    opportunity: 'joy',
    novelty: 'curiosity',
    social: 'joy',
    internal: 'neutral',
    none: 'neutral',
    visual: 'curiosity',
    auditory: 'curiosity',
  };
  return { emotionHint: map[attentionState.currentFocus.type] || 'neutral', intensityModifier: 0.3 + attentionState.globalArousal * 0.7 };
}