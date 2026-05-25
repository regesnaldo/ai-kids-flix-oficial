/**
 * ─── DESIGN SYSTEM — Motion Token System ──────────────────────────────────────
 *
 * Every duration, easing, delay, and stagger maps to a COGNITIVE STATE.
 * No decoration. Every motion answers:
 *   What cognitive state does this represent?
 *   What information does it convey?
 *   What progression does it signal?
 *
 * Usage:
 *   import { motion } from "@/design-system/motion";
 *   animationDuration: motion.duration.synthesis // → "1200ms"
 *
 * The existing `tokens.animation` (instant/fast/normal/slow) remains for
 * generic CSS transitions. This file provides the cognitive layer above it.
 */

// ─── DURATIONS: Mapped to cognitive purpose ───────────────────────────────────

const duration = {
  /** State corrections, error flags — instant visual feedback (0ms) */
  instant: "0ms",
  /** Information retrieval, scanning operations — 800ms */
  scan: "800ms",
  /** Complex cognitive processing completion — 1200ms */
  synthesis: "1200ms",
  /** Section transitions, mission jumps — 600ms */
  leap: "600ms",
  /** Beacon signaling, discovery moments — 2000ms */
  pulse: "2000ms",
  /** Memory callbacks, contextual reminders — 400ms */
  echo: "400ms",
} as const;

// ─── EASINGS: Mapped to cognitive behavior ────────────────────────────────────

const easing = {
  /** Corrective — no acceleration, instant correction */
  instant: "step-end",
  /** Analytical — constant speed during information scan */
  scan: "linear",
  /** Synthetic — slow start, rapid middle, soft land (processing) */
  synthesis: "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
  /** Transit — fast acceleration, gentle deceleration (cross-section) */
  leap: "cubic-bezier(0.58, 0, 0.08, 1)",
  /** Signal — rhythmic oscillation for beacon pulses */
  pulse: "ease-in-out",
  /** Recall — quick in, slow fade (memory retrieval) */
  echo: "cubic-bezier(0.25, 0.1, 0.1, 0.85)",
} as const;

// ─── DELAYS: Staggered emergence of hierarchical information ──────────────────

const delay = {
  /** No delay — immediate system response */
  none: "0ms",
  /** Micro-stagger — child of primary signal (50ms after parent) */
  micro: "50ms",
  /** Sub-signal — secondary information (120ms after trigger) */
  sub: "120ms",
  /** Echo return — memory recall delay (200ms after revisit) */
  recall: "200ms",
  /** Cascade entry — progressive HUD element mounting (per-element offset) */
  cascade: "80ms",
} as const;

// ─── STAGGER: Multi-element coordinated entry timing ──────────────────────────

const stagger = {
  /** HUD element cascade: each element enters 80ms after the previous */
  hudEntry: 80,
  /** Signal bars fill: each bar animates 60ms apart */
  signalBars: 60,
  /** Beacon list: beacons appear 150ms apart */
  beaconList: 150,
  /** Grid perspective shift: gradual over 2000ms */
  gridPerspective: 2000,
} as const;

// ─── PERFORMANCE CONSTRAINTS ──────────────────────────────────────────────────

const constraints = {
  /** Maximum simultaneous motion components (capped to prevent visual noise) */
  maxSimultaneous: 2,
  /** Frames to wait before activating a queued motion (debounce window) */
  debounceMs: 250,
  /** Minimum interval between two motions of the same type on the same target */
  cooldownPerType: 1500,
} as const;

// ─── REDUCED-MOTION OVERRIDES ─────────────────────────────────────────────────

/**
 * When prefers-reduced-motion is active, all durations collapse to instant.
 * Easings become step-end. The user still sees the state change
 * (no hidden content) but zero animation cost.
 */
const reducedDuration: Record<keyof typeof duration, string> = {
  instant: "0ms",
  scan: "0ms",
  synthesis: "0ms",
  leap: "0ms",
  pulse: "0ms",
  echo: "0ms",
};

const reducedEasing: Record<keyof typeof easing, string> = {
  instant: "step-end",
  scan: "step-end",
  synthesis: "step-end",
  leap: "step-end",
  pulse: "step-end",
  echo: "step-end",
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const motion = {
  duration,
  easing,
  delay,
  stagger,
  constraints,
  reduced: {
    duration: reducedDuration,
    easing: reducedEasing,
  },
} as const;

export type MotionDuration = keyof typeof duration;
export type MotionEasing = keyof typeof easing;
export type MotionDelay = keyof typeof delay;

/**
 * Resolve a duration value, respecting reduced-motion preference.
 * Returns the CSS duration string.
 */
export function resolveDuration(
  key: MotionDuration,
  reduced: boolean = false
): string {
  return reduced ? motion.reduced.duration[key] : motion.duration[key];
}

/**
 * Resolve an easing value, respecting reduced-motion preference.
 */
export function resolveEasing(
  key: MotionEasing,
  reduced: boolean = false
): string {
  return reduced ? motion.reduced.easing[key] : motion.easing[key];
}

/**
 * Detect reduced-motion preference (client-side only).
 * Use this inside useEffect or event handlers — NOT during SSR.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
