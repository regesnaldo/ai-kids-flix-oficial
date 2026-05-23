"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { findInLocalCache, saveToLocalCache, logUnansweredQuestion } from "@/lib/client-cache";

// ── Types ────────────────────────────────────────────────────────────
export interface AgentResult {
  agent: string;
  agentName: string;
  agentRole: string;
  agentColor: string;
  narrative: string;
  facts: string[];
  nextAgent: string;
  isComplete: boolean;
  boardFacts: string[];
}

export interface LabEvent {
  id: string;
  type: "agent_start" | "agent_complete" | "agent_error" | "human_inject" | "rollback" | "experiment_complete";
  agent?: string;
  message: string;
  timestamp: number;
}

export type ExperimentPhase = "idle" | "running" | "paused" | "complete";

// ── Agent order ───────────────────────────────────────────────────────
const AGENT_ORDER = ["nexus", "cipher", "kaos", "aurora"];

const AGENTS: Record<string, { name: string; role: string; color: string }> = {
  nexus: { name: "NEXUS", role: "O Conector", color: "#00f5ff" },
  cipher: { name: "CIPHER", role: "O Criptógrafo", color: "#00ff88" },
  kaos: { name: "KAOS", role: "O Caos Criativo", color: "#ff6b35" },
  aurora: { name: "AURORA", role: "A Sintetizadora", color: "#a78bfa" },
};

