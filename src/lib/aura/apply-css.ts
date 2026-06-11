// ─── src/lib/aura/apply-css.ts ──────────────────────────────────────────────
//
// Aplica estado da Aura como CSS custom properties no documentElement.
// Uso: import { applyAuraToDom, useAuraSync } from "@/lib/aura/apply-css";

import { useEffect } from "react";
import type { AuraState } from "./types";

/**
 * Aplica o AuraState como CSS custom properties no <html>.
 * Chamar no mount e sempre que o estado da aura mudar.
 */
export function applyAuraToDom(state: AuraState): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--aura-color", state.colorHex);
  root.style.setProperty("--aura-intensity", String(state.intensity));
  root.style.setProperty("--aura-phase", String(state.phase));
  root.style.setProperty("--aura-pattern", state.pattern);
}

/**
 * Hook React que sincroniza AuraState com o DOM.
 * Reaplica CSS custom properties quando o estado muda.
 */
export function useAuraSync(state: AuraState | null): void {
  useEffect(() => {
    if (!state) return;
    applyAuraToDom(state);
  }, [state]);
}
