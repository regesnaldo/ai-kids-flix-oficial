/**
 * PulseBeacon — Contract Tests
 */

import {
  PulseBeaconState,
  PULSE_BEACON_TRANSITIONS,
  PULSE_BEACON_COLORS,
  PULSE_BEACON_ANIMATION,
  PULSE_BEACON_PREFIXES,
  isValidTransition,
} from "../_contracts";

describe("PulseBeacon — Contract", () => {
  test("subtle → moderate (intensify)", () => {
    expect(isValidTransition(PULSE_BEACON_TRANSITIONS, "subtle", "moderate")).toBe(true);
  });

  test("subtle → urgent (critical escalation)", () => {
    expect(isValidTransition(PULSE_BEACON_TRANSITIONS, "subtle", "urgent")).toBe(true);
  });

  test("subtle → hidden (dismiss)", () => {
    expect(isValidTransition(PULSE_BEACON_TRANSITIONS, "subtle", "hidden")).toBe(true);
  });

  test("urgent → hidden (acknowledged)", () => {
    expect(isValidTransition(PULSE_BEACON_TRANSITIONS, "urgent", "hidden")).toBe(true);
  });

  test("hidden → subtle (reactivate)", () => {
    expect(isValidTransition(PULSE_BEACON_TRANSITIONS, "hidden", "subtle")).toBe(true);
  });

  test("hidden → urgent (immediate alert)", () => {
    expect(isValidTransition(PULSE_BEACON_TRANSITIONS, "hidden", "urgent")).toBe(true);
  });

  test("colors: subtle/moderate are cyan, urgent is purple, hidden is transparent", () => {
    expect(PULSE_BEACON_COLORS.subtle).toContain("0, 240, 255");
    expect(PULSE_BEACON_COLORS.moderate).toContain("0, 240, 255");
    expect(PULSE_BEACON_COLORS.urgent).toContain("168, 85, 247");
    expect(PULSE_BEACON_COLORS.hidden).toBe("transparent");
  });

  test("subtle opacity < moderate opacity", () => {
    const subtle = parseFloat(PULSE_BEACON_COLORS.subtle.match(/[\d.]+\)$/)?.[0] ?? "0");
    const moderate = parseFloat(PULSE_BEACON_COLORS.moderate.match(/[\d.]+\)$/)?.[0] ?? "0");
    expect(subtle).toBeLessThan(moderate);
  });

  test("animation duration: subtle > moderate > urgent", () => {
    const subtle = parseFloat(PULSE_BEACON_ANIMATION.subtle);
    const moderate = parseFloat(PULSE_BEACON_ANIMATION.moderate);
    const urgent = parseFloat(PULSE_BEACON_ANIMATION.urgent);
    expect(subtle).toBeGreaterThan(moderate);
    expect(moderate).toBeGreaterThan(urgent);
  });

  test("hidden has zero animation", () => {
    expect(PULSE_BEACON_ANIMATION.hidden).toBe("0s");
  });

  test("prefixes are Portuguese", () => {
    expect(PULSE_BEACON_PREFIXES.subtle).toBe("SINAL");
    expect(PULSE_BEACON_PREFIXES.moderate).toBe("DETECTADO");
    expect(PULSE_BEACON_PREFIXES.urgent).toBe("PRIORITÁRIO");
    expect(PULSE_BEACON_PREFIXES.hidden).toBe("");
  });

  test("valid props pass", () => {
    const { validateProps, PulseBeaconProps } = require("../_contracts");
    expect(() =>
      validateProps(PulseBeaconProps, {
        state: "moderate",
        label: "Missões",
        subtitle: "Módulo 3 disponível",
      })
    ).not.toThrow();
  });

  test("optional onNavigate and subtitle are accepted", () => {
    const { PulseBeaconProps } = require("../_contracts");
    const parsed = PulseBeaconProps.parse({ state: "subtle", label: "Teste" });
    expect(parsed.onNavigate).toBeUndefined();
    expect(parsed.subtitle).toBeUndefined();
  });

  test("empty label rejected", () => {
    const { validateProps, PulseBeaconProps } = require("../_contracts");
    expect(() =>
      validateProps(PulseBeaconProps, { state: "subtle", label: "" })
    ).toThrow();
  });
});
