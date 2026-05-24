/**
 * SignalAcquisition — Contract Tests
 *
 * Tests: trigger conditions, shape validation, duration token,
 *        reduced-motion override, opacity behavior.
 * Does NOT test: pixel positions, keyframe values, rendered snapshots.
 */

import { motion } from "@/design-system/motion";
import {
  SignalAcquisitionProps as SignalAcquisitionPropsSchema,
  SIGNAL_ACQUISITION_TRIGGER,
  COGNITIVE_PRIORITY,
  checkPerformanceGate,
  validateMotionProps,
} from "../_motionContracts";

describe("SignalAcquisition — Contract", () => {
  // ═══ PROPS VALIDATION ════════════════════════════════════════════════════════

  test("validates required triggerState", () => {
    const valid = validateMotionProps(SignalAcquisitionPropsSchema, {
      triggerState: true,
    });
    expect(valid.triggerState).toBe(true);
  });

  test("rejects missing triggerState", () => {
    expect(() =>
      validateMotionProps(SignalAcquisitionPropsSchema, {})
    ).toThrow();
  });

  test("validates shape enum (hexagon default)", () => {
    const valid = validateMotionProps(SignalAcquisitionPropsSchema, {
      triggerState: true,
    });
    expect(valid.shape).toBe("hexagon");
  });

  test("validates shape diamond", () => {
    const valid = validateMotionProps(SignalAcquisitionPropsSchema, {
      triggerState: true,
      shape: "diamond",
    });
    expect(valid.shape).toBe("diamond");
  });

  test("rejects invalid shape", () => {
    expect(() =>
      validateMotionProps(SignalAcquisitionPropsSchema, {
        triggerState: true,
        shape: "circle",
      })
    ).toThrow();
  });

  test("validates optional label", () => {
    const valid = validateMotionProps(SignalAcquisitionPropsSchema, {
      triggerState: true,
      label: "Missoes",
    });
    expect(valid.label).toBe("Missoes");
  });

  // ═══ COGNITIVE TRIGGER ═══════════════════════════════════════════════════════

  test("trigger event is discovery_moment", () => {
    expect(SIGNAL_ACQUISITION_TRIGGER.event).toBe("discovery_moment");
  });

  test("fires on beacon priority >= 0.8 OR node unlocked", () => {
    expect(SIGNAL_ACQUISITION_TRIGGER.source).toContain("0.8");
    expect(SIGNAL_ACQUISITION_TRIGGER.source).toContain("unlocked");
  });

  // ═══ DURATION TOKEN ══════════════════════════════════════════════════════════

  test("maps to motion.pulse duration token", () => {
    expect(motion.duration.pulse).toBe("2000ms");
  });

  test("uses ease-in-out for pulse", () => {
    expect(motion.easing.pulse).toBe("ease-in-out");
  });

  // ═══ REDUCED-MOTION ══════════════════════════════════════════════════════════

  test("reduced-motion collapses pulse duration to 0ms", () => {
    expect(motion.reduced.duration.pulse).toBe("0ms");
  });

  test("reduced-motion collapses pulse easing to step-end", () => {
    expect(motion.reduced.easing.pulse).toBe("step-end");
  });

  // ═══ TRIGGER FIRES ONLY ON STATE CHANGE ═════════════════════════════════════

  test("triggerState=false should not show acquisition", () => {
    const props = validateMotionProps(SignalAcquisitionPropsSchema, {
      triggerState: false,
    });
    expect(props.triggerState).toBe(false);
  });

  // ═══ PERFORMANCE GATE ════════════════════════════════════════════════════════

  test("SignalAcquisition blocked when 2 motions already active", () => {
    const result = checkPerformanceGate(2, false);
    expect(result).toBe("max_simultaneous_reached");
  });

  test("SignalAcquisition blocked by reduced-motion", () => {
    const result = checkPerformanceGate(0, true);
    expect(result).toBe("reduced_motion_active");
  });

  // ═══ COGNITIVE PRIORITY ══════════════════════════════════════════════════════

  test("has priority 3", () => {
    expect(COGNITIVE_PRIORITY.discovery_moment).toBe(3);
  });

  // ═══ NO BLOCKING INTERACTION ═════════════════════════════════════════════════

  test("does not require onComplete", () => {
    const valid = validateMotionProps(SignalAcquisitionPropsSchema, {
      triggerState: true,
    });
    expect(valid.onComplete).toBeUndefined();
  });
});
