/**
 * Phase 2 Contract Test Runner (tsx — bypass Jest for WSL performance)
 * Validates all 6 HUD components: state transitions, color tokens, Portuguese labels.
 */

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log(`  PASS: ${msg}`); }
  else { failed++; console.error(`  FAIL: ${msg}`); }
}

// ═══ ScannerRing ═══════════════════════════════════════════════════════════════

console.log("\n═══ ScannerRing ═══");

import {
  ScannerRingState,
  SCANNER_RING_TRANSITIONS,
  SCANNER_RING_COLORS,
  SCANNER_RING_LABELS,
  isValidTransition,
} from "../_contracts.js";

assert(isValidTransition(SCANNER_RING_TRANSITIONS, "idle", "scanning"), "idle→scanning valid");
assert(!isValidTransition(SCANNER_RING_TRANSITIONS, "idle", "complete"), "idle→complete blocked");
assert(!isValidTransition(SCANNER_RING_TRANSITIONS, "idle", "error"), "idle→error blocked");
assert(isValidTransition(SCANNER_RING_TRANSITIONS, "scanning", "complete"), "scanning→complete valid");
assert(isValidTransition(SCANNER_RING_TRANSITIONS, "scanning", "error"), "scanning→error valid");
assert(isValidTransition(SCANNER_RING_TRANSITIONS, "scanning", "idle"), "scanning→idle (cancel)");
assert(isValidTransition(SCANNER_RING_TRANSITIONS, "complete", "idle"), "complete→idle (reset)");
assert(!isValidTransition(SCANNER_RING_TRANSITIONS, "complete", "error"), "complete→error blocked");
assert(isValidTransition(SCANNER_RING_TRANSITIONS, "error", "idle"), "error→idle (recover)");
assert(isValidTransition(SCANNER_RING_TRANSITIONS, "error", "scanning"), "error→scanning (retry)");

assert(SCANNER_RING_COLORS.idle.includes("0.20"), "idle color 20% opacity");
assert(SCANNER_RING_COLORS.scanning.includes("0.80"), "scanning color 80% opacity");
assert(SCANNER_RING_COLORS.complete.includes("16, 185, 129"), "complete color green");
assert(SCANNER_RING_COLORS.error.includes("239, 68, 68"), "error color red");

assert(SCANNER_RING_LABELS.idle === "EM ESPERA", "idle label PT");
assert(SCANNER_RING_LABELS.scanning === "ANALISANDO", "scanning label PT");
assert(SCANNER_RING_LABELS.complete === "CONCLUÍDO", "complete label PT");
assert(SCANNER_RING_LABELS.error === "FALHA", "error label PT");
// All uppercase
for (const label of Object.values(SCANNER_RING_LABELS)) {
  assert(label === label.toUpperCase(), `label "${label}" is uppercase`);
}

// ═══ ActionNode ════════════════════════════════════════════════════════════════

console.log("\n═══ ActionNode ═══");

import {
  ACTION_NODE_TRANSITIONS,
  ACTION_NODE_COLORS,
  ACTION_NODE_LOCKED_LABEL,
} from "../_contracts.js";

assert(isValidTransition(ACTION_NODE_TRANSITIONS, "locked", "unlocked"), "locked→unlocked");
assert(!isValidTransition(ACTION_NODE_TRANSITIONS, "locked", "active"), "locked→active blocked");
assert(!isValidTransition(ACTION_NODE_TRANSITIONS, "locked", "completed"), "locked→completed blocked");
assert(isValidTransition(ACTION_NODE_TRANSITIONS, "unlocked", "active"), "unlocked→active");
assert(isValidTransition(ACTION_NODE_TRANSITIONS, "active", "completed"), "active→completed");
assert(isValidTransition(ACTION_NODE_TRANSITIONS, "completed", "unlocked"), "completed→unlocked");
assert(!isValidTransition(ACTION_NODE_TRANSITIONS, "completed", "active"), "completed→active blocked");

assert(ACTION_NODE_COLORS.locked.includes("148, 163, 184"), "locked slate");
assert(ACTION_NODE_COLORS.unlocked.includes("0, 240, 255"), "unlocked cyan");
assert(ACTION_NODE_COLORS.completed.includes("168, 85, 247"), "completed purple");
assert(ACTION_NODE_LOCKED_LABEL === "BLOQUEADO", "locked label BLOQUEADO");

// ═══ ClassificationTag ═════════════════════════════════════════════════════════

console.log("\n═══ ClassificationTag ═══");

import {
  CLASSIFICATION_TAG_TRANSITIONS,
  CLASSIFICATION_TAG_CLEARANCE_COLORS,
  CLASSIFICATION_TAG_CLEARANCE_LABELS,
} from "../_contracts.js";

assert(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "default", "highlighted"), "default→highlighted");
assert(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "default", "archived"), "default→archived");
assert(isValidTransition(CLASSIFICATION_TAG_TRANSITIONS, "archived", "default"), "archived→default");

assert(CLASSIFICATION_TAG_CLEARANCE_COLORS.surface.includes("148, 163, 184"), "surface slate");
assert(CLASSIFICATION_TAG_CLEARANCE_COLORS.deep.includes("0, 240, 255"), "deep cyan");
assert(CLASSIFICATION_TAG_CLEARANCE_COLORS.core.includes("168, 85, 247"), "core purple");
assert(CLASSIFICATION_TAG_CLEARANCE_COLORS.restricted.includes("239, 68, 68"), "restricted red");

