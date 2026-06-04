// ─── src/components/lab/LabHero.tsx ────────────────────────────────────────

"use client";

import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import type { Agent } from "@/types/agent";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface LabHeroProps {
  activeAgent: Agent | undefined;
  agentCount: number;
  mode: string;
  onSend: (question: string) => void;
  isLoading: boolean;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function LabHero({ activeAgent, agentCount, mode, onSend, isLoading }: LabHeroProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue("");
    }
  };

  const agentColor = activeAgent?.color ?? "#7C3AED";

  return (
    <section className="text-center mb-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
        O que você quer descobrir hoje?
      </h1>
      <p className="text-slate-400 text-sm md:text-base mb-8 max-w-lg mx-auto">
        Escolha um especialista e faça sua pergunta sobre IA
      </p>

      {/* Large centralized input */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            activeAgent
              ? `Pergunte para ${activeAgent.name}...`
              : "Digite sua pergunta sobre IA..."
          }
          className="w-full pl-14 pr-14 py-4 md:py-5 bg-slate-900 border-2 border-slate-800 rounded-2xl text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-slate-600 transition-all"
        />
        {value.trim() && (
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: isLoading ? "rgba(148,163,184,0.1)" : `${agentColor}20`,
              color: isLoading ? "#64748B" : agentColor,
            }}
          >
            <ArrowRight size={20} />
          </button>
        )}
      </form>

      {/* Agent count hint */}
      {!activeAgent && (
        <p className="mt-4 text-xs text-slate-500">
          {agentCount} especialistas prontos para responder · modo{" "}
          {mode === "fast" ? "rápido" : "profundo"}
        </p>
      )}
    </section>
  );
}
