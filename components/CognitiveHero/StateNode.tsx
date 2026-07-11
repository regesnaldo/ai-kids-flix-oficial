"use client";

import { motion } from "framer-motion";

export type NodeStatus = "completed" | "active" | "pending" | "terminal";

interface StateNodeProps {
  icon: string;
  label: string;
  status: NodeStatus;
  pulse: boolean;
  delay: number;
}

export function StateNode({ icon, label, status, pulse, delay }: StateNodeProps) {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isPending = status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-2 z-10"
    >
      {/* Circle */}
      <motion.div
        animate={isActive ? { scale: pulse ? 1.15 : 1 } : {}}
        transition={{ duration: 0.4 }}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center text-xl
          border-2 transition-all duration-500
          ${isCompleted
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
            : isActive
            ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/20"
            : "bg-white/5 border-white/10 text-gray-600"
          }
        `}
      >
        {icon}
      </motion.div>

      {/* Label */}
      <span
        className={`
          text-xs font-medium whitespace-nowrap transition-colors duration-500
          ${isCompleted ? "text-emerald-400" : isActive ? "text-blue-300" : "text-gray-600"}
        `}
      >
        {label}
      </span>
    </motion.div>
  );
}
