"use client";

import { motion } from "framer-motion";

interface CostBadgeProps {
  iteration: number;
  maxIterations: number;
  cost: number;
  maxCost: number;
}

export function CostBadge({ iteration, maxIterations, cost = 0, maxCost = 0 }: CostBadgeProps) {
  const overBudget = cost > maxCost;
  const overIterations = iteration > maxIterations;
  const warning = overBudget || overIterations;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-xl border
        text-sm font-mono
        transition-colors duration-300
        ${warning
          ? "bg-red-500/10 border-red-500/30 text-red-300"
          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
        }
      `}
    >
      {/* Iterations */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 text-xs">ITER</span>
        <span className={overIterations ? "text-red-300" : ""}>
          {iteration}/{maxIterations}
        </span>
      </div>

      {/* Divider */}
      <div className={`w-px h-4 ${warning ? "bg-red-500/30" : "bg-emerald-500/30"}`} />

      {/* Cost */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 text-xs">USD</span>
        <span className={overBudget ? "text-red-300" : ""}>
          ${(cost || 0).toFixed(4)}
        </span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-500">${(maxCost || 0).toFixed(2)}</span>
      </div>

      {/* Warning indicator */}
      {warning && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-xs"
        >
          ⚠
        </motion.span>
      )}
    </motion.div>
  );
}
