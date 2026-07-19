"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StateNode } from "./StateNode";
import { CostBadge } from "./CostBadge";
import type { NodeState } from "./StateNode";

export type OrchestrationState = NodeState;

export interface CognitiveHeroProps {
  state: OrchestrationState;
  iteration: number;
  cost: number;
  maxIterations: number;
  maxCost: number;
  episodeTitle?: string;
  onDemo?: () => void;
}

const STATE_FLOW: { state: OrchestrationState; label: string }[] = [
  { state: "idle",       label: "Ocioso"     },
  { state: "generating", label: "Gerando" },
  { state: "evaluating", label: "Avaliando" },
  { state: "revising",   label: "Refinando"   },
  { state: "approved",   label: "Aprovado" },
  { state: "rejected",   label: "Rejeitado" },
  { state: "error",      label: "Erro"    },
];

const STATUS_TEXT: Record<OrchestrationState, string> = {
  idle:       "Aguardando solicitação de geração",
  generating: "Agente de IA gerando conteúdo",
  evaluating: "VERITAS verificando a qualidade",
  revising:   "Refinando com base na avaliação",
  approved:   "Conteúdo aprovado e publicado",
  rejected:   "Conteúdo marcado para revisão humana",
  error:      "Ocorreu um erro durante o processamento",
};

function stateIndex(s: OrchestrationState) {
  return STATE_FLOW.findIndex((n) => n.state === s);
}

function getNodeStatus(node: OrchestrationState, current: OrchestrationState) {
  const terminal = ["approved", "rejected", "error"] as OrchestrationState[];
  if (terminal.includes(current)) {
    return node === current ? "active" : "pending";
  }
  const ni = stateIndex(node);
  const ci = stateIndex(current);
  if (ni < ci) return "completed";
  if (ni === ci) return "active";
  return "pending";
}

export function CognitivePipeline({
  state, iteration, cost, maxIterations, maxCost, episodeTitle, onDemo,
}: CognitiveHeroProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 900);
    return () => clearInterval(t);
  }, []);

  const terminal = ["approved", "rejected", "error"].includes(state);
  const progressPct = terminal
    ? 100
    : Math.min(95, (stateIndex(state) / (STATE_FLOW.length - 1)) * 100);

  const progressColor =
    state === "rejected" ? "from-red-500 to-red-400"
    : state === "error"  ? "from-orange-500 to-orange-400"
    : "from-[#00FFFF] to-[#00FF88]";

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div
        className="
          relative overflow-hidden
          bg-black border border-white/8
          rounded-2xl
          shadow-[0_0_60px_-10px_rgba(0,255,255,0.08)]
          p-8
        "
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)",
          }}
        />
        {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"],
          ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(
          ([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-3 h-3 ${border} border-white/15`} />
          )
        )}
        <div className="relative flex items-start justify-between mb-10">
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-white/30 mb-1.5 uppercase">
              Mente.AI Runtime
            </p>
            <h2
              className="text-xl font-bold text-white tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Cognitive Pipeline
            </h2>
            <p className="text-[11px] text-white/40 mt-1 font-mono tracking-wide max-w-md">
              Veja, em tempo real, como a IA cria e valida cada aula antes de chegar até você
            </p>
            {episodeTitle && (
              <p className="text-xs text-white/35 mt-1.5 font-mono tracking-wide truncate max-w-sm">
                {episodeTitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <CostBadge
              iteration={iteration}
              maxIterations={maxIterations}
              cost={cost}
              maxCost={maxCost}
            />
            {onDemo && (
              <button
                onClick={onDemo}
                className="
                  px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase
                  border border-white/10 rounded text-white/30
                  hover:border-[#00FFFF]/30 hover:text-[#00FFFF]/60
                  transition-colors duration-300
                "
              >
                Avançar
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-[22px] left-6 right-6 h-px bg-white/8" />
          <AnimatePresence>
            <motion.div
              key={state}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              className={`absolute top-[22px] left-6 h-px bg-gradient-to-r ${progressColor} origin-left`}
              style={{ width: `calc(${progressPct}% - 1.5rem)` }}
            />
          </AnimatePresence>
          <div className="relative flex justify-between">
            {STATE_FLOW.map((node, idx) => (
              <StateNode
                key={node.state}
                nodeState={node.state}
                label={node.label}
                status={getNodeStatus(node.state, state) as "active" | "completed" | "pending"}
                pulse={getNodeStatus(node.state, state) === "active" && pulse}
                delay={idx * 0.07}
              />
            ))}
          </div>
        </div>
        <div className="relative mt-8 flex items-center gap-3">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                state === "approved" ? "#00FF88"
                : state === "rejected" ? "#ef4444"
                : state === "error"    ? "#f97316"
                : "#00FFFF",
              boxShadow:
                state === "approved" ? "0 0 6px #00FF88"
                : state === "rejected" ? "0 0 6px #ef4444"
                : state === "error"    ? "0 0 6px #f97316"
                : "0 0 6px #00FFFF",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={state}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-mono tracking-wider text-white/40"
            >
              {STATUS_TEXT[state]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const SEQ: OrchestrationState[] = [
  "idle", "generating", "evaluating", "revising", "evaluating", "approved",
];

export function CognitivePipelineDemo() {
  const seq = SEQ;
  const [idx, setIdx]           = useState(0);
  const [iteration, setIter]    = useState(1);
  const [cost, setCost]         = useState(0);

  const advance = useCallback(() => {
    setIdx((prev) => {
      const next = (prev + 1) % seq.length;
      if (seq[next] === "evaluating" && seq[prev] === "generating") setIter((i) => i + 1);
      if (seq[next] === "evaluating") setCost((c) => c + Math.random() * 0.014);
      if (next === 0) { setIter(1); setCost(0); }
      return next;
    });
  }, [seq]);

  useEffect(() => {
    const t = setInterval(advance, 3000);
    return () => clearInterval(t);
  }, [advance]);

  return (
    <CognitivePipeline
      state={seq[idx]}
      iteration={iteration}
      cost={cost}
      maxIterations={3}
      maxCost={0.3}
      episodeTitle="NEXUS T1E3 — O Que é um Agente de IA?"
      onDemo={advance}
    />
  );
}
