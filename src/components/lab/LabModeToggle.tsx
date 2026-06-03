"use client";

import React from "react";
import type { LabMode } from "@/types/lab";

interface LabModeToggleProps {
  mode: LabMode;
  onToggle: () => void;
}

export function LabModeToggle({ mode, onToggle }: LabModeToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <span
        className={`text-xs font-medium transition-colors duration-200 ${
          mode === "fast" ? "text-mente-accent" : "text-mente-muted"
        }`}
      >
        RÁPIDO
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="relative w-12 h-6 rounded-full bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-mente-primary/50"
        role="switch"
        aria-checked={mode === "complete"}
        aria-label="Alternar modo do laboratório"
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            mode === "complete" ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
      <span
        className={`text-xs font-medium transition-colors duration-200 ${
          mode === "complete" ? "text-mente-primary" : "text-mente-muted"
        }`}
      >
        COMPLETO
      </span>
    </div>
  );
}
