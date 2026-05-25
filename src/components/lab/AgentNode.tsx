"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

export type AgentNodeStatus = "waiting" | "active" | "completed" | "error";

const AGENT_META: Record<string, { emoji: string; label: string; role: string; color: string }> = {
  nexus: { emoji: "🧬", label: "NEXUS", role: "O Conector", color: "#00f5ff" },
  cipher: { emoji: "🔍", label: "CIPHER", role: "O Criptógrafo", color: "#00ff88" },
  kaos: { emoji: "⚡", label: "KAOS", role: "O Caos Criativo", color: "#ff6b35" },
  aurora: { emoji: "✨", label: "AURORA", role: "A Sintetizadora", color: "#a78bfa" },
};

interface AgentNodeProps {
  agentId: string;
  status: AgentNodeStatus;
  onClick?: () => void;
  onRetry?: () => void;
}

export function AgentNode({ agentId, status, onClick, onRetry }: AgentNodeProps) {
  const meta = AGENT_META[agentId] ?? {
    emoji: "🤖",
    label: agentId.toUpperCase(),
    role: "",
    color: "#888",
  };

  const borderStyle = (() => {
    switch (status) {
      case "active":
        return `2px solid ${meta.color}`;
      case "completed":
        return `2px solid ${meta.color}`;
      case "error":
        return "2px solid #ef4444";
      default:
        return `1.5px dashed rgba(255,255,255,0.15)`;
    }
  })();

  const bgStyle = (() => {
    switch (status) {
      case "active":
        return `${meta.color}10`;
      case "completed":
        return `${meta.color}08`;
      case "error":
        return "rgba(239,68,68,0.08)";
      default:
        return "rgba(255,255,255,0.02)";
    }
  })();

  return (
    <motion.div
      animate={{
        borderColor: status === "active" ? meta.color : undefined,
        boxShadow:
          status === "active"
            ? `0 0 16px ${meta.color}20, 0 0 32px ${meta.color}10`
            : status === "completed"
            ? `0 0 4px ${meta.color}15`
            : "none",
      }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer select-none min-w-[100px]"
      style={{
        background: bgStyle,
        border: borderStyle,
        opacity: status === "waiting" ? 0.5 : 1,
      }}
      onClick={onClick}
    >
      {/* Status icon */}
      <div className="absolute -top-2 -right-2">
        {status === "active" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          >
            <Loader2 size={14} style={{ color: meta.color }} />
          </motion.div>
        )}
        {status === "completed" && <CheckCircle2 size={14} style={{ color: meta.color }} />}
        {status === "error" && <AlertTriangle size={14} style={{ color: "#ef4444" }} />}
      </div>

      {/* Emoji */}
      <motion.span
        className="text-2xl"
        animate={status === "active" ? { scale: [1, 1.15, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        {meta.emoji}
      </motion.span>

      {/* Label */}
      <span
        className="text-[11px] font-bold tracking-wide"
        style={{ color: status === "waiting" ? "rgba(255,255,255,0.3)" : meta.color }}
      >
        {meta.label}
      </span>

      {/* Role */}
      <span className="text-[9px] text-white/25">{meta.role}</span>

      {/* Retry button on error */}
      {status === "error" && onRetry && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          className="mt-1 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold transition-colors hover:brightness-125"
          style={{
            background: "rgba(239,68,68,0.12)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <RefreshCw size={9} />
          Reexecutar
        </button>
      )}
    </motion.div>
  );
}
