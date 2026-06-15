/**
 * QuantumLeap — Contract Tests
 *
 * Tests: trigger state behavior, duration token mapping, reduced-motion override,
 *        performance gate integration.
 * Does NOT test: CSS pixel values, animation keyframes, rendered snapshots.
 */

import { motion } from "@/design-system/motion";
import {
  QuantumLeapProps as QuantumLeapPropsSchema,
  QUANTUM_LEAP_TRIGGER,
  COGNITIVE_PRIORITY,
  PERFORMANCE_RULES,
  checkPerformanceGate,
  validateMotionProps,
} from "../_motionContracts";

describe("QuantumLeap — Contract", () => {
  // ═══ PROPS VALIDATION ════════════════════════════════════════════════════════

  test("validates required triggerState", () => {
    const valid = validateMotionProps(QuantumLeapPropsSchema, {
      triggerState: true,
    });
    expect(valid.triggerState).toBe(true);
  });

  test("rejects missing triggerState", () => {
    expect(() => validateMotionProps(QuantumLeapPropsSchema, {})).toThrow();
  });

  test("validates optional destination string", () => {
    const valid = validateMotionProps(QuantumLeapPropsSchema, {
      triggerState: false,
      destination: "Missoes",
    });
    expect(valid.destination).toBe("Missoes");
  });

  test("validates optional onComplete callback", () => {
    const fn = jest.fn();
    const valid = validateMotionProps(QuantumLeapPropsSchema, {
      triggerState: true,
      onComplete: fn,
    });
    expect(typeof valid.onComplete).toBe("function");
  });

  // ═══ COGNITIVE TRIGGER ═══════════════════════════════════════════════════════

  test("trigger event is cross_section_handoff_initiated", () => {
    expect(QUANTUM_LEAP_TRIGGER.event).toBe("cross_section_handoff_initiated");
  });

  test("trigger source references handoffPayload", () => {
    expect(QUANTUM_LEAP_TRIGGER.source).toContain("handoffPayload");
  });

  // ═══ DURATION TOKEN ══════════════════════════════════════════════════════════

  test("maps to motion.leap duration token", () => {
    expect(motion.duration.leap).toBe("600ms");
  });

  // ═══ REDUCED-MOTION ══════════════════════════════════════════════════════════

  test("reduced-motion collapses leap duration to 0ms", () => {
    expect(motion.reduced.duration.leap).toBe("0ms");
  });

  test("reduced-motion collapses easing to step-end", () => {
    expect(motion.reduced.easing.leap).toBe("step-end");
  });

  // ═══ PERFORMANCE GATE ════════════════════════════════════════════════════════

  test("allows motion when under maxSimultaneous", () => {
    const result = checkPerformanceGate(0, false);
    expect(result).toBeNull();
  });

  test("allows motion when at 1 active (max is 2)", () => {
    const result = checkPerformanceGate(1, false);
    expect(result).toBeNull();
  });

  test("blocks when at maxSimultaneous (2)", () => {
    const result = checkPerformanceGate(2, false);
    expect(result).toBe("max_simultaneous_reached");
  });

  test("blocks when above maxSimultaneous", () => {
    const result = checkPerformanceGate(5, false);
    expect(result).toBe("max_simultaneous_reached");
  });

  test("blocks all when reduced-motion is active", () => {
    const result = checkPerformanceGate(0, true);
    expect(result).toBe("reduced_motion_active");
  });

  test("blocks even with 0 active motions when reduced-motion", () => {
    const result = checkPerformanceGate(0, true);
    expect(result).not.toBeNull();
  });

  // ═══ TRIGGER FIRES ONLY ON STATE CHANGE ═════════════════════════════════════

  test("triggerState=false should not activate motion (idle phase)", () => {
    const props = validateMotionProps(QuantumLeapPropsSchema, {
      triggerState: false,
    });
    expect(props.triggerState).toBe(false);
  });

  test("triggerState=true should activate motion", () => {
    const props = validateMotionProps(QuantumLeapPropsSchema, {
      triggerState: true,
    });
    expect(props.triggerState).toBe(true);
  });

  // ═══ COGNITIVE PRIORITY ══════════════════════════════════════════════════════

  test("has highest cognitive priority (5)", () => {
    expect(COGNITIVE_PRIORITY.cross_section_handoff_initiated).toBe(5);
  });

  // ═══ PERFORMANCE RULES ═══════════════════════════════════════════════════════

  test("maxSimultaneous is 2", () => {
    expect(PERFORMANCE_RULES.maxSimultaneous).toBe(2);
  });

  test("reducedMotionDisablesAll is true", () => {
    expect(PERFORMANCE_RULES.reducedMotionDisablesAll).toBe(true);
  });
});
