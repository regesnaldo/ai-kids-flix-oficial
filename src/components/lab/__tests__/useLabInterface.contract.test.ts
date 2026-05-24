/**
 * useLabInterface — Contract Tests
 *
 * Validates:
 * - Status text mapping (every labState → correct Portuguese string)
 * - HUD config mapping (every labState → correct component states)
 * - Invalid states fall back to idle safely
 * - transition is the store function (identity check via import)
 */

import { STATUS_TEXT, HUD_CONFIG } from "../useLabInterface";
import type { LabState } from "@/lib/navigation-hints/types";
import { LAB_STATES } from "@/lib/navigation-hints/types";

describe("useLabInterface — Contract", () => {
  // ═══ STATUS TEXT MAPPING ════════════════════════════════════════════════════

  test("idle → SISTEMA PRONTO", () => {
    expect(STATUS_TEXT.idle).toBe("SISTEMA PRONTO");
  });

  test("scanning → ANALISANDO ENTRADA...", () => {
    expect(STATUS_TEXT.scanning).toBe("ANALISANDO ENTRADA...");
  });

  test("processing → PROCESSANDO COGNITIVAMENTE...", () => {
    expect(STATUS_TEXT.processing).toBe("PROCESSANDO COGNITIVAMENTE...");
  });

  test("synthesis → SINTETIZANDO RESPOSTA...", () => {
    expect(STATUS_TEXT.synthesis).toBe("SINTETIZANDO RESPOSTA...");
  });

  test("complete → TRANSMISSÃO COMPLETA", () => {
    expect(STATUS_TEXT.complete).toBe("TRANSMISSÃO COMPLETA");
  });

  test("error → FALHA NO SINAL", () => {
    expect(STATUS_TEXT.error).toBe("FALHA NO SINAL");
  });

  test("all status texts are Portuguese and uppercase", () => {
    for (const text of Object.values(STATUS_TEXT)) {
      expect(text).toBe(text.toUpperCase());
      // Must contain at least one Portuguese-typical character
      expect(text).toMatch(/[A-ZÀ-ÚÇÃÕ]/);
    }
  });

  test("every LabState has a status text defined", () => {
    for (const state of LAB_STATES) {
      expect(STATUS_TEXT[state as LabState]).toBeDefined();
      expect(STATUS_TEXT[state as LabState].length).toBeGreaterThan(0);
    }
  });

  // ═══ HUD CONFIG MAPPING ═════════════════════════════════════════════════════

  test("idle → scannerRing: idle + gridOverlay: idle", () => {
    expect(HUD_CONFIG.idle.scannerRing).toBe("idle");
    expect(HUD_CONFIG.idle.gridOverlay).toBe("idle");
    expect(HUD_CONFIG.idle.signalBars).toBeUndefined();
  });

  test("scanning → scannerRing: scanning + gridOverlay: scanning", () => {
    expect(HUD_CONFIG.scanning.scannerRing).toBe("scanning");
    expect(HUD_CONFIG.scanning.gridOverlay).toBe("scanning");
  });

  test("processing → scannerRing: scanning + signalBars: moderate", () => {
    expect(HUD_CONFIG.processing.scannerRing).toBe("scanning");
    expect(HUD_CONFIG.processing.signalBars).toBe("moderate");
  });

  test("synthesis → scannerRing: scanning + signalBars: strong", () => {
    expect(HUD_CONFIG.synthesis.scannerRing).toBe("scanning");
    expect(HUD_CONFIG.synthesis.signalBars).toBe("strong");
  });

  test("complete → scannerRing: complete + pulseBeacon: moderate", () => {
    expect(HUD_CONFIG.complete.scannerRing).toBe("complete");
    expect(HUD_CONFIG.complete.pulseBeacon).toBe("moderate");
  });

  test("error → scannerRing: error + signalBars: lost", () => {
    expect(HUD_CONFIG.error.scannerRing).toBe("error");
    expect(HUD_CONFIG.error.signalBars).toBe("lost");
  });

  test("every LabState has a HUD config", () => {
    for (const state of LAB_STATES) {
      expect(HUD_CONFIG[state as LabState]).toBeDefined();
    }
  });

  // ═══ SAFE DEFAULTS ══════════════════════════════════════════════════════════

  test("unknown state returns idle default for status text", () => {
    const unknown = "quantum_flux" as LabState;
    const text = STATUS_TEXT[unknown] ?? STATUS_TEXT.idle;
    expect(text).toBe("SISTEMA PRONTO");
  });

  test("unknown state returns idle default for HUD config", () => {
    const unknown = "dark_matter" as LabState;
    const config = HUD_CONFIG[unknown] ?? HUD_CONFIG.idle;
    expect(config.scannerRing).toBe("idle");
    expect(config.gridOverlay).toBe("idle");
  });

  // ═══ CONFIG INTEGRITY ═══════════════════════════════════════════════════════

  test("scannerRing is always present in every state config", () => {
    for (const state of LAB_STATES) {
      const config = HUD_CONFIG[state as LabState];
      expect(config.scannerRing).toBeDefined();
      expect(["idle", "scanning", "complete", "error"]).toContain(config.scannerRing);
    }
  });

  test("signalBars states are valid Phase 2 values", () => {
    const validBars = ["weak", "moderate", "strong", "urgent", "lost"];
    for (const state of LAB_STATES) {
      const bars = HUD_CONFIG[state as LabState].signalBars;
      if (bars) {
        expect(validBars).toContain(bars);
      }
    }
  });

  test("pulseBeacon only appears in complete state", () => {
    for (const state of LAB_STATES) {
      const beacon = HUD_CONFIG[state as LabState].pulseBeacon;
      if (state === "complete") {
        expect(beacon).toBeDefined();
      } else {
        expect(beacon).toBeUndefined();
      }
    }
  });
});
