/**
 * ─── HUD COMPONENTS — State Contracts ─────────────────────────────────────────
 *
 * Zod schemas for every HUD component's props.
 * State transition guards (which transitions are valid/invalid).
 * Render rules: which state → which color token, typography level, Portuguese label.
 *
 * This file is the single source of truth for component behavior.
 * Components import their contracts and validate props at render time.
 */

import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════════
// SCANNER RING
// ═══════════════════════════════════════════════════════════════════════════════

export const ScannerRingState = z.enum([
  "idle",
  "scanning",
  "complete",
  "error",
]);

export type ScannerRingState = z.infer<typeof ScannerRingState>;

export const ScannerRingProps = z.object({
  state: ScannerRingState,
  size: z.number().min(16).max(256).default(64),
  label: z.string().optional(),
  className: z.string().optional(),
});

export type ScannerRingProps = z.infer<typeof ScannerRingProps>;

/** Valid transitions for ScannerRing */
export const SCANNER_RING_TRANSITIONS: Record<ScannerRingState, ScannerRingState[]> = {
  idle: ["scanning"],
  scanning: ["complete", "error", "idle"],
  complete: ["idle", "scanning"],
  error: ["idle", "scanning"],
};

/** Color token per state */
export const SCANNER_RING_COLORS: Record<ScannerRingState, string> = {
  idle: "rgba(0, 240, 255, 0.20)",
  scanning: "rgba(0, 240, 255, 0.80)",
  complete: "rgba(16, 185, 129, 0.80)",
  error: "rgba(239, 68, 68, 0.80)",
};

/** Portuguese label per state */
export const SCANNER_RING_LABELS: Record<ScannerRingState, string> = {
  idle: "EM ESPERA",
  scanning: "ANALISANDO",
  complete: "CONCLUÍDO",
  error: "FALHA",
};

// ═══════════════════════════════════════════════════════════════════════════════
// ACTION NODE
// ═══════════════════════════════════════════════════════════════════════════════

export const ActionNodeState = z.enum([
  "locked",
  "unlocked",
  "active",
  "completed",
]);

export type ActionNodeState = z.infer<typeof ActionNodeState>;

export const ActionNodeProps = z.object({
  state: ActionNodeState,
  label: z.string().min(1).max(40),
  onClick: z.function().optional(),
  className: z.string().optional(),
});

export type ActionNodeProps = z.infer<typeof ActionNodeProps>;

/** Valid transitions for ActionNode */
export const ACTION_NODE_TRANSITIONS: Record<ActionNodeState, ActionNodeState[]> = {
  locked: ["unlocked"],            // only unlock can free a locked node
  unlocked: ["active", "locked"],  // can relock
  active: ["completed", "unlocked"],
  completed: ["unlocked"],         // completed can be reset to unlocked
};

/** Color token per state */
export const ACTION_NODE_COLORS: Record<ActionNodeState, string> = {
  locked: "rgba(148, 163, 184, 0.30)",   // slate, muted
  unlocked: "rgba(0, 240, 255, 0.60)",   // cyan
  active: "rgba(0, 240, 255, 0.90)",     // cyan bright
  completed: "rgba(168, 85, 247, 0.80)", // purple
};

/** Portuguese label override for locked state */
export const ACTION_NODE_LOCKED_LABEL = "BLOQUEADO";

// ═══════════════════════════════════════════════════════════════════════════════
// CLASSIFICATION TAG
// ═══════════════════════════════════════════════════════════════════════════════

export const ClassificationTagState = z.enum([
  "default",
  "highlighted",
  "archived",
]);

export type ClassificationTagState = z.infer<typeof ClassificationTagState>;

export const ClassificationTagProps = z.object({
  state: ClassificationTagState,
  clearance: z.enum(["surface", "deep", "core", "restricted"]),
  label: z.string().min(1).max(30),
  className: z.string().optional(),
});

export type ClassificationTagProps = z.infer<typeof ClassificationTagProps>;

/** Valid transitions for ClassificationTag */
export const CLASSIFICATION_TAG_TRANSITIONS: Record<
  ClassificationTagState,
  ClassificationTagState[]
> = {
  default: ["highlighted", "archived"],
  highlighted: ["default", "archived"],
  archived: ["default"],
};

/** Color token per clearance level */
export const CLASSIFICATION_TAG_CLEARANCE_COLORS: Record<
  ClassificationTagProps["clearance"],
  string
> = {
  surface: "rgba(148, 163, 184, 0.50)",
  deep: "rgba(0, 240, 255, 0.60)",
  core: "rgba(168, 85, 247, 0.60)",
  restricted: "rgba(239, 68, 68, 0.60)",
};

/** Portuguese clearance labels */
export const CLASSIFICATION_TAG_CLEARANCE_LABELS: Record<
  ClassificationTagProps["clearance"],
  string
> = {
  surface: "SUPERFÍCIE",
  deep: "PROFUNDO",
  core: "NÚCLEO",
  restricted: "RESTRITO",
};

// ═══════════════════════════════════════════════════════════════════════════════
// GRID OVERLAY
// ═══════════════════════════════════════════════════════════════════════════════

export const GridOverlayState = z.enum([
  "idle",
  "active",
  "scanning",
]);

