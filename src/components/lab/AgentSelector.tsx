"use client";

import React from "react";
import type { Agent } from "@/types/agent";

interface AgentSelectorProps {
  agents: Agent[];
  activeAgentId: string;
  onSelect: (id: string) => void;
}

const AGENT_MARKS: Record<string, string> = {
  nexus: "◉",
  cipher: "⌘",
  kaos: "〰",
  aurora: "✦",
  volt: "ϟ",
  ethos: "◈",
};

export function AgentSelector({ agents, activeAgentId, onSelect }: AgentSelectorProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/70">Conheça seus especialistas</p>
          <p className="mt-1 text-sm text-slate-400">Selecione quem conduzirá seu experimento.</p>
        </div>
        <span className="hidden text-xs text-cyan-100/60 sm:block">{agents.length} especialistas prontos</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" role="tablist">
        {agents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Selecionar especialista ${agent.name}`}
              onClick={() => onSelect(agent.id)}
              className={`group relative min-h-52 overflow-hidden rounded-2xl text-left text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.34)] focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${isActive ? "text-white" : "text-slate-300 hover:text-white"}`}
              style={{
                backgroundColor: "rgba(15,23,42,0.52)",
                border: `1.5px solid ${isActive ? `${agent.color}90` : "rgba(148,163,184,0.16)"}`,
              }}
            >
              <img src={`/images/agentes/${agent.id}.png`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/35 to-transparent" />
              <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/35 text-lg backdrop-blur-sm" style={{ color: agent.color }}>
                {AGENT_MARKS[agent.id] ?? "◉"}
              </div>
              {isActive && <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: agent.color }} />}
              <div className="relative flex min-h-52 flex-col justify-end p-4">
                <span className="text-base font-bold">{agent.name}</span>
                <span className="mt-1 line-clamp-2 text-[11px] font-normal leading-snug text-slate-200/80">{agent.expertise}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
