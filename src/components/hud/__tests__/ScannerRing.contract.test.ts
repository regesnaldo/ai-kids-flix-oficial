/**
 * ScannerRing — Contract Tests
 *
 * Tests: state transitions, prop validation, color token mapping, Portuguese labels
 * Does NOT test: CSS pixel values, animation durations, rendered snapshots
 */

import {
  ScannerRingState,
  SCANNER_RING_TRANSITIONS,
  SCANNER_RING_COLORS,
  SCANNER_RING_LABELS,
  isValidTransition,
} from "../_contracts";

describe("ScannerRing — Contract", () => {
  // ═══ STATE TRANSITIONS ══════════════════════════════════════════════════════

  test("idle transitions: idle → scanning", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "idle", "scanning")).toBe(true);
  });

  test("idle rejects: idle → complete (skip)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "idle", "complete")).toBe(false);
  });

  test("idle rejects: idle → error (skip)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "idle", "error")).toBe(false);
  });

  test("scanning transitions: scanning → complete", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "scanning", "complete")).toBe(true);
  });

  test("scanning transitions: scanning → error", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "scanning", "error")).toBe(true);
  });

  test("scanning transitions: scanning → idle (cancel)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "scanning", "idle")).toBe(true);
  });

  test("complete transitions: complete → idle (reset)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "complete", "idle")).toBe(true);
  });

  test("complete rejects: complete → error (cannot fail after success)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "complete", "error")).toBe(false);
  });

  test("error transitions: error → idle (recover)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "error", "idle")).toBe(true);
  });

  test("error transitions: error → scanning (retry)", () => {
    expect(isValidTransition(SCANNER_RING_TRANSITIONS, "error", "scanning")).toBe(true);
  });

  // ═══ COLOR TOKEN MAPPING ════════════════════════════════════════════════════

  test("idle color is cyan at 20% opacity", () => {
    expect(SCANNER_RING_COLORS.idle).toContain("0.20");
  });

  test("scanning color is cyan at 80% opacity", () => {
    expect(SCANNER_RING_COLORS.scanning).toContain("0.80");
  });

  test("complete color is green (success)", () => {
    expect(SCANNER_RING_COLORS.complete).toContain("16, 185, 129");
  });

  test("error color is red", () => {
    expect(SCANNER_RING_COLORS.error).toContain("239, 68, 68");
  });

  test("every state has a defined color token", () => {
    const states = ScannerRingState.options;
    for (const state of states) {
      expect(SCANNER_RING_COLORS[state]).toBeDefined();
      expect(SCANNER_RING_COLORS[state].length).toBeGreaterThan(0);
    }
  });

  // ═══ PORTUGUESE LABELS ══════════════════════════════════════════════════════

  test("every state has a Portuguese label", () => {
    const states = ScannerRingState.options;
    for (const state of states) {
      expect(SCANNER_RING_LABELS[state]).toBeDefined();
      expect(SCANNER_RING_LABELS[state].length).toBeGreaterThan(0);
    }
  });

  test("labels are in Portuguese (not English)", () => {
    expect(SCANNER_RING_LABELS.idle).toBe("EM ESPERA");
    expect(SCANNER_RING_LABELS.scanning).toBe("ANALISANDO");
    expect(SCANNER_RING_LABELS.complete).toBe("CONCLUÍDO");
    expect(SCANNER_RING_LABELS.error).toBe("FALHA");
  });

  test("labels use uppercase (HUD convention)", () => {
    for (const label of Object.values(SCANNER_RING_LABELS)) {
      expect(label).toBe(label.toUpperCase());
    }
  });

  // ═══ PROP VALIDATION ════════════════════════════════════════════════════════

  test("valid props pass validation", () => {
    const props = { state: "scanning", size: 64 };
    // If this throws, the test fails — validation should pass
    expect(() => {
      const { validateProps } = require("../_contracts");
      const { ScannerRingProps } = require("../_contracts");
      validateProps(ScannerRingProps, props);
    }).not.toThrow();
  });

  test("invalid state string is rejected", () => {
    expect(() => {
      const { validateProps, ScannerRingProps } = require("../_contracts");
      validateProps(ScannerRingProps, { state: "exploding" });
    }).toThrow();
  });

  test("size below minimum is rejected", () => {
    expect(() => {
      const { validateProps, ScannerRingProps } = require("../_contracts");
      validateProps(ScannerRingProps, { state: "idle", size: 10 });
    }).toThrow();
  });
});
