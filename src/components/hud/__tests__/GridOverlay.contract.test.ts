/**
 * GridOverlay — Contract Tests
 */

import {
  GridOverlayState,
  GRID_OVERLAY_TRANSITIONS,
  GRID_OVERLAY_OPACITY,
  isValidTransition,
} from "../_contracts";

describe("GridOverlay — Contract", () => {
  test("idle → active", () => {
    expect(isValidTransition(GRID_OVERLAY_TRANSITIONS, "idle", "active")).toBe(true);
  });

  test("idle → scanning", () => {
    expect(isValidTransition(GRID_OVERLAY_TRANSITIONS, "idle", "scanning")).toBe(true);
  });

  test("active → scanning", () => {
    expect(isValidTransition(GRID_OVERLAY_TRANSITIONS, "active", "scanning")).toBe(true);
  });

  test("scanning → idle (cancel)", () => {
    expect(isValidTransition(GRID_OVERLAY_TRANSITIONS, "scanning", "idle")).toBe(true);
  });

  test("scanning → active (de-escalate)", () => {
    expect(isValidTransition(GRID_OVERLAY_TRANSITIONS, "scanning", "active")).toBe(true);
  });

  test("opacity: idle is lowest", () => {
    expect(GRID_OVERLAY_OPACITY.idle).toBeLessThan(GRID_OVERLAY_OPACITY.scanning);
  });

  test("opacity: scanning is highest", () => {
    const values = Object.values(GRID_OVERLAY_OPACITY);
    expect(GRID_OVERLAY_OPACITY.scanning).toBe(Math.max(...values));
  });

  test("opacity: all values between 0 and 1", () => {
    for (const opacity of Object.values(GRID_OVERLAY_OPACITY)) {
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    }
  });

  test("valid props pass", () => {
    const { validateProps, GridOverlayProps } = require("../_contracts");
    expect(() =>
      validateProps(GridOverlayProps, { state: "active" })
    ).not.toThrow();
  });

  test("invalid state rejected", () => {
    const { validateProps, GridOverlayProps } = require("../_contracts");
    expect(() =>
      validateProps(GridOverlayProps, { state: "off" })
    ).toThrow();
  });

  test("pointerEvents defaults to false", () => {
    const { GridOverlayProps } = require("../_contracts");
    const parsed = GridOverlayProps.parse({ state: "idle" });
    expect(parsed.pointerEvents).toBe(false);
  });
});
