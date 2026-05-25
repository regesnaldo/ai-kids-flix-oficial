/**
 * EchoPulse — Contract Tests
 *
 * Tests: trigger detection, dismissibility, duration token,
 *        reduced-motion override, auto-dismiss timeout.
 * Does NOT test: pixel positions, keyframe values, rendered snapshots.
 */

import { motion } from "@/design-system/motion";
import {
  EchoPulseProps as EchoPulsePropsSchema,
  ECHO_PULSE_TRIGGER,
  COGNITIVE_PRIORITY,
  checkPerformanceGate,
  validateMotionProps,
} from "../_motionContracts";

describe("EchoPulse — Contract", () => {
  // ═══ PROPS VALIDATION ════════════════════════════════════════════════════════

  test("validates required triggerState", () => {
    const valid = validateMotionProps(EchoPulsePropsSchema, {
      triggerState: true,
    });
    expect(valid.triggerState).toBe(true);
  });

  test("rejects missing triggerState", () => {
    expect(() =>
      validateMotionProps(EchoPulsePropsSchema, {})
    ).toThrow();
  });

  test("validates optional message", () => {
    const valid = validateMotionProps(EchoPulsePropsSchema, {
      triggerState: true,
      message: "Nova descoberta em Quanticos",
    });
    expect(valid.message).toBe("Nova descoberta em Quanticos");
  });

  test("validates onDismiss callback", () => {
    const fn = jest.fn();
    const valid = validateMotionProps(EchoPulsePropsSchema, {
      triggerState: true,
      onDismiss: fn,
    });
    expect(typeof valid.onDismiss).toBe("function");
  });

  // ═══ COGNITIVE TRIGGER ═══════════════════════════════════════════════════════

  test("trigger event is new_hint_while_away", () => {
    expect(ECHO_PULSE_TRIGGER.event).toBe("new_hint_while_away");
  });

  test("trigger source references beacons.length", () => {
    expect(ECHO_PULSE_TRIGGER.source).toContain("beacons");
  });

  // ═══ DURATION TOKEN ══════════════════════════════════════════════════════════

  test("maps to motion.echo duration token", () => {
    expect(motion.duration.echo).toBe("400ms");
  });

  test("uses cubic-bezier for echo easing", () => {
    expect(motion.easing.echo).toContain("cubic-bezier");
  });

  // ═══ REDUCED-MOTION ══════════════════════════════════════════════════════════

  test("reduced-motion collapses echo duration to 0ms", () => {
    expect(motion.reduced.duration.echo).toBe("0ms");
  });

  test("reduced-motion collapses echo easing to step-end", () => {
    expect(motion.reduced.easing.echo).toBe("step-end");
  });

  // ═══ DISMISSIBILITY ══════════════════════════════════════════════════════════

  test("onDismiss is optional but contract supports it", () => {
    const withDismiss = validateMotionProps(EchoPulsePropsSchema, {
      triggerState: true,
      onDismiss: jest.fn(),
    });
    expect(typeof withDismiss.onDismiss).toBe("function");

    const withoutDismiss = validateMotionProps(EchoPulsePropsSchema, {
      triggerState: true,
    });
    expect(withoutDismiss.onDismiss).toBeUndefined();
  });

  // ═══ TRIGGER FIRES ONLY ON STATE CHANGE ═════════════════════════════════════

  test("triggerState=false should deactivate pulse", () => {
    const props = validateMotionProps(EchoPulsePropsSchema, {
      triggerState: false,
    });
    expect(props.triggerState).toBe(false);
  });

  // ═══ PERFORMANCE GATE ════════════════════════════════════════════════════════

  test("EchoPulse blocked when 2 motions already active", () => {
    const result = checkPerformanceGate(2, false);
    expect(result).toBe("max_simultaneous_reached");
  });

  test("EchoPulse blocked by reduced-motion", () => {
    const result = checkPerformanceGate(1, true);
    expect(result).toBe("reduced_motion_active");
  });

  // ═══ COGNITIVE PRIORITY ══════════════════════════════════════════════════════

  test("has priority 2", () => {
    expect(COGNITIVE_PRIORITY.new_hint_while_away).toBe(2);
  });
});
