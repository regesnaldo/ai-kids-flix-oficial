"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StateNode } from "./CognitiveHero/StateNode";
import { CostBadge } from "./CognitiveHero/CostBadge";
import type { NodeStatus } from "./CognitiveHero/StateNode";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OrchestrationState =
  | "idle" | "generating" | "evaluating" | "revising"
  | "approved" | "rejected" | "error";

export interface CognitiveHeroProps {
  state: OrchestrationState;
  iteration: number;
  cost: number;
  maxIterations: number;
  maxCost: number;
  episodeTitle?: string;
  onDemo?: () => void;
}

// ---------------------------------------------------------------------------
// State flow order (left to right in timeline)
// ---------------------------------------------------------------------------

const STATE_FLOW: { state: OrchestrationState; label: string; icon: string }[] = [
  { state: "idle",       label: "Idle",      icon: "⏸" },
  { state: "generating", label: "Generate",  icon: "⚡" },
  { state: "evaluating", label: "Evaluate",  icon: "🔍" },
  { state: "revising",   label: "Refine",    icon: "🔄" },
  { state: "approved",   label: "Approved",  icon: "✅" },
  { state: "rejected",   label: "Rejected",  icon: "❌" },
  { state: "error",      label: "Error",     icon: "⚠️" },
];

function stateIndex(s: OrchestrationState): number {
  return STATE_FLOW.findIndex((n) => n.state === s);
}

function getNodeStatus(nodeState: OrchestrationState, current: OrchestrationState): NodeStatus {
  if (current === "approved" && nodeState === "approved") return "active";
  if (current === "rejected" && nodeState === "rejected") return "active";
  if (current === "error" && nodeState === "error") return "active";
  const ni = stateIndex(nodeState);
  const ci = stateIndex(current);
  if (ni < ci) return "completed";
  if (ni === ci) return "active";
  return "pending";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CognitiveHero({
  state, iteration, cost, maxIterations, maxCost, episodeTitle, onDemo,
}: CognitiveHeroProps) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 800);
    return () => clearInterval(t);
  }, []);

  const progressPct = Math.min(100, (stateIndex(state) / (STATE_FLOW.length - 1)) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Cognitive Pipeline</h2>
            {episodeTitle && <p className="text-sm text-gray-400 mt-1 truncate max-w-md">{episodeTitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            <CostBadge iteration={iteration} maxIterations={maxIterations} cost={cost} maxCost={maxCost} />
            {onDemo && (
              <button onClick={onDemo} className="px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-gray-300 transition-colors duration-200">
                Demo
              </button>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/10" />
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 origin-left"
              style={{ width: `${progressPct}%` }}
            />
          </AnimatePresence>
          <div className="relative flex justify-between">
            {STATE_FLOW.map((node, idx) => (
              <StateNode
                key={node.state}
                icon={node.icon}
                label={node.label}
                status={getNodeStatus(node.state, state)}
                pulse={getNodeStatus(node.state, state) === "active" && pulse}
                delay={idx * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Status text */}
        <div className="relative mt-6 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={state}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-gray-400"
            >
              {state === "idle" && "Awaiting generation request..."}
              {state === "generating" && "AI agent is creating content..."}
              {state === "evaluating" && "VERITAS is verifying quality..."}
              {state === "revising" && "Refining based on evaluation feedback..."}
              {state === "approved" && "✅ Content approved and published"}
              {state === "rejected" && "❌ Content flagged for human review"}
              {state === "error" && "⚠️ An error occurred during processing"}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo wrapper
// ---------------------------------------------------------------------------

export function CognitiveHeroDemo() {
  const states: OrchestrationState[] = ["idle","generating","evaluating","revising","evaluating","approved"];
  const [idx, setIdx] = useState(0);
  const [iteration, setIteration] = useState(1);
  const [cost, setCost] = useState(0);

  const advance = useCallback(() => {
    setIdx((prev) => {
      const next = (prev + 1) % states.length;
      if (states[next] === "evaluating" && states[prev] === "generating") setIteration((i) => i + 1);
      if (states[next] === "evaluating") setCost((c) => c + Math.random() * 0.015);
      if (next === 0) { setIteration(1); setCost(0); }
      return next;
    });
  }, []);

  useEffect(() => { const t = setInterval(advance, 3000); return () => clearInterval(t); }, [advance]);

  return (
    <CognitiveHero
      state={states[idx]} iteration={iteration} cost={cost}
      maxIterations={3} maxCost={0.3}
      episodeTitle="Newton's Laws of Motion — Grade 9 Physics"
      onDemo={advance}
    />
  );
}
