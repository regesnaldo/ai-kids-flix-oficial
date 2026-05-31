/**
 * ─── COLOR ENGINE — 5 Emotional States → CSS Transitions ─────────────────
 *
 * Bridge between the cognitive emotional core and the visual UI layer.
 *
 * Flow:
 *   emotionalEngine.ts (RGB targetColor) → colorEngine.ts (CSS palette)
 *   → CSS custom properties on root element → smooth transitions via CSS
 *
 * 5 Emotional States:
 *   CURIOUS     → sky/cyan tones    (#00D9FF)
 *   ENTHUSIASTIC → emerald/green     (#10B981)
 *   THOUGHTFUL   → amber/warm        (#F59E0B)
 *   FRUSTRATED   → orange/fire       (#EA580C)
 *   CALM         → slate/cool        (#64748B)
 *   NEUTRAL      → default dark      (#0a0a1a)
 */

import { rgbToCss, type EmotionalState, type RGB } from "@/cognitive/core/emotionalEngine";

// ─── 5 Primary Emotions (UI-facing) ─────────────────────────────────────

export type UiEmotion = "curious" | "enthusiastic" | "thoughtful" | "frustrated" | "calm" | "neutral";

export interface EmotionPalette {
  /** Background color */
  bg: string;
  /** Primary text color */
  text: string;
  /** Accent / highlight color */
  accent: string;
  /** Glow / shadow color */
  glow: string;
  /** Border / subtle color */
  border: string;
  /** CSS transition duration in ms */
  transitionMs: number;
}

// ─── Palettes ────────────────────────────────────────────────────────────

const PALETTES: Record<UiEmotion, Omit<EmotionPalette, "transitionMs">> = {
  curious: {
    bg: "#001422",
    text: "#E0FAFF",
    accent: "#00D9FF",
    glow: "rgba(0, 217, 255, 0.25)",
    border: "rgba(0, 217, 255, 0.15)",
  },
  enthusiastic: {
    bg: "#001A10",
    text: "#ECFDF5",
    accent: "#10B981",
    glow: "rgba(16, 185, 129, 0.25)",
    border: "rgba(16, 185, 129, 0.15)",
  },
  thoughtful: {
    bg: "#1A1000",
    text: "#FFFBEB",
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.25)",
    border: "rgba(245, 158, 11, 0.15)",
  },
  frustrated: {
    bg: "#1A0800",
    text: "#FFF7ED",
    accent: "#EA580C",
    glow: "rgba(234, 88, 12, 0.25)",
    border: "rgba(234, 88, 12, 0.15)",
  },
  calm: {
    bg: "#0A1018",
    text: "#F1F5F9",
    accent: "#64748B",
    glow: "rgba(100, 116, 139, 0.20)",
    border: "rgba(100, 116, 139, 0.12)",
  },
  neutral: {
    bg: "#0a0a1a",
    text: "#CCCCCC",
    accent: "#00FFFF",
    glow: "rgba(0, 255, 255, 0.15)",
    border: "rgba(0, 255, 255, 0.08)",
  },
};

// ─── Emotional Engine → UI Emotion Mapping ───────────────────────────────

const EMOTION_TO_UI: Record<string, UiEmotion> = {
  curiosity: "curious",
  joy: "enthusiastic",
  surprise: "thoughtful",
  fear: "thoughtful",
  sadness: "calm",
  anger: "frustrated",
  disgust: "frustrated",
  neutral: "neutral",
};

/**
 * Derive UI emotion from the cognitive emotional state.
 * Maps the engine's 8-type emotion to one of the 5 UI emotions.
 */
export function getUiEmotion(state: EmotionalState): UiEmotion {
  return EMOTION_TO_UI[state.dominantEmotion] ?? "neutral";
}

/**
 * Get the full CSS palette for a given UI emotion.
 */
export function getEmotionPalette(emotion: UiEmotion, transitionMs: number = 1200): EmotionPalette {
  return { ...PALETTES[emotion], transitionMs };
}

/**
 * Get palette derived from the cognitive emotional state.
 */
export function getPaletteFromEmotionalState(state: EmotionalState, transitionMs: number = 1200): EmotionPalette {
  const uiEmotion = getUiEmotion(state);
  return getEmotionPalette(uiEmotion, transitionMs);
}

// ─── CSS Custom Properties ───────────────────────────────────────────────

/**
 * Generates a style object to apply as CSS custom properties on :root.
 * Includes smooth transitions between emotional states.
 *
 * Usage:
 *   const colors = getEmotionPalette("curious")
 *   applyEmotionPalette(document.documentElement, colors)
 */
export function applyEmotionPalette(el: HTMLElement, palette: EmotionPalette): void {
  el.style.setProperty("--emotion-bg", palette.bg);
  el.style.setProperty("--emotion-text", palette.text);
  el.style.setProperty("--emotion-accent", palette.accent);
  el.style.setProperty("--emotion-glow", palette.glow);
  el.style.setProperty("--emotion-border", palette.border);
  el.style.setProperty("--emotion-transition", `${palette.transitionMs}ms ease`);
}

/**
 * Returns a React style object with CSS custom properties
 * for use in inline styles or CSS-in-JS.
 */
export function emotionPaletteToStyle(palette: EmotionPalette): Record<string, string> {
  return {
    "--emotion-bg": palette.bg,
    "--emotion-text": palette.text,
    "--emotion-accent": palette.accent,
    "--emotion-glow": palette.glow,
    "--emotion-border": palette.border,
    "--emotion-transition": `${palette.transitionMs}ms ease`,
  } as Record<string, string>;
}

// ─── CSS Transition Classes ──────────────────────────────────────────────

/**
 * Global CSS to inject into the document for smooth transitions.
 * Uses CSS custom properties set by applyEmotionPalette().
 *
 * Add this to your global stylesheet or inject via <style> tag.
 */
export const EMOTION_TRANSITION_CSS = `
  :root {
    --emotion-bg: #0a0a1a;
    --emotion-text: #CCCCCC;
    --emotion-accent: #00FFFF;
    --emotion-glow: rgba(0, 255, 255, 0.15);
    --emotion-border: rgba(0, 255, 255, 0.08);
    --emotion-transition: 1200ms ease;
  }

  .emotion-aware {
    background-color: var(--emotion-bg);
    color: var(--emotion-text);
    transition:
      background-color var(--emotion-transition),
      color var(--emotion-transition),
      border-color var(--emotion-transition),
      box-shadow var(--emotion-transition);
  }

  .emotion-glow {
    box-shadow: 0 0 30px var(--emotion-glow);
    transition: box-shadow var(--emotion-transition);
  }

  .emotion-border {
    border-color: var(--emotion-border);
    transition: border-color var(--emotion-transition);
  }

  .emotion-accent-text {
    color: var(--emotion-accent);
    transition: color var(--emotion-transition);
  }
`;

// ─── React Hook ──────────────────────────────────────────────────────────

/**
 * React hook to apply emotional palette to the DOM root.
 *
 * Usage:
 *   function HomePage() {
 *     const { state } = useCognitiveStore()
 *     useEmotionPalette(state.emotionalState)
 *     ...
 *   }
 */
export function createEmotionStyleElement(): HTMLStyleElement {
  if (typeof document === "undefined") {
    // SSR guard — return a noop object
    return { innerHTML: "" } as unknown as HTMLStyleElement;
  }

  const existing = document.getElementById("emotion-transitions");
  if (existing) return existing as HTMLStyleElement;

  const style = document.createElement("style");
  style.id = "emotion-transitions";
  style.innerHTML = EMOTION_TRANSITION_CSS;
  document.head.appendChild(style);
  return style;
}