assert(CLASSIFICATION_TAG_CLEARANCE_LABELS.surface === "SUPERFÍCIE", "surface SUPERFÍCIE");
assert(CLASSIFICATION_TAG_CLEARANCE_LABELS.deep === "PROFUNDO", "deep PROFUNDO");
assert(CLASSIFICATION_TAG_CLEARANCE_LABELS.core === "NÚCLEO", "core NÚCLEO");
assert(CLASSIFICATION_TAG_CLEARANCE_LABELS.restricted === "RESTRITO", "restricted RESTRITO");

// ═══ GridOverlay ═══════════════════════════════════════════════════════════════

console.log("\n═══ GridOverlay ═══");

import { GRID_OVERLAY_TRANSITIONS, GRID_OVERLAY_OPACITY } from "../_contracts.js";

assert(isValidTransition(GRID_OVERLAY_TRANSITIONS, "idle", "active"), "idle→active");
assert(isValidTransition(GRID_OVERLAY_TRANSITIONS, "idle", "scanning"), "idle→scanning");
assert(isValidTransition(GRID_OVERLAY_TRANSITIONS, "scanning", "idle"), "scanning→idle");
assert(GRID_OVERLAY_OPACITY.idle < GRID_OVERLAY_OPACITY.scanning, "idle opacity < scanning opacity");
const maxOp = Math.max(...Object.values(GRID_OVERLAY_OPACITY));
assert(GRID_OVERLAY_OPACITY.scanning === maxOp, "scanning is highest opacity");

// ═══ SignalBars ════════════════════════════════════════════════════════════════

console.log("\n═══ SignalBars ═══");

import {
  SIGNAL_BARS_TRANSITIONS,
  SIGNAL_BARS_COLORS,
  SIGNAL_BARS_FILLED,
  SIGNAL_BARS_LABELS,
} from "../_contracts.js";

assert(SIGNAL_BARS_FILLED.weak === 1, "weak = 1 bar");
assert(SIGNAL_BARS_FILLED.moderate === 2, "moderate = 2 bars");
assert(SIGNAL_BARS_FILLED.strong === 3, "strong = 3 bars");
assert(SIGNAL_BARS_FILLED.urgent === 4, "urgent = 4 bars");
assert(SIGNAL_BARS_FILLED.lost === 0, "lost = 0 bars");

assert(SIGNAL_BARS_COLORS.weak.includes("0, 240, 255"), "weak cyan");
assert(SIGNAL_BARS_COLORS.moderate.includes("0, 240, 255"), "moderate cyan");
assert(SIGNAL_BARS_COLORS.strong.includes("0, 240, 255"), "strong cyan");
assert(SIGNAL_BARS_COLORS.urgent.includes("168, 85, 247"), "urgent purple");
assert(SIGNAL_BARS_COLORS.lost.includes("239, 68, 68"), "lost red");

assert(SIGNAL_BARS_LABELS.weak === "SINAL FRACO", "weak label");
assert(SIGNAL_BARS_LABELS.moderate === "SINAL MODERADO", "moderate label");
assert(SIGNAL_BARS_LABELS.strong === "SINAL FORTE", "strong label");
assert(SIGNAL_BARS_LABELS.urgent === "SINAL URGENTE", "urgent label");
assert(SIGNAL_BARS_LABELS.lost === "SINAL PERDIDO", "lost label");

assert(isValidTransition(SIGNAL_BARS_TRANSITIONS, "weak", "lost"), "weak→lost");
assert(isValidTransition(SIGNAL_BARS_TRANSITIONS, "lost", "weak"), "lost→weak (recovery)");

// ═══ PulseBeacon ═══════════════════════════════════════════════════════════════

console.log("\n═══ PulseBeacon ═══");

import {
  PULSE_BEACON_TRANSITIONS,
  PULSE_BEACON_COLORS,
  PULSE_BEACON_ANIMATION,
  PULSE_BEACON_PREFIXES,
} from "../_contracts.js";

assert(isValidTransition(PULSE_BEACON_TRANSITIONS, "subtle", "urgent"), "subtle→urgent");
assert(isValidTransition(PULSE_BEACON_TRANSITIONS, "subtle", "hidden"), "subtle→hidden");
assert(isValidTransition(PULSE_BEACON_TRANSITIONS, "hidden", "subtle"), "hidden→subtle");

assert(PULSE_BEACON_COLORS.subtle.includes("0, 240, 255"), "subtle cyan");
assert(PULSE_BEACON_COLORS.urgent.includes("168, 85, 247"), "urgent purple");
assert(PULSE_BEACON_COLORS.hidden === "transparent", "hidden transparent");

const subtleDur = parseFloat(PULSE_BEACON_ANIMATION.subtle);
const moderateDur = parseFloat(PULSE_BEACON_ANIMATION.moderate);
const urgentDur = parseFloat(PULSE_BEACON_ANIMATION.urgent);
assert(subtleDur > moderateDur, "subtle animation slower than moderate");
assert(moderateDur > urgentDur, "moderate animation slower than urgent");

assert(PULSE_BEACON_PREFIXES.subtle === "SINAL", "subtle prefix SINAL");
assert(PULSE_BEACON_PREFIXES.moderate === "DETECTADO", "moderate prefix DETECTADO");
assert(PULSE_BEACON_PREFIXES.urgent === "PRIORITÁRIO", "urgent prefix PRIORITÁRIO");
assert(PULSE_BEACON_PREFIXES.hidden === "", "hidden prefix empty");

// ═══ SUMMARY ═══════════════════════════════════════════════════════════════════

console.log(`\n═══════════════════════════════════════`);
console.log(`  ${passed} PASSED / ${failed} FAILED / ${passed + failed} TOTAL`);
console.log(`═══════════════════════════════════════`);

if (failed > 0) process.exit(1);
