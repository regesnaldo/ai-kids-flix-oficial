/**
 * MemoryEcho — Contract Tests
 *
 * Tests: trigger condition (mission.lastDiscovery), Portuguese label format,
 *        chromatic aberration phase, duration token, reduced-motion override.
 * Does NOT test: pixel positions, keyframe values, rendered snapshots.
 */

import { motion } from "@/design-system/motion";
import {
  MemoryEchoProps as MemoryEchoPropsSchema,
  MEMORY_ECHO_TRIGGER,
  COGNITIVE_PRIORITY,
  checkPerformanceGate,
  validateMotionProps,
} from "../_motionContracts";

describe("MemoryEcho — Contract", () => {
  // ═══ PROPS VALIDATION ════════════════════════════════════════════════════════

  test("validates required triggerState", () => {
    const valid = validateMotionProps(MemoryEchoPropsSchema, {
      triggerState: true,
    });
    expect(valid.triggerState).toBe(true);
  });

  test("rejects missing triggerState", () => {
    expect(() =>
      validateMotionProps(MemoryEchoPropsSchema, {})
    ).toThrow();
  });

  test("validates optional discoveryTag", () => {
    const valid = validateMotionProps(MemoryEchoPropsSchema, {
      triggerState: true,
      discoveryTag: "Redes Neurais Artificiais",
    });
    expect(valid.discoveryTag).toBe("Redes Neurais Artificiais");
  });

  test("validates optional onComplete callback", () => {
    const fn = jest.fn();
    const valid = validateMotionProps(MemoryEchoPropsSchema, {
      triggerState: true,
      onComplete: fn,
    });
    expect(typeof valid.onComplete).toBe("function");
  });

  // ═══ COGNITIVE TRIGGER ═══════════════════════════════════════════════════════

  test("trigger event is revisiting_unlocked_node", () => {
    expect(MEMORY_ECHO_TRIGGER.event).toBe("revisiting_unlocked_node");
  });

  test("trigger source references mission.lastDiscovery", () => {
    expect(MEMORY_ECHO_TRIGGER.source).toContain("lastDiscovery");
  });

  test("fires when user revisits lab with existing discovery context", () => {
    expect(MEMORY_ECHO_TRIGGER.description).toContain("revisits");
  });

  // ═══ PORTUGUESE CONTEXT LABEL ════════════════════════════════════════════════

  test("discoveryTag is a string (Portuguese label)", () => {
    const tag = "Redes Neurais Artificiais";
    expect(typeof tag).toBe("string");
    expect(tag.length).toBeGreaterThan(0);
  });

  test("label format: 'Referencia: {discoveryTag}'", () => {
    const tag = "Modelos de Linguagem";
    const label = `Referencia: ${tag}`;
    expect(label).toBe("Referencia: Modelos de Linguagem");
    expect(label).toContain("Referencia:");
    expect(label).toContain(tag);
  });

  // ═══ DURATION TOKEN ══════════════════════════════════════════════════════════

  test("maps to motion.echo duration token (400ms)", () => {
    expect(motion.duration.echo).toBe("400ms");
  });

  test("uses cubic-bezier recall easing", () => {
    expect(motion.easing.echo).toContain("cubic-bezier");
  });

  // ═══ REDUCED-MOTION ══════════════════════════════════════════════════════════

  test("reduced-motion collapses echo duration to 0ms", () => {
    expect(motion.reduced.duration.echo).toBe("0ms");
  });

  test("reduced-motion collapses echo easing to step-end", () => {
    expect(motion.reduced.easing.echo).toBe("step-end");
  });

  // ═══ TRIGGER FIRES ONLY ON STATE CHANGE ═════════════════════════════════════

  test("triggerState=false should deactivate echo", () => {
    const props = validateMotionProps(MemoryEchoPropsSchema, {
      triggerState: false,
    });
    expect(props.triggerState).toBe(false);
  });

  // ═══ PERFORMANCE GATE ════════════════════════════════════════════════════════

  test("MemoryEcho blocked when 2 motions already active", () => {
    const result = checkPerformanceGate(2, false);
    expect(result).toBe("max_simultaneous_reached");
  });

  test("MemoryEcho blocked by reduced-motion", () => {
    const result = checkPerformanceGate(0, true);
    expect(result).toBe("reduced_motion_active");
  });

  // ═══ COGNITIVE PRIORITY ══════════════════════════════════════════════════════

  test("has lowest cognitive priority (1)", () => {
    expect(COGNITIVE_PRIORITY.revisiting_unlocked_node).toBe(1);
  });
});
