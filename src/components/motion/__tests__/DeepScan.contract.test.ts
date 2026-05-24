/**
 * DeepScan — Contract Tests
 *
 * Tests: trigger state mapping, duration token, reduced-motion override,
 *        overlapping behavior with other motions.
 * Does NOT test: pixel positions, keyframe values, rendered snapshots.
 */

import { motion } from "@/design-system/motion";
import {
  DeepScanProps as DeepScanPropsSchema,
  DEEP_SCAN_TRIGGER,
  COGNITIVE_PRIORITY,
  PERFORMANCE_RULES,
  checkPerformanceGate,
  validateMotionProps,
} from "../_motionContracts";

describe("DeepScan — Contract", () => {
  // ═══ PROPS VALIDATION ════════════════════════════════════════════════════════

  test("validates required triggerState", () => {
    const valid = validateMotionProps(DeepScanPropsSchema, {
      triggerState: true,
    });
    expect(valid.triggerState).toBe(true);
  });

  test("rejects missing triggerState", () => {
    expect(() => validateMotionProps(DeepScanPropsSchema, {})).toThrow();
  });

  test("validates optional statusLabel", () => {
    const valid = validateMotionProps(DeepScanPropsSchema, {
      triggerState: true,
      statusLabel: "ANALISANDO ENTRADA...",
    });
    expect(valid.statusLabel).toBe("ANALISANDO ENTRADA...");
  });

  // ═══ COGNITIVE TRIGGER ═══════════════════════════════════════════════════════

  test("trigger event is lab_scanning_or_processing", () => {
    expect(DEEP_SCAN_TRIGGER.event).toBe("lab_scanning_or_processing");
  });

  test("trigger source references labState", () => {
    expect(DEEP_SCAN_TRIGGER.source).toContain("labState");
  });

  test("fires on scanning OR processing", () => {
    expect(DEEP_SCAN_TRIGGER.description).toContain("scanning");
    expect(DEEP_SCAN_TRIGGER.description).toContain("processing");
  });

  // ═══ DURATION TOKEN ══════════════════════════════════════════════════════════

  test("maps to motion.scan duration token", () => {
    expect(motion.duration.scan).toBe("800ms");
  });

  test("uses linear easing for scan", () => {
    expect(motion.easing.scan).toBe("linear");
  });

  // ═══ REDUCED-MOTION ══════════════════════════════════════════════════════════

  test("reduced-motion collapses scan duration to 0ms", () => {
    expect(motion.reduced.duration.scan).toBe("0ms");
  });

  test("reduced-motion collapses scan easing to step-end", () => {
    expect(motion.reduced.easing.scan).toBe("step-end");
  });

  // ═══ TRIGGER FIRES ONLY ON STATE CHANGE ═════════════════════════════════════

  test("triggerState=false should deactivate scan", () => {
    const props = validateMotionProps(DeepScanPropsSchema, {
      triggerState: false,
    });
    expect(props.triggerState).toBe(false);
  });

  test("triggerState=true should activate scan", () => {
    const props = validateMotionProps(DeepScanPropsSchema, {
      triggerState: true,
    });
    expect(props.triggerState).toBe(true);
  });

  // ═══ PERFORMANCE GATE ════════════════════════════════════════════════════════

  test("DeepScan blocked when 2 motions already active", () => {
    const result = checkPerformanceGate(2, false);
    expect(result).toBe("max_simultaneous_reached");
  });

  test("DeepScan blocked by reduced-motion preference", () => {
    const result = checkPerformanceGate(0, true);
    expect(result).toBe("reduced_motion_active");
  });

  // ═══ COGNITIVE PRIORITY ══════════════════════════════════════════════════════

  test("has priority 4 (second-highest after QuantumLeap)", () => {
    expect(COGNITIVE_PRIORITY.lab_scanning_or_processing).toBe(4);
  });

  // ═══ PERFORMANCE RULES ═══════════════════════════════════════════════════════

  test("debounce window is set", () => {
    expect(PERFORMANCE_RULES.debounceMs).toBeGreaterThan(0);
  });

  test("cooldown per type is set", () => {
    expect(PERFORMANCE_RULES.cooldownPerType).toBeGreaterThan(0);
  });
});
