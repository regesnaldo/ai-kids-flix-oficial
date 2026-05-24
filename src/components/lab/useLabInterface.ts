"use client";

/**
 * useLabInterface — Phase 3 Orchestrator Hook
 *
 * Consumes Phase 1 (useNavigationStore labState machine + beacons + mission)
 * and Phase 2 (HUD component contracts) without creating new state logic.
 *
 * This hook is a PURE MAPPER: store state → HUD configuration.
 * No new state. No new transitions. No new logic.
 */

import { useNavigationStore } from "@/store/useNavigationStore";
import type { LabState } from "@/lib/navigation-hints/types";

// ─── STATUS TEXT MAP ──────────────────────────────────────────────────────────

const STATUS_TEXT: Record<LabState, string> = {
  idle: "SISTEMA PRONTO",
  scanning: "ANALISANDO ENTRADA...",
  processing: "PROCESSANDO COGNITIVAMENTE...",
  synthesis: "SINTETIZANDO RESPOSTA...",
  complete: "TRANSMISSÃO COMPLETA",
  error: "FALHA NO SINAL",
};

// ─── HUD COMPONENT CONFIG MAP ─────────────────────────────────────────────────

interface HudConfig {
  scannerRing?: "idle" | "scanning" | "complete" | "error";
  gridOverlay?: "idle" | "active" | "scanning";
  signalBars?: "weak" | "moderate" | "strong" | "urgent" | "lost";
  pulseBeacon?: "subtle" | "moderate" | "urgent";
}

const HUD_CONFIG: Record<LabState, HudConfig> = {
  idle: {
    scannerRing: "idle",
    gridOverlay: "idle",
  },
  scanning: {
    scannerRing: "scanning",
    gridOverlay: "scanning",
  },
  processing: {
    scannerRing: "scanning",
    signalBars: "moderate",
  },
  synthesis: {
    scannerRing: "scanning",
    signalBars: "strong",
  },
  complete: {
    scannerRing: "complete",
    pulseBeacon: "moderate",
  },
  error: {
    scannerRing: "error",
    signalBars: "lost",
  },
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export interface LabInterfaceState {
  /** Current LAB system state string */
  currentState: LabState;
  /** Portuguese operational label for the current state */
  statusText: string;
  /** Which Phase 2 HUD components to render and their states */
  hudConfig: HudConfig;
  /** Pass-through to store's labTransitionTo (NOT rewritten) */
  transition: typeof useNavigationStore.prototype.labTransitionTo;
  /** Active beacons from Phase 1 navigation store */
  beacons: ReturnType<typeof useNavigationStore.getState>["beacons"];
  /** Mission state from Phase 1 for bottom panel display */
  mission: ReturnType<typeof useNavigationStore.getState>["mission"];
}

export function useLabInterface(): LabInterfaceState {
  const labState = useNavigationStore((s) => s.labState);
  const transition = useNavigationStore((s) => s.labTransitionTo);
  const beacons = useNavigationStore((s) => s.beacons);
  const mission = useNavigationStore((s) => s.mission);

  const currentState = labState.state as LabState;
  const statusText = STATUS_TEXT[currentState] ?? STATUS_TEXT.idle;
  const hudConfig = HUD_CONFIG[currentState] ?? HUD_CONFIG.idle;

  return {
    currentState,
    statusText,
    hudConfig,
    transition,
    beacons,
    mission,
  };
}

// ─── EXPORTED HELPERS (for tests + external consumers) ────────────────────────

export { STATUS_TEXT, HUD_CONFIG };
