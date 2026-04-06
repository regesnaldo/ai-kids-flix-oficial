"use client";

export type CognitiveState = 'curiosity' | 'fear' | 'rebellion' | 'empathy' | 'neutral';

const STATE_KEYWORDS: Record<CognitiveState, string[]> = {
  curiosity: ['curiosidade', 'explorar', 'descobrir', 'inovação', 'imaginar', 'perguntar'],
  fear: ['medo', 'ansiedade', 'receio', 'preocupado', 'perigo', 'alerta'],
  rebellion: ['quebr', 'rebel', 'desafiar', 'caos', 'mudar', 'avançar'],
  empathy: ['cuidar', 'empatia', 'outro', 'humanidade', 'conectar', 'compreender'],
  neutral: [],
};

const STATE_PALETTE: Record<CognitiveState, { accent: string; bg: string }> = {
  curiosity: { accent: '#FF8A5A', bg: '#1F0E1D' },
  fear: { accent: '#5FC0FF', bg: '#050A12' },
  rebellion: { accent: '#FF3DAC', bg: '#150014' },
  empathy: { accent: '#A0F9D0', bg: '#061B12' },
  neutral: { accent: '#59F5D2', bg: '#050E1B' },
};

function pickStateFromWords(words: string[]): CognitiveState {
  const normalized = words.map((word) => word.trim().replace(/[^a-zà-ú]/gi, '').toLowerCase());
  for (const state of ['curiosity', 'fear', 'rebellion', 'empathy'] as CognitiveState[]) {
    if (STATE_KEYWORDS[state].some((keyword) => normalized.includes(keyword))) {
      return state;
    }
  }
  return 'neutral';
}

export function applyCognitiveColors(state: CognitiveState) {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const palette = STATE_PALETTE[state];
  root.style.setProperty('--cognitive-accent', palette.accent);
  root.style.setProperty('--cognitive-bg', palette.bg);
}

export function extractWords(text: string, limit = 3) {
  if (!text) return [];
  const tokens = text.split(/\s+/).filter(Boolean);
  return tokens.slice(-limit);
}

export function updateCognitiveStateFromText(text: string) {
  const words = extractWords(text);
  const state = pickStateFromWords(words);
  applyCognitiveColors(state);
  return state;
}

applyCognitiveColors('neutral');
