"use client";

import { motion } from "framer-motion";
import {
  Pause,
  Zap,
  ScanSearch,
  GitBranch,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export type NodeStatus = "completed" | "active" | "pending";

export type NodeState =
  | "idle"
  | "generating"
  | "evaluating"
  | "revising"
  | "approved"
  | "rejected"
  | "error";

interface StateNodeProps {
  nodeState: NodeState;
  label: string;
  status: NodeStatus;
  pulse: boolean;
  delay: number;
}

const ICONS: Record<NodeState, React.FC<{ size?: number; strokeWidth?: number }>> = {
  idle:       (p) => <Pause       {...p} />,
  generating: (p) => <Zap         {...p} />,
  evaluating: (p) => <ScanSearch  {...p} />,
  revising:   (p) => <GitBranch   {...p} />,
  approved:   (p) => <CheckCircle {...p} />,
  rejected:   (p) => <XCircle     {...p} />,
  error:      (p) => <AlertTriangle {...p} />,
};

const COLOR: Record<NodeStatus, { border: string; bg: string; icon: string; glow: string; label: string }> = {
  active:    {
    border: "border-[#00FFFF]",
    bg:     "bg-[#00FFFF]/10",
    icon:   "text-[#00FFFF]",
    glow:   "shadow-[0_0_16px_2px_rgba(0,255,255,0.35)]",
    label:  "text-[#00FFFF]",
  },
  completed: {
    border: "border-[#00FF88]",
    bg:     "bg-[#00FF88]/10",
    icon:   "text-[#00FF88]",
    glow:   "",
    label:  "text-[#00FF88]",
  },
  pending:   {
    border: "border-white/10",
    bg:     "bg-transparent",
    icon:   "text-white/20",
    glow:   "",
    label:  "text-white/20",
  },
};

const TERMINAL_OVERRIDE: Partial<Record<NodeState, typeof COLOR.active>> = {
  approved: {
    border: "border-[#00FF88]",
    bg:     "bg-[#00FF88]/10",
    icon:   "text-[#00FF88]",
    glow:   "shadow-[0_0_16px_2px_rgba(0,255,136,0.35)]",
    label:  "text-[#00FF88]",
  },
  rejected: {
    border: "border-red-500",
    bg:     "bg-red-500/10",
    icon:   "text-red-400",
    glow:   "shadow-[0_0_16px_2px_rgba(239,68,68,0.35)]",
    label:  "text-red-400",
  },
  error: {
    border: "border-orange-500",
    bg:     "bg-orange-500/10",
    icon:   "text-orange-400",
    glow:   "shadow-[0_0_16px_2px_rgba(249,115,22,0.35)]",
    label:  "text-orange-400",
  },
};

export function StateNode({ nodeState, label, status, pulse, delay }: StateNodeProps) {
  const Icon = ICONS[nodeState];
  const base = status === "active" && TERMINAL_OVERRIDE[nodeState]
    ? TERMINAL_OVERRIDE[nodeState]!
    : COLOR[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-2.5 z-10"
    >
      <motion.div
        animate={status === "active" ? { scale: pulse ? 1.12 : 1 } : { scale: 1 }}
        transition={{ duration: 0.35 }}
        className={`
          w-11 h-11 rounded-full flex items-center justify-center
          border transition-all duration-500
          ${base.border} ${base.bg} ${base.glow}
        `}
      >
        <Icon size={18} strokeWidth={1.5} />
      </motion.div>
      <span
        className={`
          text-[10px] font-medium tracking-widest uppercase
          transition-colors duration-500 font-mono
          ${base.label}
        `}
      >
        {label}
      </span>
    </motion.div>
  );
}
