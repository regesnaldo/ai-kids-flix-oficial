// ─── src/components/lab/LabModeToggle.tsx ───────────────────────────────────

"use client";

import React from "react";
import { Zap, Microscope } from "lucide-react";
import type { LabMode } from "@/types/lab";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface LabModeToggleProps {
  mode: LabMode;
  onToggle: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function LabModeToggle({ mode, onToggle }: LabModeToggleProps) {
  const baseClasses =
    "flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50";

  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
        Modo de resposta
      </span>
      <div className="flex bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 gap-1">
        {/* Fast */}
        <button
          type="button"
          onClick={mode !== "fast" ? onToggle : undefined}
          className={`${baseClasses} ${
            mode === "fast"
              ? "bg-violet-600/30 text-white shadow-lg shadow-violet-500/10"
              : "bg-transparent text-slate-400 hover:text-slate-200"
          }`}
          aria-pressed={mode === "fast"}
        >
          <Zap size={16} className={mode === "fast" ? "text-amber-400" : "text-slate-500"} />
          Rápido
        </button>

        {/* Complete */}
        <button
          type="button"
          onClick={mode !== "complete" ? onToggle : undefined}
          className={`${baseClasses} ${
            mode === "complete"
              ? "bg-violet-600/30 text-white shadow-lg shadow-violet-500/10"
              : "bg-transparent text-slate-400 hover:text-slate-200"
          }`}
          aria-pressed={mode === "complete"}
        >
          <Microscope size={16} className={mode === "complete" ? "text-cyan-400" : "text-slate-500"} />
          Completo
        </button>
      </div>
    </div>
  );
}
