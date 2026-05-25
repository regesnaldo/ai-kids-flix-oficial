"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Lightbulb, Undo2, RotateCcw } from "lucide-react";
import type { ExperimentPhase } from "@/hooks/useExperimentEngine";

interface HumanInterventionProps {
  phase: ExperimentPhase;
  history: Array<{ agent: string; facts: string[]; timestamp: number }>;
  onPause: () => void;
  onResume: () => void;
  onInjectIdea: (idea: string) => void;
  onRollback: (targetStep: number, injectIdea?: string) => void;
}

export function HumanIntervention({
  phase,
  history,
  onPause,
  onResume,
  onInjectIdea,
  onRollback,
}: HumanInterventionProps) {
  const [ideaInput, setIdeaInput] = useState("");
  const [showRollback, setShowRollback] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const handleInject = () => {
    const idea = ideaInput.trim();
    if (!idea) return;
    onInjectIdea(idea);
    setIdeaInput("");
  };

  const handleRollback = () => {
    if (selectedStep === null) return;
    const idea = ideaInput.trim() || undefined;
    onRollback(selectedStep, idea);
    setShowRollback(false);
    setSelectedStep(null);
    setIdeaInput("");
  };

  const isRunning = phase === "running";
  const isPaused = phase === "paused";
  const isComplete = phase === "complete";

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "rgba(14, 20, 32, 0.8)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <p
        className="text-[9px] font-mono uppercase tracking-[0.25em] mb-3"
        style={{ color: "var(--accent-cyan)" }}
      >
        🎮 INTERVENÇÃO HUMANA
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {/* Pause / Resume */}
        {!isComplete && (
          <button
            onClick={isRunning ? onPause : onResume}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 hover:brightness-125"
            style={{
              background: isRunning
                ? "rgba(255,107,53,0.1)"
                : "rgba(0,255,136,0.1)",
              color: isRunning ? "#ff6b35" : "#00ff88",
              border: `1px solid ${isRunning ? "rgba(255,107,53,0.2)" : "rgba(0,255,136,0.2)"}`,
            }}
          >
            {isRunning ? <Pause size={11} /> : <Play size={11} />}
            {isRunning ? "Pausar" : "Continuar"}
          </button>
        )}

        {/* Inject idea */}
        {!isComplete && (
          <button
            onClick={() => {
              if (ideaInput.trim()) handleInject();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 hover:brightness-125"
            style={{
              background: "rgba(167,139,250,0.1)",
              color: "#a78bfa",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            <Lightbulb size={11} />
            Injetar ideia
          </button>
        )}

        {/* Rollback */}
        {history.length > 0 && (
          <button
            onClick={() => setShowRollback(!showRollback)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 hover:brightness-125"
            style={{
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Undo2 size={11} />
            Voltar passo
          </button>
        )}
      </div>

      {/* Idea input */}
      {!isComplete && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInject()}
            placeholder="Injete uma ideia no experimento..."
            className="flex-1 px-3 py-1.5 rounded-full text-[10px] outline-none transition-all duration-200 focus:border-[var(--accent-cyan)]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)",
            }}
          />
        </div>
      )}

      {/* Rollback selector */}
      {showRollback && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 pt-2 border-t border-white/[0.04]"
        >
          <p className="text-[9px] text-white/25 mb-2 font-mono uppercase tracking-wider">
            ⏮️ SELECIONE O PASSO PARA VOLTAR
          </p>
          <div className="space-y-1 mb-2 max-h-[120px] overflow-y-auto">
            {history.map((step, i) => (
              <button
                key={i}
                onClick={() => setSelectedStep(i)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] transition-all duration-150 ${
                  selectedStep === i ? "brightness-125" : ""
                }`}
                style={{
                  background:
                    selectedStep === i
                      ? "rgba(0,245,255,0.08)"
                      : "rgba(255,255,255,0.02)",
                  border:
                    selectedStep === i
                      ? "1px solid rgba(0,245,255,0.2)"
                      : "1px solid transparent",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <span className="text-white/25 mr-2">Passo {i + 1}</span>
                <span
                  className="uppercase font-bold"
                  style={{
                    color:
                      step.agent === "nexus"
                        ? "#00f5ff"
                        : step.agent === "cipher"
                        ? "#00ff88"
                        : step.agent === "kaos"
                        ? "#ff6b35"
                        : step.agent === "aurora"
                        ? "#a78bfa"
                        : "#fff",
                  }}
                >
                  {step.agent}
                </span>
                <span className="text-white/15 ml-2">
                  {step.facts.length} descobertas
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={handleRollback}
            disabled={selectedStep === null}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 disabled:opacity-30"
            style={{
              background: "rgba(167,139,250,0.1)",
              color: "#a78bfa",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            <RotateCcw size={11} />
            Confirmar rollback
          </button>
        </motion.div>
      )}
    </div>
  );
}
