/**
 * Motion Contracts — Cross-cutting Tests
 *
 * Tests: trigger-to-motion mapping, cognitive priority ordering,
 *        simultaneous motion cap enforcement, performance rule consistency.
 * Does NOT test: pixel positions, keyframe values, rendered snapshots.
 */

import {
  TRIGGER_TO_MOTION,
  COGNITIVE_PRIORITY,
  PERFORMANCE_RULES,
  checkPerformanceGate,
  QUANTUM_LEAP_TRIGGER,
  DEEP_SCAN_TRIGGER,
  SIGNAL_ACQUISITION_TRIGGER,
  ECHO_PULSE_TRIGGER,
  MEMORY_ECHO_TRIGGER,
} from "../_motionContracts";
import { motion } from "@/design-system/motion";

describe("Motion Contracts — Cross-cutting", () => {
  // ═══ TRIGGER → MOTION MAP ════════════════════════════════════════════════════

  test("all 5 cognitive events map to a motion component", () => {
    expect(Object.keys(TRIGGER_TO_MOTION)).toHaveLength(5);
  });

  test("cross_section_handoff_initiated → QuantumLeap", () => {
    expect(TRIGGER_TO_MOTION.cross_section_handoff_initiated).toBe("QuantumLeap");
  });

  test("lab_scanning_or_processing → DeepScan", () => {
    expect(TRIGGER_TO_MOTION.lab_scanning_or_processing).toBe("DeepScan");
  });

  test("discovery_moment → SignalAcquisition", () => {
    expect(TRIGGER_TO_MOTION.discovery_moment).toBe("SignalAcquisition");
  });

  test("new_hint_while_away → EchoPulse", () => {
    expect(TRIGGER_TO_MOTION.new_hint_while_away).toBe("EchoPulse");
  });

  test("revisiting_unlocked_node → MemoryEcho", () => {
    expect(TRIGGER_TO_MOTION.revisiting_unlocked_node).toBe("MemoryEcho");
  });

  // ═══ COGNITIVE PRIORITY ORDERING ═════════════════════════════════════════════

  test("priority scale is 1-5", () => {
    const values = Object.values(COGNITIVE_PRIORITY);
    expect(Math.min(...values)).toBe(1);
    expect(Math.max(...values)).toBe(5);
  });

  test("all priorities are unique", () => {
    const values = Object.values(COGNITIVE_PRIORITY);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  test("QuantumLeap has highest priority (cross-section navigation)", () => {
    const maxPriority = Math.max(...Object.values(COGNITIVE_PRIORITY));
    expect(COGNITIVE_PRIORITY.cross_section_handoff_initiated).toBe(maxPriority);
  });

  test("MemoryEcho has lowest priority (passive recall)", () => {
    const minPriority = Math.min(...Object.values(COGNITIVE_PRIORITY));
    expect(COGNITIVE_PRIORITY.revisiting_unlocked_node).toBe(minPriority);
  });

  test("priority order: handoff > scanning > discovery > hint > memory", () => {
    expect(COGNITIVE_PRIORITY.cross_section_handoff_initiated).toBeGreaterThan(
      COGNITIVE_PRIORITY.lab_scanning_or_processing
    );
    expect(COGNITIVE_PRIORITY.lab_scanning_or_processing).toBeGreaterThan(
      COGNITIVE_PRIORITY.discovery_moment
    );
    expect(COGNITIVE_PRIORITY.discovery_moment).toBeGreaterThan(
      COGNITIVE_PRIORITY.new_hint_while_away
    );
    expect(COGNITIVE_PRIORITY.new_hint_while_away).toBeGreaterThan(
      COGNITIVE_PRIORITY.revisiting_unlocked_node
    );
  });

  // ═══ MAX 2 SIMULTANEOUS MOTIONS ═════════════════════════════════════════════

  test("checkPerformanceGate: 0 active → allowed", () => {
    expect(checkPerformanceGate(0, false)).toBeNull();
  });

  test("checkPerformanceGate: 1 active → allowed", () => {
    expect(checkPerformanceGate(1, false)).toBeNull();
  });

  test("checkPerformanceGate: 2 active → blocked", () => {
    expect(checkPerformanceGate(2, false)).toBe("max_simultaneous_reached");
  });

  test("checkPerformanceGate: 3 active → blocked", () => {
    expect(checkPerformanceGate(3, false)).toBe("max_simultaneous_reached");
  });

  test("checkPerformanceGate: 10 active → blocked", () => {
    expect(checkPerformanceGate(10, false)).toBe("max_simultaneous_reached");
  });

  test("maxSimultaneous cap is enforced at exactly 2", () => {
    expect(PERFORMANCE_RULES.maxSimultaneous).toBe(2);
  });

  // ═══ REDUCED-MOTION DISABLES ALL ═════════════════════════════════════════════

  test("checkPerformanceGate with reducedMotion=true always blocks", () => {
    expect(checkPerformanceGate(0, true)).toBe("reduced_motion_active");
    expect(checkPerformanceGate(1, true)).toBe("reduced_motion_active");
    expect(checkPerformanceGate(2, true)).toBe("reduced_motion_active");
  });

  test("reduced-motion takes precedence over count check", () => {
    // Even 0 active motions — reduced-motion should still block
    const result = checkPerformanceGate(0, true);
    expect(result).not.toBeNull();
    expect(result).toBe("reduced_motion_active");
  });

  // ═══ PERFORMANCE RULES CONSISTENCY ═══════════════════════════════════════════

  test("maxSimultaneous matches motion.constraints", () => {
    expect(PERFORMANCE_RULES.maxSimultaneous).toBe(
      motion.constraints.maxSimultaneous
    );
  });

  test("debounceMs matches motion.constraints", () => {
    expect(PERFORMANCE_RULES.debounceMs).toBe(motion.constraints.debounceMs);
  });

  test("cooldownPerType matches motion.constraints", () => {
    expect(PERFORMANCE_RULES.cooldownPerType).toBe(
      motion.constraints.cooldownPerType
    );
  });

  test("reducedMotionDisablesAll is explicitly true", () => {
    expect(PERFORMANCE_RULES.reducedMotionDisablesAll).toBe(true);
  });

  // ═══ EVERY TRIGGER HAS A DESCRIPTION ════════════════════════════════════════

  const triggers = [
    QUANTUM_LEAP_TRIGGER,
    DEEP_SCAN_TRIGGER,
    SIGNAL_ACQUISITION_TRIGGER,
    ECHO_PULSE_TRIGGER,
    MEMORY_ECHO_TRIGGER,
  ];

  triggers.forEach((trigger) => {
    test(`${trigger.event}: has description`, () => {
      expect(trigger.description.length).toBeGreaterThan(0);
    });

    test(`${trigger.event}: has source`, () => {
      expect(trigger.source.length).toBeGreaterThan(0);
    });

    test(`${trigger.event}: has non-empty event name`, () => {
      expect(trigger.event.length).toBeGreaterThan(0);
    });
  });

  // ═══ NO MOTION WITHOUT COGNITIVE TRIGGER ════════════════════════════════════

  test("every motion in TRIGGER_TO_MOTION has a matching priority entry", () => {
    const events = Object.keys(TRIGGER_TO_MOTION) as Array<
      keyof typeof TRIGGER_TO_MOTION
    >;
    events.forEach((event) => {
      expect(COGNITIVE_PRIORITY[event]).toBeDefined();
      expect(typeof COGNITIVE_PRIORITY[event]).toBe("number");
    });
  });

  test("every cognitive event with priority has a trigger definition", () => {
    const events = Object.keys(COGNITIVE_PRIORITY);
    expect(events.sort()).toEqual(
      Object.keys(TRIGGER_TO_MOTION).sort()
    );
  });
});
