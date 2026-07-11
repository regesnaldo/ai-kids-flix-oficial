"use client";

import { useState, useCallback } from "react";
import type { OrchestrationState } from "@/components/CognitiveHero";

export interface OrchestrationStatus {
  state: OrchestrationState;
  iteration: number;
  cost: number;
  episodeTitle?: string;
}

const DEMO_SEQUENCE: OrchestrationState[] = [
  "idle", "generating", "evaluating", "revising", "evaluating", "approved",
];

/**
 * Hook que gerencia o estado da orquestração.
 * Versão atual: mock com ciclo de demonstração.
 * Futuro: substituir por polling/SSE do backend real.
 */
export function useOrchestrationState(initial?: Partial<OrchestrationStatus>) {
  const [status, setStatus] = useState<OrchestrationStatus>({
    state: initial?.state ?? "idle",
    iteration: initial?.iteration ?? 1,
    cost: initial?.cost ?? 0,
    episodeTitle: initial?.episodeTitle,
  });

  const transition = useCallback((newState: OrchestrationState) => {
    setStatus((prev) => {
      const next = { ...prev, state: newState };
      if (newState === "evaluating" && prev.state === "generating") {
        next.iteration = prev.iteration + 1;
      }
      if (newState === "evaluating") {
        next.cost = prev.cost + Math.random() * 0.012;
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setStatus({ state: "idle", iteration: 1, cost: 0, episodeTitle: initial?.episodeTitle });
  }, [initial?.episodeTitle]);

  return { status, transition, reset, setStatus };
}
