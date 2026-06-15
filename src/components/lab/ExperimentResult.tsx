"use client";

import { motion } from "framer-motion";
import { Download, Trophy } from "lucide-react";
import type { AgentResult } from "@/hooks/useExperimentEngine";

interface ExperimentResultProps {
  topic: string;
  agentOutputs: Record<string, AgentResult>;
  boardFacts: string[];
  rollbackUsed: boolean;
  onExport: () => void;
}

const AGENT_NAMES: Record<string, string> = {
  nexus: "NEXUS",
  cipher: "CIPHER",
  kaos: "KAOS",
  aurora: "AURORA",
};

export function ExperimentResult({
  topic,
  agentOutputs,
  boardFacts,
  rollbackUsed,
  onExport,
}: ExperimentResultProps) {
  const auroraOutput = agentOutputs["aurora"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl p-5 space-y-4"
      style={{
        background: "rgba(14, 20, 32, 0.9)",
        border: "1px solid rgba(0,245,255,0.12)",
        boxShadow: "0 0 40px rgba(0,245,255,0.05)",
      }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-3xl mb-2"
        >
          🧪
        </motion.div>
        <h3
          className="text-base font-black tracking-tight mb-1"
          style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-display)" }}
        >
          EXPERIMENTO CONCLUÍDO
        </h3>
        <p className="text-white/30 text-xs">Tema: {topic}</p>
      </div>

      {/* XP Award */}
      <div
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full mx-auto w-fit"
        style={{
          background: "rgba(0,245,255,0.06)",
          border: "1px solid rgba(0,245,255,0.1)",
        }}
      >
        <Trophy size={14} style={{ color: "var(--accent-cyan)" }} />
        <span className="text-xs font-bold" style={{ color: "var(--accent-cyan)" }}>
          +{15 + (rollbackUsed ? 5 : 0)} XP
        </span>
        {rollbackUsed && (
          <span className="text-[9px] text-white/20">(inclui +5 bônus rollback)</span>
        )}
      </div>

      {/* Aurora synthesis */}
      {auroraOutput && (
        <div
          className="p-4 rounded-xl text-sm leading-relaxed"
          style={{
            background: "rgba(167,139,250,0.04)",
            border: "1px solid rgba(167,139,250,0.1)",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <p
            className="text-[9px] font-mono uppercase tracking-[0.2em] mb-2"
            style={{ color: "#a78bfa" }}
          >
            ✨ SÍNTESE DE AURORA
          </p>
          <p className="whitespace-pre-wrap">{auroraOutput.narrative}</p>
        </div>
      )}

      {/* Export button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExport}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300"
          style={{
            background: "var(--accent-cyan)",
            color: "#0e1420",
            boxShadow: "0 0 20px rgba(0,245,255,0.15)",
          }}
        >
          <Download size={14} />
          Exportar como relatório
        </motion.button>
      </div>
    </motion.div>
  );
}
