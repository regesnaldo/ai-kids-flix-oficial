/**
 * ─── MOTION COMPONENTS — State Contracts ──────────────────────────────────────
 *
 * Zod schemas for every motion component's props.
 * Trigger guards: which cognitive event fires which motion.
 * Performance rules: max 2 simultaneous, reduced-motion disables all.
 *
 * Every motion MUST have a cognitive trigger defined here.
 * No decorative-only animations.
 */

import { z } from "zod";
import { motion } from "@/design-system/motion";

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON PROPS
// ═══════════════════════════════════════════════════════════════════════════════

export const MotionBaseProps = z.object({
  className: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM LEAP
// ═══════════════════════════════════════════════════════════════════════════════

export const QuantumLeapProps = MotionBaseProps.extend({
  /** Cross-section handoff is pending */
  triggerState: z.boolean(),
  /** The destination section label (Portuguese) */
  destination: z.string().optional(),
  /** Called when animation completes */
  onComplete: z.function().optional(),
});

export type QuantumLeapProps = z.infer<typeof QuantumLeapProps>;

/** Cognitive trigger: handoffPending === true (from useNavigationStore) */
export const QUANTUM_LEAP_TRIGGER = {
  event: "cross_section_handoff_initiated",
  source: "useNavigationStore().handoffPayload !== null",
  description: "Fires when a cross-section handoff is pushed to the store",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// DEEP SCAN
// ═══════════════════════════════════════════════════════════════════════════════

export const DeepScanProps = MotionBaseProps.extend({
  /** LAB state is 'scanning' or 'processing' */
  triggerState: z.boolean(),
  /** Current lab state label (Portuguese) */
  statusLabel: z.string().optional(),
  /** Called when scan completes */
  onComplete: z.function().optional(),
});

export type DeepScanProps = z.infer<typeof DeepScanProps>;

/** Cognitive trigger: labState === 'scanning' || labState === 'processing' */
export const DEEP_SCAN_TRIGGER = {
  event: "lab_scanning_or_processing",
  source: "useNavigationStore().labState.state",
  description: "Fires when LAB enters scanning or processing state",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNAL ACQUISITION
// ═══════════════════════════════════════════════════════════════════════════════

export const SignalAcquisitionProps = MotionBaseProps.extend({
  /** Discovery moment active */
  triggerState: z.boolean(),
  /** Geometric shape variant */
  shape: z.enum(["diamond", "hexagon"]).default("hexagon"),
  /** Beacon label for the acquired signal */
  label: z.string().optional(),
  /** Called when pulse animation completes */
  onComplete: z.function().optional(),
});

export type SignalAcquisitionProps = z.infer<typeof SignalAcquisitionProps>;

/** Cognitive trigger: beacon priority >= 0.8 OR node unlocked */
export const SIGNAL_ACQUISITION_TRIGGER = {
  event: "discovery_moment",
  source: "beacon.priority >= 0.8 || mission node unlocked",
  description:
    "Fires when a high-priority beacon appears or a mission node unlocks",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ECHO PULSE
// ═══════════════════════════════════════════════════════════════════════════════

export const EchoPulseProps = MotionBaseProps.extend({
  /** New hint generated while user is in another section */
  triggerState: z.boolean(),
  /** Hint reason text (Portuguese) */
  message: z.string().optional(),
  /** Called when user dismisses */
  onDismiss: z.function().optional(),
  /** Called when animation completes */
  onComplete: z.function().optional(),
});

export type EchoPulseProps = z.infer<typeof EchoPulseProps>;

/** Cognitive trigger: newHintWhileAway (beacon count increased since last check) */
export const ECHO_PULSE_TRIGGER = {
  event: "new_hint_while_away",
  source: "beacons.length increased since last mount check",
  description:
    "Fires when new navigation hints arrive while user is already in lab",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY ECHO
// ═══════════════════════════════════════════════════════════════════════════════

export const MemoryEchoProps = MotionBaseProps.extend({
  /** User revisits a previously unlocked node */
  triggerState: z.boolean(),
  /** Discovery tag from mission state */
  discoveryTag: z.string().optional(),
  /** Called when echo fades */
  onComplete: z.function().optional(),
});

export type MemoryEchoProps = z.infer<typeof MemoryEchoProps>;

/** Cognitive trigger: revisitingNode (mission.lastDiscovery exists + already visited) */
export const MEMORY_ECHO_TRIGGER = {
  event: "revisiting_unlocked_node",
  source: "mission.lastDiscovery !== null",
  description:
    "Fires when user revisits lab with an existing discovery in mission context",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGER GUARD MAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Maps cognitive events to their motion components.
 * The LabMotionController reads this to determine which motion to render.
 */
export const TRIGGER_TO_MOTION = {
  cross_section_handoff_initiated: "QuantumLeap",
  lab_scanning_or_processing: "DeepScan",
  discovery_moment: "SignalAcquisition",
  new_hint_while_away: "EchoPulse",
  revisiting_unlocked_node: "MemoryEcho",
} as const;

export type CognitiveEvent = keyof typeof TRIGGER_TO_MOTION;

/**
 * Priority order for simultaneous motion scheduling.
 * Higher-priority motions preempt lower ones.
 */
export const COGNITIVE_PRIORITY: Record<CognitiveEvent, number> = {
  cross_section_handoff_initiated: 5,
  lab_scanning_or_processing: 4,
  discovery_moment: 3,
  new_hint_while_away: 2,
  revisiting_unlocked_node: 1,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE RULES (enforced at runtime)
// ═══════════════════════════════════════════════════════════════════════════════

export const PERFORMANCE_RULES = {
  /** Maximum simultaneous motion components rendering at once */
  maxSimultaneous: motion.constraints.maxSimultaneous,
  /** Debounce window before activating a queued motion (ms) */
  debounceMs: motion.constraints.debounceMs,
  /** Cooldown before same type can fire again on same target (ms) */
  cooldownPerType: motion.constraints.cooldownPerType,
  /** If reduced-motion is active, ALL durations become 0ms */
  reducedMotionDisablesAll: true,
} as const;

/**
 * Check if a motion should be suppressed based on performance rules.
 * Returns the reason string if suppressed, or null if allowed.
 */
export function checkPerformanceGate(
  activeMotionCount: number,
  reducedMotion: boolean
): string | null {
  if (reducedMotion && PERFORMANCE_RULES.reducedMotionDisablesAll) {
    return "reduced_motion_active";
  }
  if (activeMotionCount >= PERFORMANCE_RULES.maxSimultaneous) {
    return "max_simultaneous_reached";
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION STATE TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

export const MotionStateSchema = z.object({
  /** Which cognitive event triggered this motion */
  event: z.string(),
  /** When the motion started */
  startedAt: z.number(),
  /** Expected duration in ms */
  durationMs: z.number(),
  /** Whether the motion has completed */
  completed: z.boolean().default(false),
});

export type MotionState = z.infer<typeof MotionStateSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPER
// ═══════════════════════════════════════════════════════════════════════════════

export function validateMotionProps<T>(
  schema: z.ZodSchema<T>,
  props: unknown
): T {
  const result = schema.safeParse(props);
  if (!result.success) {
    console.warn(
      "[Motion Contracts] Props validation failed:",
      result.error.flatten()
    );
    throw new Error(`Invalid motion props: ${result.error.message}`);
  }
  return result.data;
}
