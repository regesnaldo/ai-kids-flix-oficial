/**
 * Error resilience test — validates that extractNavigationHints survives:
 * - null input (LLM returns nothing)
 * - undefined input (broken call chain)
 * - empty string
 * - extremely long input (ReDoS protection)
 * - input with malformed brackets
 * - input with 100+ fake NAV-like tags
 */

import { extractNavigationHints } from "./extractor.js";

let passed = 0;
let failed = 0;
function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log(`  PASS: ${msg}`); }
  else { failed++; console.error(`  FAIL: ${msg}`); }
}

console.log("═══ Resilience Tests ═══\n");

// Test 1: null input
const r1 = extractNavigationHints(null as unknown as string);
assert(r1.cleanedText === "", "null → empty string");
assert(r1.bundle.hints.length === 0, "null → 0 hints");

// Test 2: undefined input
const r2 = extractNavigationHints(undefined as unknown as string);
assert(r2.cleanedText === "", "undefined → empty string");
assert(r2.bundle.hints.length === 0, "undefined → 0 hints");

// Test 3: empty string
const r3 = extractNavigationHints("");
assert(r3.cleanedText === "", "empty string → empty string");

// Test 4: number (wrong type from buggy code)
const r4 = extractNavigationHints(42 as unknown as string);
assert(r4.cleanedText === "", "number → empty string");

// Test 5: normal input still works
const r5 = extractNavigationHints(
  "Olá! [NAV:series:Módulo 3 disponível:0.7] Obrigado!"
);
assert(r5.cleanedText === "Olá! Obrigado!", "normal NAV tag stripped");
assert(r5.bundle.hints.length === 1, "normal → 1 hint");
assert(r5.bundle.hints[0].section === "series", "normal → series section");

// Test 6: input with many brackets (ReDoS protection)
const bracketBomb = "text ".repeat(200) + "[something] [else] [not nav]";
const r6 = extractNavigationHints(bracketBomb);
assert(r6.bundle.hints.length === 0, "bracket bomb → 0 hints (no crash)");
assert(r6.cleanedText.length > 0, "bracket bomb → text preserved");

// Test 7: valid NAV tag with colon in reason (fixed regex)
const r7 = extractNavigationHints(
  "Veja isso [NAV:lab:Experimento prático: backpropagation visual:0.9] e continue"
);
assert(r7.cleanedText === "Veja isso e continue", "colon in reason → stripped");
assert(r7.bundle.hints.length === 1, "colon in reason → 1 hint");
assert(r7.bundle.hints[0].reason.includes("Experimento prático"), "colon in reason → reason preserved");

// Test 8: multiple NAV tags on same line
const r8 = extractNavigationHints(
  "[NAV:series:M1:0.5] [NAV:lab:M2:0.9] texto"
);
assert(r8.cleanedText.trim() === "texto", "adjacent tags → all stripped");
assert(r8.bundle.hints.length === 2, "adjacent tags → 2 hints");

// Test 9: NAV tag with priority > 1 (should be clamped)
const r9 = extractNavigationHints(
  "[NAV:blog:Teste:99.5]"
);
assert(r9.bundle.hints.length === 1, "priority >1 → 1 hint");
assert(r9.bundle.hints[0].priority === 1, "priority 99.5 → clamped to 1");

// Test 10: extremely long text (should not hang)
const longText = "Palavra ".repeat(5000);
const start = Date.now();
const r10 = extractNavigationHints(longText);
const elapsed = Date.now() - start;
assert(elapsed < 500, `long text → ${elapsed}ms (under 500ms)`);
assert(r10.cleanedText.length > 0, "long text → text preserved");

// Test 11: encodeNavigationHintsHeader survives null (simulating route.ts)
function encodeNavigationHintsHeader(text: string, agentId: string): string {
  try {
    const { bundle } = extractNavigationHints(text, { sourceAgentId: agentId });
    const json = JSON.stringify(bundle);
    return Buffer.from(json).toString("base64");
  } catch {
    return "";
  }
}
const hdr = encodeNavigationHintsHeader(null as unknown as string, "nexus");
// Null input → extractNavigationHints returns empty bundle → base64-encodes to valid JSON
const decoded = JSON.parse(Buffer.from(hdr, "base64").toString("utf-8"));
assert(decoded.hints.length === 0, "encodeNavigationHintsHeader(null) → 0 hints in bundle");

const hdr2 = encodeNavigationHintsHeader(
  "[NAV:series:M1:0.7]", "nexus"
);
assert(hdr2.length > 0, "encodeNavigationHintsHeader(valid) → non-empty");
assert(Buffer.from(hdr2, "base64").toString("utf-8").includes("series"),
  "header decodes back to valid JSON with series hint");

// Summary
console.log(`\n═══════════════════════════════════════`);
console.log(`  ${passed} PASSED / ${failed} FAILED / ${passed + failed} TOTAL`);
console.log(`═══════════════════════════════════════`);
if (failed > 0) process.exit(1);
