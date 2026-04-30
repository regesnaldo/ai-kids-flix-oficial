export type CognitiveEmotion = "curiosity" | "fear" | "rebellion" | "empathy" | "neutral";

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  glow: string;
}

export const EMOTION_PALETTES: Record<CognitiveEmotion, Palette> = {
  curiosity: {
    primary: "#f59e0b",
    secondary: "#f97316",
    accent: "#fbbf24",
    surface: "#1a1207",
    glow: "rgba(245, 158, 11, 0.45)",
  },
  fear: {
    primary: "#2563eb",
    secondary: "#7c3aed",
    accent: "#60a5fa",
    surface: "#0f1024",
    glow: "rgba(99, 102, 241, 0.45)",
  },
  rebellion: {
    primary: "#dc2626",
    secondary: "#f43f5e",
    accent: "#ef4444",
    surface: "#1b0b12",
    glow: "rgba(239, 68, 68, 0.45)",
  },
  empathy: {
    primary: "#22c55e",
    secondary: "#14b8a6",
    accent: "#4ade80",
    surface: "#091711",
    glow: "rgba(34, 197, 94, 0.45)",
  },
  neutral: {
    primary: "#3b82f6",
    secondary: "#06b6d4",
    accent: "#60a5fa",
    surface: "#0a0a1a",
    glow: "rgba(59, 130, 246, 0.4)",
  },
};

const detectors: Array<{ emotion: CognitiveEmotion; patterns: RegExp[] }> = [
  { emotion: "curiosity", patterns: [/por que/i, /como/i, /explorar/i, /descobrir/i, /curios/i] },
  { emotion: "fear", patterns: [/medo/i, /ansio/i, /insegur/i, /trav/i, /n[aã]o consigo/i] },
  { emotion: "rebellion", patterns: [/quebrar/i, /contra/i, /rebel/i, /hack/i, /ruptura/i] },
  { emotion: "empathy", patterns: [/ajudar/i, /cuidar/i, /empatia/i, /humano/i, /colabor/i] },
];

export function detectEmotionFromInput(input: string): CognitiveEmotion {
  if (!input.trim()) return "neutral";
  for (const detector of detectors) {
    if (detector.patterns.some((pattern) => pattern.test(input))) return detector.emotion;
  }
  return "neutral";
}

export function applyCognitivePalette(emotion: CognitiveEmotion): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const palette = EMOTION_PALETTES[emotion];
  root.style.setProperty("--cognitive-primary", palette.primary);
  root.style.setProperty("--cognitive-secondary", palette.secondary);
  root.style.setProperty("--cognitive-accent", palette.accent);
  root.style.setProperty("--cognitive-surface", palette.surface);
  root.style.setProperty("--cognitive-glow", palette.glow);
}
