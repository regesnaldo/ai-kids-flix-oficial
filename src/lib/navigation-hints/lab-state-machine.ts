/**
 * ─── NAVIGATION HINTS — LAB State Machine ─────────────────────────────────────
 *
 * Drives the cinematic LAB experience through 6 distinct system states.
 * Each state produces Portuguese user-facing text for the HUD overlay,
 * Data-Stream panel, and system notifications.
 *
 * States: idle → scanning → processing → synthesis → complete → error
 */

import type { LabState, LabStateContext } from "./types";

// ─── STATE TRANSITIONS ────────────────────────────────────────────────────────

/**
 * Valid transitions between LAB states.
 * Any transition not listed here is rejected.
 */
const VALID_TRANSITIONS: Record<LabState, LabState[]> = {
  idle: ["scanning"],
  scanning: ["processing", "error", "idle"],
  processing: ["synthesis", "error"],
  synthesis: ["complete", "error"],
  complete: ["idle", "scanning"],
  error: ["idle", "scanning"],
};

// ─── STATE FACTORY ────────────────────────────────────────────────────────────

export function createLabState(experimentId?: string): LabStateContext {
  return {
    state: "idle",
    enteredAt: Date.now(),
    previousState: null,
    experimentId: experimentId ?? null,
    activeAgents: [],
    completedAgents: [],
    boardTags: [],
    progressPercent: 0,
    statusText: "Núcleo Quântico em espera",
    technicalDetail: "",
  };
}

// ─── TRANSITION ENGINE ────────────────────────────────────────────────────────

export function transition(
  ctx: LabStateContext,
  to: LabState,
  options?: {
    activeAgents?: string[];
    completedAgents?: string[];
    boardTags?: string[];
    progressPercent?: number;
    experimentId?: string;
  }
): LabStateContext {
  // Validate transition
  const allowed = VALID_TRANSITIONS[ctx.state];
  if (!allowed.includes(to)) {
    console.warn(
      `[LabStateMachine] Invalid transition: ${ctx.state} → ${to}. Allowed: ${allowed.join(", ")}`
    );
    // Force to error state if invalid transition attempted
    return transition(ctx, "error", {
      activeAgents: ctx.activeAgents,
      boardTags: ctx.boardTags,
    });
  }

  const now = Date.now();

  const base: LabStateContext = {
    state: to,
    enteredAt: now,
    previousState: ctx.state,
    experimentId: options?.experimentId ?? ctx.experimentId,
    activeAgents: options?.activeAgents ?? ctx.activeAgents,
    completedAgents: options?.completedAgents ?? ctx.completedAgents,
    boardTags: options?.boardTags ?? ctx.boardTags,
    progressPercent: options?.progressPercent ?? ctx.progressPercent,
    statusText: buildStatusText(to, options),
    technicalDetail: buildTechnicalDetail(to, options),
  };

  return base;
}

// ─── PORTUGUESE STATUS TEXT ───────────────────────────────────────────────────

function buildStatusText(
  state: LabState,
  options?: {
    activeAgents?: string[];
    completedAgents?: string[];
    boardTags?: string[];
    progressPercent?: number;
  }
): string {
  switch (state) {
    case "idle":
      return "Núcleo Quântico em espera";
    case "scanning": {
      const agents = options?.activeAgents ?? [];
      if (agents.length === 0) return "Analisando parâmetros de entrada...";
      return `Escaneando com ${agents.length} agente${agents.length > 1 ? "s" : ""}...`;
    }
    case "processing": {
      const active = options?.activeAgents ?? [];
      const completed = options?.completedAgents ?? [];
      const progress = options?.progressPercent ?? 0;
      if (active.length === 0) return "Processamento em andamento...";
      return `Processando (${completed.length}/${active.length + completed.length}) — ${progress}%`;
    }
    case "synthesis":
      return "Sintetizando descobertas...";
    case "complete": {
      const tags = options?.boardTags ?? [];
      return `Síntese concluída — ${tags.length} descobertas registradas`;
    }
    case "error":
      return "Falha no pipeline — análise necessária";
  }
}

function buildTechnicalDetail(
  state: LabState,
  options?: {
    activeAgents?: string[];
    completedAgents?: string[];
    boardTags?: string[];
  }
): string {
  switch (state) {
    case "idle":
      return "SYS:IDLE — Aguardando entrada";
    case "scanning": {
      const agents = options?.activeAgents
        ?.map((a) => a.toUpperCase())
        .join(" | ") ?? "";
      return `SYS:SCAN — Classificando consulta [${agents}]`;
    }
    case "processing": {
      const active = options?.activeAgents
        ?.map((a) => a.toUpperCase())
        .join(" → ") ?? "";
      return `SYS:PROC — Pipeline ativo: ${active}`;
    }
    case "synthesis": {
      const tags = (options?.boardTags?.length ?? 0);
      return `SYS:SYNTH — Consolidando ${tags} padrões detectados`;
    }
    case "complete": {
      const tags = (options?.boardTags?.length ?? 0);
      return `SYS:DONE — ${tags} registros no quadro de conhecimento`;
    }
    case "error":
      return "SYS:ERR — Pipeline interrompido. Diagnóstico disponível.";
  }
}

// ─── AGENT TRACKING ───────────────────────────────────────────────────────────

export function addActiveAgent(
  ctx: LabStateContext,
  agentId: string
): LabStateContext {
  if (ctx.activeAgents.includes(agentId)) return ctx;
  return {
    ...ctx,
    activeAgents: [...ctx.activeAgents, agentId],
  };
}

export function completeAgent(
  ctx: LabStateContext,
  agentId: string
): LabStateContext {
  return {
    ...ctx,
    activeAgents: ctx.activeAgents.filter((a) => a !== agentId),
    completedAgents: [...ctx.completedAgents, agentId],
  };
}

export function addBoardTag(ctx: LabStateContext, tag: string): LabStateContext {
  if (ctx.boardTags.includes(tag)) return ctx;
  return {
    ...ctx,
    boardTags: [...ctx.boardTags, tag],
  };
}

// ─── PROGRESS CALCULATION ─────────────────────────────────────────────────────

const LAB_AGENT_PIPELINE = ["nexus", "cipher", "kaos", "aurora"];

export function calculateProgress(completedAgents: string[]): number {
  if (completedAgents.length === 0) return 0;
  const total = LAB_AGENT_PIPELINE.length;
  return Math.round((completedAgents.length / total) * 100);
}

// ─── HUD OVERLAY TEXT ─────────────────────────────────────────────────────────

export function generateHudStatusLine(ctx: LabStateContext): string {
  const time = new Date(ctx.enteredAt).toISOString().slice(11, 19);
  const agents = ctx.activeAgents.length > 0
    ? ` | AGENTES: ${ctx.activeAgents.map(a => a.toUpperCase()).join(" ")}`
    : "";
  const tags = ctx.boardTags.length > 0
    ? ` | TAGS: ${ctx.boardTags.length}`
    : "";

  return `[${time}] ${ctx.statusText}${agents}${tags}`;
}

// ─── RESET ────────────────────────────────────────────────────────────────────

export function resetLab(experimentId?: string): LabStateContext {
  return createLabState(experimentId);
}
