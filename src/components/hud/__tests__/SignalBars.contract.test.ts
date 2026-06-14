/**
 * SignalBars — Contract Tests
 */

import {
  SignalBarsState,
  SignalBarsProps,
  SIGNAL_BARS_TRANSITIONS,
  SIGNAL_BARS_COLORS,
  SIGNAL_BARS_FILLED,
  SIGNAL_BARS_LABELS,
  isValidTransition,
  validateProps,
} from "../_contracts";

describe("SignalBars — Contract", () => {
  test("weak → moderate", () => {
    expect(isValidTransition(SIGNAL_BARS_TRANSITIONS, "weak", "moderate")).toBe(true);
  });

  test("weak → lost (signal death)", () => {
    expect(isValidTransition(SIGNAL_BARS_TRANSITIONS, "weak", "lost")).toBe(true);
  });

  test("urgent → strong (de-escalate)", () => {
    expect(isValidTransition(SIGNAL_BARS_TRANSITIONS, "urgent", "strong")).toBe(true);
  });

  test("urgent → lost (critical failure)", () => {
    expect(isValidTransition(SIGNAL_BARS_TRANSITIONS, "urgent", "lost")).toBe(true);
  });

  test("lost → weak (recovery)", () => {
    expect(isValidTransition(SIGNAL_BARS_TRANSITIONS, "lost", "weak")).toBe(true);
  });

  test("filled bars: weak=1, moderate=2, strong=3, urgent=4, lost=0", () => {
    expect(SIGNAL_BARS_FILLED.weak).toBe(1);
    expect(SIGNAL_BARS_FILLED.moderate).toBe(2);
    expect(SIGNAL_BARS_FILLED.strong).toBe(3);
    expect(SIGNAL_BARS_FILLED.urgent).toBe(4);
    expect(SIGNAL_BARS_FILLED.lost).toBe(0);
  });

  test("colors: weak→moderate→strong are cyan with increasing opacity", () => {
    const cyanRegex = /0, 240, 255/;
    expect(SIGNAL_BARS_COLORS.weak).toMatch(cyanRegex);
    expect(SIGNAL_BARS_COLORS.moderate).toMatch(cyanRegex);
    expect(SIGNAL_BARS_COLORS.strong).toMatch(cyanRegex);

    const weakOp = parseFloat(SIGNAL_BARS_COLORS.weak.match(/[\d.]+\)$/)?.[0] ?? "0");
    const modOp = parseFloat(SIGNAL_BARS_COLORS.moderate.match(/[\d.]+\)$/)?.[0] ?? "0");
    const strOp = parseFloat(SIGNAL_BARS_COLORS.strong.match(/[\d.]+\)$/)?.[0] ?? "0");
    expect(weakOp).toBeLessThan(modOp);
    expect(modOp).toBeLessThan(strOp);
  });

  test("urgent is purple", () => {
    expect(SIGNAL_BARS_COLORS.urgent).toContain("168, 85, 247");
  });

  test("lost is red", () => {
    expect(SIGNAL_BARS_COLORS.lost).toContain("239, 68, 68");
  });

  test("labels are Portuguese and uppercase", () => {
    expect(SIGNAL_BARS_LABELS.weak).toBe("SINAL FRACO");
    expect(SIGNAL_BARS_LABELS.moderate).toBe("SINAL MODERADO");
    expect(SIGNAL_BARS_LABELS.strong).toBe("SINAL FORTE");
    expect(SIGNAL_BARS_LABELS.urgent).toBe("SINAL URGENTE");
    expect(SIGNAL_BARS_LABELS.lost).toBe("SINAL PERDIDO");
  });

  test("valid props pass", () => {
    expect(() =>
      validateProps(SignalBarsProps, { state: "strong" })
    ).not.toThrow();
  });

  test("invalid state rejected", () => {
    expect(() =>
      validateProps(SignalBarsProps, { state: "medium" })
    ).toThrow();
  });
});
