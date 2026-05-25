/**
 * ActionNode — Contract Tests
 */

import {
  ActionNodeState,
  ACTION_NODE_TRANSITIONS,
  ACTION_NODE_COLORS,
  ACTION_NODE_LOCKED_LABEL,
  isValidTransition,
} from "../_contracts";

describe("ActionNode — Contract", () => {
  // ═══ STATE TRANSITIONS ══════════════════════════════════════════════════════

  test("locked → unlocked (only valid exit)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "locked", "unlocked")).toBe(true);
  });

  test("locked rejects: locked → active (skip)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "locked", "active")).toBe(false);
  });

  test("locked rejects: locked → completed (skip)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "locked", "completed")).toBe(false);
  });

  test("unlocked → active", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "unlocked", "active")).toBe(true);
  });

  test("unlocked → locked (relock)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "unlocked", "locked")).toBe(true);
  });

  test("active → completed", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "active", "completed")).toBe(true);
  });

  test("active → unlocked (abandon)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "active", "unlocked")).toBe(true);
  });

  test("completed → unlocked (reset)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "completed", "unlocked")).toBe(true);
  });

  test("completed rejects: completed → active (backward skip)", () => {
    expect(isValidTransition(ACTION_NODE_TRANSITIONS, "completed", "active")).toBe(false);
  });

  // ═══ COLOR TOKEN MAPPING ════════════════════════════════════════════════════

  test("locked is muted slate", () => {
    expect(ACTION_NODE_COLORS.locked).toContain("148, 163, 184");
    expect(ACTION_NODE_COLORS.locked).toContain("0.30");
  });

  test("unlocked is cyan 60%", () => {
    expect(ACTION_NODE_COLORS.unlocked).toContain("0, 240, 255");
    expect(ACTION_NODE_COLORS.unlocked).toContain("0.60");
  });

  test("active is cyan 90% (bright)", () => {
    expect(ACTION_NODE_COLORS.active).toContain("0, 240, 255");
    expect(parseFloat(ACTION_NODE_COLORS.active.match(/[\d.]+\)$/)?.[0] ?? "0")).toBeGreaterThan(0.8);
  });

  test("completed is purple", () => {
    expect(ACTION_NODE_COLORS.completed).toContain("168, 85, 247");
  });

  test("every state has a color", () => {
    for (const state of ActionNodeState.options) {
      expect(ACTION_NODE_COLORS[state]).toBeDefined();
    }
  });

  // ═══ PORTUGUESE LABELS ══════════════════════════════════════════════════════

  test("locked label is BLOQUEADO", () => {
    expect(ACTION_NODE_LOCKED_LABEL).toBe("BLOQUEADO");
  });

  test("locked label is uppercase", () => {
    expect(ACTION_NODE_LOCKED_LABEL).toBe(ACTION_NODE_LOCKED_LABEL.toUpperCase());
  });

  // ═══ PROP VALIDATION ════════════════════════════════════════════════════════

  test("valid props pass", () => {
    const { validateProps, ActionNodeProps } = require("../_contracts");
    expect(() =>
      validateProps(ActionNodeProps, { state: "unlocked", label: "EXECUTAR" })
    ).not.toThrow();
  });

  test("empty label rejected", () => {
    const { validateProps, ActionNodeProps } = require("../_contracts");
    expect(() =>
      validateProps(ActionNodeProps, { state: "unlocked", label: "" })
    ).toThrow();
  });

  test("label > 40 chars rejected", () => {
    const { validateProps, ActionNodeProps } = require("../_contracts");
    expect(() =>
      validateProps(ActionNodeProps, { state: "unlocked", label: "A".repeat(41) })
    ).toThrow();
  });

  test("invalid state rejected", () => {
    const { validateProps, ActionNodeProps } = require("../_contracts");
    expect(() =>
      validateProps(ActionNodeProps, { state: "disabled", label: "TESTE" })
    ).toThrow();
  });
});