export type GridOverlayState = z.infer<typeof GridOverlayState>;

export const GridOverlayProps = z.object({
  state: GridOverlayState,
  className: z.string().optional(),
  pointerEvents: z.boolean().default(false),
});

export type GridOverlayProps = z.infer<typeof GridOverlayProps>;

/** Valid transitions for GridOverlay */
export const GRID_OVERLAY_TRANSITIONS: Record<GridOverlayState, GridOverlayState[]> = {
  idle: ["active", "scanning"],
  active: ["idle", "scanning"],
  scanning: ["active", "idle"],
};

/** Opacity per state */
export const GRID_OVERLAY_OPACITY: Record<GridOverlayState, number> = {
  idle: 0.02,
  active: 0.04,
  scanning: 0.07,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL BARS
// ═══════════════════════════════════════════════════════════════════════════════

export const SignalBarsState = z.enum([
  "weak",
  "moderate",
  "strong",
  "urgent",
  "lost",
]);

export type SignalBarsState = z.infer<typeof SignalBarsState>;

export const SignalBarsProps = z.object({
  state: SignalBarsState,
  className: z.string().optional(),
});

export type SignalBarsProps = z.infer<typeof SignalBarsProps>;

/** Valid transitions (ordered, one-way preferred but reversals allowed) */
export const SIGNAL_BARS_TRANSITIONS: Record<SignalBarsState, SignalBarsState[]> = {
  weak: ["moderate", "lost"],
  moderate: ["weak", "strong", "lost"],
  strong: ["moderate", "urgent", "lost"],
  urgent: ["strong", "lost"],
  lost: ["weak"],
};

/** Color per state */
export const SIGNAL_BARS_COLORS: Record<SignalBarsState, string> = {
  weak: "rgba(0, 240, 255, 0.25)",
  moderate: "rgba(0, 240, 255, 0.50)",
  strong: "rgba(0, 240, 255, 0.80)",
  urgent: "rgba(168, 85, 247, 0.90)",
  lost: "rgba(239, 68, 68, 0.60)",
};

/** Number of bars filled per state */
export const SIGNAL_BARS_FILLED: Record<SignalBarsState, number> = {
  weak: 1,
  moderate: 2,
  strong: 3,
  urgent: 4,
  lost: 0,
};

/** Portuguese label per state */
export const SIGNAL_BARS_LABELS: Record<SignalBarsState, string> = {
  weak: "SINAL FRACO",
  moderate: "SINAL MODERADO",
  strong: "SINAL FORTE",
  urgent: "SINAL URGENTE",
  lost: "SINAL PERDIDO",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PULSE BEACON
// ═══════════════════════════════════════════════════════════════════════════════

export const PulseBeaconState = z.enum([
  "subtle",
  "moderate",
  "urgent",
  "hidden",
]);

export type PulseBeaconState = z.infer<typeof PulseBeaconState>;

export const PulseBeaconProps = z.object({
  state: PulseBeaconState,
  label: z.string().min(1).max(60),
  subtitle: z.string().max(120).optional(),
  onNavigate: z.function().optional(),
  className: z.string().optional(),
});

export type PulseBeaconProps = z.infer<typeof PulseBeaconProps>;

/** Valid transitions */
export const PULSE_BEACON_TRANSITIONS: Record<PulseBeaconState, PulseBeaconState[]> = {
  subtle: ["moderate", "urgent", "hidden"],
  moderate: ["subtle", "urgent", "hidden"],
  urgent: ["moderate", "subtle", "hidden"],
  hidden: ["subtle", "moderate", "urgent"],
};

/** Color token per state */
export const PULSE_BEACON_COLORS: Record<PulseBeaconState, string> = {
  subtle: "rgba(0, 240, 255, 0.30)",
  moderate: "rgba(0, 240, 255, 0.60)",
  urgent: "rgba(168, 85, 247, 0.85)",
  hidden: "transparent",
};

/** Animation duration per state (CSS animation-duration) */
export const PULSE_BEACON_ANIMATION: Record<PulseBeaconState, string> = {
  subtle: "3s",
  moderate: "1.5s",
  urgent: "0.7s",
  hidden: "0s",
};

/** Portuguese status prefix per state */
export const PULSE_BEACON_PREFIXES: Record<PulseBeaconState, string> = {
  subtle: "SINAL",
  moderate: "DETECTADO",
  urgent: "PRIORITÁRIO",
  hidden: "",
};

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validate that a state transition is legal.
 * Returns true if `from` → `to` is a valid transition.
 */
export function isValidTransition<T extends string>(
  transitions: Record<T, T[]>,
  from: T,
  to: T
): boolean {
  const allowed = transitions[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

/**
 * Validate component props against their Zod schema.
 * Returns the parsed (and defaulted) props or throws on validation error.
 */
export function validateProps<T>(
  schema: z.ZodSchema<T>,
  props: unknown
): T {
  const result = schema.safeParse(props);
  if (!result.success) {
    console.warn(
      "[HUD Contracts] Props validation failed:",
      result.error.flatten()
    );
    throw new Error(`Invalid props: ${result.error.message}`);
  }
  return result.data;
}
