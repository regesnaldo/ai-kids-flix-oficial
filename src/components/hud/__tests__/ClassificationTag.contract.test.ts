/**
 * ClassificationTag — Contract Tests
 */

import {
  ClassificationTagState,
  CLASSIFICATION_TAG_TRANSITIONS,
  CLASSIFICATION_TAG_CLEARANCE_COLORS,
  CLASSIFICATION_TAG_CLEARANCE_LABELS,
  isValidTransition,
} from "../_contracts";

describe("ClassificationTag — Contract", () => {
  test("default → highlighted", () => {
    expect(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "default", "highlighted")).toBe(true);
  });

  test("default → archived", () => {
    expect(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "default", "archived")).toBe(true);
  });

  test("highlighted → default", () => {
    expect(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "highlighted", "default")).toBe(true);
  });

  test("archived → default (restore)", () => {
    expect(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "archived", "default")).toBe(true);
  });

  test("surface clearance is slate", () => {
    expect(CLASSIFICATION_TAG_CLEARANCE_COLORS.surface).toContain("148, 163, 184");
  });

  test("deep clearance is cyan", () => {
    expect(CLASSIFICATION_TAG_CLEARANCE_COLORS.deep).toContain("0, 240, 255");
  });

  test("core clearance is purple", () => {
    expect(CLASSIFICATION_TAG_CLEARANCE_COLORS.core).toContain("168, 85, 247");
  });

  test("restricted clearance is red", () => {
    expect(CLASSIFICATION_TAG_CLEARANCE_COLORS.restricted).toContain("239, 68, 68");
  });

  test("clearance labels are Portuguese", () => {
    expect(CLASSIFICATION_TAG_CLEARANCE_LABELS.surface).toBe("SUPERFÍCIE");
    expect(CLASSIFICATION_TAG_CLEARANCE_LABELS.deep).toBe("PROFUNDO");
    expect(CLASSIFICATION_TAG_CLEARANCE_LABELS.core).toBe("NÚCLEO");
    expect(CLASSIFICATION_TAG_CLEARANCE_LABELS.restricted).toBe("RESTRITO");
  });

  test("clearance labels are uppercase", () => {
    for (const label of Object.values(CLASSIFICATION_TAG_CLEARANCE_LABELS)) {
      expect(label).toBe(label.toUpperCase());
    }
  });

  test("every state has transitions defined", () => {
    for (const state of ClassificationTagState.options) {
      expect(CLASSIFICATION_TAG_TRANSITIONS[state]).toBeDefined();
      expect(Array.isArray(CLASSIFICATION_TAG_TRANSITIONS[state])).toBe(true);
    }
  });

  test("valid props pass validation", () => {
    const { validateProps, ClassificationTagProps } = require("../_contracts");
    expect(() =>
      validateProps(ClassificationTagProps, {
        state: "default",
        clearance: "deep",
        label: "REDES NEURAIS",
      })
    ).not.toThrow();
  });

  test("invalid clearance rejected", () => {
    const { validateProps, ClassificationTagProps } = require("../_contracts");
    expect(() =>
      validateProps(ClassificationTagProps, {
        state: "default",
        clearance: "unknown",
        label: "TESTE",
      })
    ).toThrow();
  });

  test("empty label rejected", () => {
    const { validateProps, ClassificationTagProps } = require("../_contracts");
    expect(() =>
      validateProps(ClassificationTagProps, {
        state: "default",
        clearance: "surface",
        label: "",
      })
    ).toThrow();
  });
});
