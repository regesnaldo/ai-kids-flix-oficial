/**
 * Phase 3 Contract Test Runner (tsx)
 * Validates: STATUS_TEXT, HUD_CONFIG, safe defaults
 */

import { STATUS_TEXT, HUD_CONFIG } from "../useLabInterface.js";
import { LAB_STATES } from "../../../lib/navigation-hints/types.js";
import type { LabState } from "../../../lib/navigation-hints/types.js";

let passed = 0;
let failed = 0;
function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log(`  PASS: ${msg}`); }
  else { failed++; console.error(`  FAIL: ${msg}`); }
}

console.log("═══ useLabInterface Contract Tests ═══\n");

// Status text mapping
assert(STATUS_TEXT.idle === "SISTEMA PRONTO", "idle → SISTEMA PRONTO");
assert(STATUS_TEXT.scanning === "ANALISANDO ENTRADA...", "scanning → ANALISANDO ENTRADA...");
assert(STATUS_TEXT.processing === "PROCESSANDO COGNITIVAMENTE...", "processing → PROCESSANDO COGNITIVAMENTE...");
assert(STATUS_TEXT.synthesis === "SINTETIZANDO RESPOSTA...", "synthesis → SINTETIZANDO RESPOSTA...");
assert(STATUS_TEXT.complete === "TRANSMISSÃO COMPLETA", "complete → TRANSMISSÃO COMPLETA");
assert(STATUS_TEXT.error === "FALHA NO SINAL", "error → FALHA NO SINAL");

// All uppercase
for (const [state, text] of Object.entries(STATUS_TEXT)) {
  assert(text === text.toUpperCase(), `${state} status text is uppercase`);
}

// Every LAB_STATE covered
for (const state of LAB_STATES) {
  assert(STATUS_TEXT[state as LabState] !== undefined, `${state} has status text`);
  assert(STATUS_TEXT[state as LabState].length > 0, `${state} status text non-empty`);
}

// HUD config mapping
assert(HUD_CONFIG.idle.scannerRing === "idle", "idle → scannerRing: idle");
assert(HUD_CONFIG.idle.gridOverlay === "idle", "idle → gridOverlay: idle");
assert(HUD_CONFIG.idle.signalBars === undefined, "idle → no signalBars");

assert(HUD_CONFIG.scanning.scannerRing === "scanning", "scanning → scannerRing: scanning");
assert(HUD_CONFIG.scanning.gridOverlay === "scanning", "scanning → gridOverlay: scanning");

assert(HUD_CONFIG.processing.scannerRing === "scanning", "processing → scannerRing: scanning");
assert(HUD_CONFIG.processing.signalBars === "moderate", "processing → signalBars: moderate");

assert(HUD_CONFIG.synthesis.scannerRing === "scanning", "synthesis → scannerRing: scanning");
assert(HUD_CONFIG.synthesis.signalBars === "strong", "synthesis → signalBars: strong");

assert(HUD_CONFIG.complete.scannerRing === "complete", "complete → scannerRing: complete");
assert(HUD_CONFIG.complete.pulseBeacon === "moderate", "complete → pulseBeacon: moderate");

assert(HUD_CONFIG.error.scannerRing === "error", "error → scannerRing: error");
assert(HUD_CONFIG.error.signalBars === "lost", "error → signalBars: lost");

// Every LAB_STATE has HUD config
for (const state of LAB_STATES) {
  assert(HUD_CONFIG[state as LabState] !== undefined, `${state} has HUD config`);
}

// Safe defaults
const unknownText = (STATUS_TEXT as Record<string, string>)["quantum_flux"] ?? STATUS_TEXT.idle;
assert(unknownText === "SISTEMA PRONTO", "unknown state → idle default for statusText");

const unknownConfig = (HUD_CONFIG as Record<string, unknown>)["dark_matter"] ?? HUD_CONFIG.idle;
assert((unknownConfig as typeof HUD_CONFIG.idle).scannerRing === "idle", "unknown state → idle HUD config");

// scannerRing always present
const validScannerStates = ["idle", "scanning", "complete", "error"];
for (const state of LAB_STATES) {
  const config = HUD_CONFIG[state as LabState];
  assert(config.scannerRing !== undefined, `${state} has scannerRing`);
  assert(validScannerStates.includes(config.scannerRing!), `${state} scannerRing valid`);
}

// pulseBeacon only in complete
for (const state of LAB_STATES) {
  const beacon = HUD_CONFIG[state as LabState].pulseBeacon;
  if (state === "complete") {
    assert(beacon !== undefined, "complete has pulseBeacon");
  } else {
    assert(beacon === undefined, `${state} has no pulseBeacon`);
  }
}

// signalBars valid values
const validBars = ["weak", "moderate", "strong", "urgent", "lost"];
for (const state of LAB_STATES) {
  const bars = HUD_CONFIG[state as LabState].signalBars;
  if (bars) {
    assert(validBars.includes(bars), `${state} signalBars "${bars}" valid`);
  }
}

console.log(`\n═══════════════════════════════════════`);
console.log(`  ${passed} PASSED / ${failed} FAILED / ${passed + failed} TOTAL`);
console.log(`═══════════════════════════════════════`);
if (failed > 0) process.exit(1);
