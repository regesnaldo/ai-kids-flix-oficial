"use client";

import { motion } from "framer-motion";

interface CostBadgeProps {
  iteration: number;
  maxIterations: number;
  cost: number;
  maxCost: number;
}

export function CostBadge({ iteration, maxIterations, cost = 0, maxCost = 0 }: CostBadgeProps) {
  const overBudget     = cost > maxCost;
  const overIterations = iteration > maxIterations;
  const warning        = overBudget || overIterations;

  const accent = warning ? "text-red-400" : "text-[#00FF88]";
  const border  = warning ? "border-red-500/30" : "border-[#00FF88]/20";
  const bg      = warning ? "bg-red-500/5"      : "bg-[#00FF88]/5";
  const divider = warning ? "bg-red-500/20"     : "bg-[#00FF88]/20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-md border
        font-mono text-xs tracking-wider transition-colors duration-300
        ${bg} ${border} ${accent}
      `}
    >
      {/* Iterations */}
      <div className="flex items-center gap-1.5">
        <span className="text-white/20 text-[10px] tracking-widest">ITER</span>
        <span className={overIterations ? "text-red-400" : ""}>
          {iteration}/{maxIterations}
        </span>
      </div>

      <div className={`w-px h-3.5 ${divider}`} />

      {/* Cost */}
      <div className="flex items-center gap-1.5">
        <span className="text-white/20 text-[10px] tracking-widest">USD</span>
        <span className={overBudget ? "text-red-400" : ""}>
          ${(cost || 0).toFixed(4)}
        </span>
        <span className="text-white/20">/</span>
        <span className="text-white/30">${(maxCost || 0).toFixed(2)}</span>
      </div>

      {warning && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-red-400 text-[10px] tracking-widest"
        >
          LIMITE
        </motion.span>
      )}
    </motion.div>
  );
}