// ── Hook ──────────────────────────────────────────────────────────────
export function useExperimentEngine(experimentId: string | null) {
  const [phase, setPhase] = useState<ExperimentPhase>("idle");
  const [currentAgent, setCurrentAgent] = useState("");
  const [agentOutputs, setAgentOutputs] = useState<Record<string, AgentResult>>({});
  const [boardFacts, setBoardFacts] = useState<string[]>([]);
  const [events, setEvents] = useState<LabEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ agent: string; facts: string[]; timestamp: number }>>([]);
  const [rollbackUsed, setRollbackUsed] = useState(false);

  const pausedRef = useRef(false);
  const runningRef = useRef(false);
  const modeRef = useRef<"fast" | "full">("full");

  // ── Set mode ──────────────────────────────────────────────────────
  const setMode = useCallback((m: "fast" | "full") => {
    modeRef.current = m;
  }, []);

  // ── Add event ──────────────────────────────────────────────────────
  const addEvent = useCallback((type: LabEvent["type"], message: string, agent?: string) => {
    setEvents((prev) => [
      ...prev,
      { id: crypto.randomUUID().slice(0, 8), type, agent, message, timestamp: Date.now() },
    ]);
  }, []);

  // ── Poll board every 2s ────────────────────────────────────────────
  useEffect(() => {
    if (!experimentId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/lab/board?experimentId=${experimentId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.facts) setBoardFacts(data.facts);
        if (data.history) setHistory(data.history);
      } catch {}
    };

    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [experimentId]);

  // ── Execute one agent ──────────────────────────────────────────────
  const executeAgent = useCallback(async (agent: string, injectIdea?: string) => {
    if (!experimentId) return null;

    setCurrentAgent(agent);
    addEvent("agent_start", `🎬 ${agent.toUpperCase()} iniciando...`, agent);

    try {
      const res = await fetch("/api/lab/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentId, agent, injectIdea, mode: modeRef.current }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro no agente");
      }

      const result: AgentResult = await res.json();
      setAgentOutputs((prev) => ({ ...prev, [agent]: result }));
      setBoardFacts(result.boardFacts);

      addEvent(
        "agent_complete",
        `✅ ${result.agentName} concluiu: ${result.facts.length} descobertas adicionadas ao quadro`,
        agent
      );

      if (result.isComplete) {
        setPhase("complete");
        addEvent("experiment_complete", "🧪 Experimento concluído! Todos os agentes contribuíram.");
      }

      return result;
    } catch (err: any) {
      const msg = err?.message || "Erro desconhecido";
      setError(msg);
      addEvent("agent_error", `❌ ${agent.toUpperCase()} falhou: ${msg}`, agent);
      return null;
    }
  }, [experimentId, addEvent]);

  // ── Run all agents sequentially ────────────────────────────────────
  const runAll = useCallback(async (injectAfter?: { step: number; idea: string }) => {
    if (!experimentId) return;
    runningRef.current = true;
    pausedRef.current = false;
    setPhase("running");
    setError(null);

    for (let i = 0; i < AGENT_ORDER.length; i++) {
      if (!runningRef.current) break;

      // Wait if paused
      while (pausedRef.current) {
        await new Promise((r) => setTimeout(r, 200));
      }

      const agent = AGENT_ORDER[i];
      const idea = injectAfter && injectAfter.step === i ? injectAfter.idea : undefined;
      const result = await executeAgent(agent, idea);

      if (!result) {
        // Stop on error
        runningRef.current = false;
        return;
      }
    }

    runningRef.current = false;
  }, [experimentId, executeAgent]);

  // ── Pause ──────────────────────────────────────────────────────────
  const pause = useCallback(() => {
    pausedRef.current = true;
    setPhase("paused");
    addEvent("human_inject", "⏸️ Experimento pausado pelo usuário");
  }, [addEvent]);

  // ── Resume ─────────────────────────────────────────────────────────
  const resume = useCallback(() => {
    pausedRef.current = false;
    setPhase("running");
    addEvent("human_inject", "▶️ Experimento retomado");
  }, [addEvent]);

  // ── Inject idea ────────────────────────────────────────────────────
  const injectIdea = useCallback(async (idea: string) => {
    if (!experimentId) return;
    await fetch("/api/lab/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experimentId, idea }),
    });
    addEvent("human_inject", `💡 Ideia injetada: "${idea}"`);
  }, [experimentId, addEvent]);

  // ── Rollback ───────────────────────────────────────────────────────
  const rollback = useCallback(async (targetStep: number, injectIdea?: string) => {
    if (!experimentId) return;
    const res = await fetch("/api/lab/rollback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experimentId, targetStep, injectIdea }),
    });
    const data = await res.json();
    setBoardFacts(data.facts);
    setRollbackUsed(true);
    addEvent("rollback", `⏮️ Rollback para step ${targetStep + 1}`, undefined);

    // Rerun from current agent
    if (data.currentAgent) {
      setCurrentAgent(data.currentAgent);
      const idx = AGENT_ORDER.indexOf(data.currentAgent);
      if (idx >= 0) {
        runningRef.current = true;
        pausedRef.current = false;
        setPhase("running");
        for (let i = idx; i < AGENT_ORDER.length; i++) {
          if (!runningRef.current) break;
          while (pausedRef.current) {
            await new Promise((r) => setTimeout(r, 200));
          }
          const agentId = AGENT_ORDER[i];
          await executeAgent(agentId);
        }
        runningRef.current = false;
      }
    }
  }, [experimentId, addEvent, executeAgent]);

  // ── Stop ───────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    runningRef.current = false;
    pausedRef.current = false;
  }, []);

  // ── Load from cached result (zero API calls) ─────────────────────
  const loadCachedResult = useCallback((cached: any) => {
    const { nexus, cipher, kaos, aurora, board: facts } = cached;
    const outputs: Record<string, AgentResult> = {};

    for (const [agent, narrative] of Object.entries({ nexus, cipher, kaos, aurora })) {
      if (narrative) {
        outputs[agent] = {
          agent,
          agentName: AGENTS[agent]?.name || agent.toUpperCase(),
          agentRole: AGENTS[agent]?.role || "",
          agentColor: AGENTS[agent]?.color || "#888",
          narrative: narrative as string,
          facts: [],
          nextAgent: "",
          isComplete: agent === "aurora",
          boardFacts: facts || [],
        };
      }
    }

    setAgentOutputs(outputs);
    if (facts) setBoardFacts(facts);
    setPhase("complete");
    addEvent("experiment_complete", "📦 Resultado carregado do cache (zero API calls)");
  }, [addEvent]);

  // ── Cleanup ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      runningRef.current = false;
      pausedRef.current = false;
    };
  }, []);

  return {
    phase,
    currentAgent,
    agentOutputs,
    boardFacts,
    events,
    error,
    history,
    rollbackUsed,
    runAll,
    executeAgent,
    pause,
    resume,
    injectIdea,
    rollback,
    stop,
    loadCachedResult,
    setMode,
  };
}
