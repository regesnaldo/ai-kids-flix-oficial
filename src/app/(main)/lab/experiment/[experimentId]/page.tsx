"use client";

import { use, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { AgentPipeline } from "@/components/lab/AgentPipeline";
import { KnowledgeBoard } from "@/components/lab/KnowledgeBoard";
import { EventStream } from "@/components/lab/EventStream";
import { HumanIntervention } from "@/components/lab/HumanIntervention";
import { ExperimentResult } from "@/components/lab/ExperimentResult";
import { useExperimentEngine } from "@/hooks/useExperimentEngine";
import type { AgentNodeStatus } from "@/components/lab/AgentNode";
import { saveToLocalCache } from "@/lib/client-cache";

const AGENT_ORDER = ["nexus", "cipher", "kaos", "aurora"];

function getAgentStatus(
  agentId: string,
  currentAgent: string,
  completedAgents: string[],
  phase: string
): AgentNodeStatus {
  if (completedAgents.includes(agentId)) return "completed";
  if (agentId === currentAgent && phase === "running") return "active";
  return "waiting";
}

export default function ExperimentPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { experimentId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
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
  } = useExperimentEngine(experimentId === "cached" ? null : experimentId);

  // ── Handle cached mode ─────────────────────────────────────────────
  const cacheData = useMemo(() => {
    if (experimentId !== "cached") return null;
    try {
      const raw = searchParams.get("data");
      return raw ? JSON.parse(decodeURIComponent(raw)) : null;
    } catch {
      return null;
    }
  }, [experimentId, searchParams]);

  // ── Read mode from URL ─────────────────────────────────────────────
  const modeParam = searchParams.get("mode") as "fast" | "full" | null;

  // AUTO-START: cached → load instantly; normal → run pipeline
  useEffect(() => {
    if (cacheData) {
      // Load cached result (zero API calls)
      loadCachedResult(cacheData);
      if (modeParam) setMode(modeParam);
      return;
    }

    if (experimentId && experimentId !== "cached" && phase === "idle") {
      if (modeParam) setMode(modeParam);
      runAll();
    }
  }, [experimentId, phase, runAll, cacheData, loadCachedResult, modeParam, setMode]);

  // Award XP on completion
  const awardXp = useCallback(async () => {
    try {
      await fetch("/api/xp/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "lab_experiment_complete",
          rollbackUsed,
        }),
      });
      // Fire conquest event
      window.dispatchEvent(
        new CustomEvent("mente_ai_conquest", {
          detail: {
            title: "🧪 Experimento concluído!",
            description: `+${15 + (rollbackUsed ? 5 : 0)} XP`,
          },
        })
      );
    } catch {}
  }, [rollbackUsed]);

  useEffect(() => {
    if (phase === "complete") {
      awardXp();
      // Save to localStorage for offline use
      if (experimentId !== "cached") {
        const topic = boardFacts[0] || "experimento";
        saveToLocalCache(topic, {
          nexus: agentOutputs["nexus"]?.narrative,
          cipher: agentOutputs["cipher"]?.narrative,
          kaos: agentOutputs["kaos"]?.narrative,
          aurora: agentOutputs["aurora"]?.narrative,
          board: boardFacts,
        });
      }
      // Update past experiments in localStorage
      try {
        const stored = localStorage.getItem("lab_experiments");
        if (stored) {
          const exps = JSON.parse(stored);
          const idx = exps.findIndex((e: any) => e.id === experimentId);
          if (idx >= 0) {
            exps[idx].completedAgents = 4;
            localStorage.setItem("lab_experiments", JSON.stringify(exps));
          }
        }
      } catch {}
    }
  }, [phase, experimentId, awardXp]);

  // Export report
  const handleExport = useCallback(() => {
    const topic = boardFacts.length > 0 ? "Experiment" : "Relatório";
    const tags = boardFacts.map((f) => `  • ${f}`).join("\n");
    const synthesis = agentOutputs["aurora"]?.narrative || "Síntese não disponível.";

    const report = [
      `╔══════════════════════════════════════════════╗`,
      `║   MENTE.AI LAB — RELATÓRIO DE EXPERIMENTO   ║`,
      `╚══════════════════════════════════════════════╝`,
      ``,
      `TEMA: ${topic}`,
      `DATA: ${new Date().toLocaleString("pt-BR")}`,
      ``,
      `──────────────────────────────────────────────`,
      `📋 QUADRO DE CONHECIMENTO`,
      `──────────────────────────────────────────────`,
      tags || "  (vazio)",
      ``,
      `──────────────────────────────────────────────`,
      `✨ SÍNTESE DE AURORA`,
      `──────────────────────────────────────────────`,
      synthesis,
      ``,
      `──────────────────────────────────────────────`,
      `AGENTES: NEXUS · CIPHER · KAOS · AURORA`,
      `XP: +${15 + (rollbackUsed ? 5 : 0)}`,
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-lab-${experimentId.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [boardFacts, agentOutputs, experimentId, rollbackUsed]);

  // Retry failed agent
  const handleRetryAgent = useCallback(
    async (agentId: string) => {
      await executeAgent(agentId);
    },
    [executeAgent]
  );

  const agents = AGENT_ORDER.map((id) => ({
    id,
    status: getAgentStatus(id, currentAgent, Object.keys(agentOutputs), phase),
  }));

  const isComplete = phase === "complete";
  const isRunning = phase === "running" || phase === "paused";

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "#0e1420" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.03]"
          style={{ background: isComplete ? "#a78bfa" : "var(--accent-cyan)" }}
        />
      </div>

      {/* Top bar */}
      <header
        className="relative z-20 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <button
          onClick={() => {
            stop();
            router.push("/lab");
          }}
          className="flex items-center gap-2 text-white/25 hover:text-white/50 transition-colors text-xs"
        >
          <ArrowLeft size={14} />
          <span className="font-mono uppercase tracking-wider">← LAB</span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-cyan)" }}
          >
            EXPERIMENTO {experimentId.slice(0, 8)}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isComplete
                ? "bg-[#a78bfa]"
                : isRunning
                ? "animate-pulse bg-[var(--accent-cyan)]"
                : "bg-white/10"
            }`}
            style={{
              boxShadow: isComplete
                ? "0 0 8px #a78bfa80"
                : isRunning
                ? "0 0 8px rgba(0,245,255,0.5)"
                : "none",
            }}
          />
        </div>
      </header>

      {/* Main grid */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-4 p-4">
        {/* LEFT — Agent Pipeline */}
        <aside className="order-2 lg:order-1">
          <div
            className="rounded-xl p-3 h-full"
            style={{
              background: "rgba(22, 29, 46, 0.5)",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            <AgentPipeline agents={agents} onRetryAgent={handleRetryAgent} />
          </div>
        </aside>

        {/* CENTER — Active output */}
        <section className="order-1 lg:order-2 flex flex-col gap-4 min-h-0">
          {/* Active agent typewriter */}
          {currentAgent && agentOutputs[currentAgent] && !isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl p-5 flex-1 overflow-y-auto"
              style={{
                background: "rgba(22, 29, 46, 0.5)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-[0.25em] mb-3"
                style={{ color: "var(--accent-cyan)" }}
              >
                🎙️ {agentOutputs[currentAgent].agentName} · {agentOutputs[currentAgent].agentRole}
              </p>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap font-mono"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {agentOutputs[currentAgent].narrative}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block ml-0.5"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  ▌
                </motion.span>
              </div>
            </motion.div>
          )}

          {/* Waiting for agent */}
          {currentAgent && !agentOutputs[currentAgent] && isRunning && (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0.3, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-center"
              >
                <span className="text-3xl block mb-3">
                  {currentAgent === "nexus"
                    ? "🧬"
                    : currentAgent === "cipher"
                    ? "🔍"
                    : currentAgent === "kaos"
                    ? "⚡"
                    : "✨"}
                </span>
                <p className="text-white/20 text-sm font-mono">
                  {currentAgent.toUpperCase()} está processando...
                </p>
              </motion.div>
            </div>
          )}

          {/* Complete: show result */}
          {isComplete && (
            <ExperimentResult
              topic={boardFacts[0] || "Experimento"}
              agentOutputs={agentOutputs}
              boardFacts={boardFacts}
              rollbackUsed={rollbackUsed}
              onExport={handleExport}
            />
          )}

          {/* Error state */}
          {error && (
            <div
              className="rounded-xl p-5 text-center"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <p className="text-red-400 text-sm font-bold mb-2">Erro no agente</p>
              <p className="text-red-300/60 text-xs font-mono">{error}</p>
            </div>
          )}

          {/* Knowledge board (bottom of center) */}
          {boardFacts.length > 0 && (
            <KnowledgeBoard facts={boardFacts} />
          )}
        </section>

        {/* RIGHT — Event Stream + Human Intervention */}
        <aside className="order-3 flex flex-col gap-4">
          <EventStream events={events} />

          {/* Intervention — only while running */}
          {!isComplete && (
            <HumanIntervention
              phase={phase}
              history={history}
              onPause={pause}
              onResume={resume}
              onInjectIdea={injectIdea}
              onRollback={rollback}
            />
          )}

          {/* XP info on complete */}
          {isComplete && (
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(22, 29, 46, 0.5)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <Trophy size={20} className="mx-auto mb-2" style={{ color: "var(--accent-cyan)" }} />
              <p className="text-xs font-bold" style={{ color: "var(--accent-cyan)" }}>
                +{15 + (rollbackUsed ? 5 : 0)} XP
              </p>
              <p className="text-[9px] text-white/20 mt-1">Experimento concluído</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
