// ─── src/components/lab/AgentSelector.tsx ───────────────────────────────────

"use client";

import React from "react";
import type { Agent } from "@/types/agent";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface AgentSelectorProps {
  agents: Agent[];
  activeAgentId: string;
  onSelect: (id: string) => void;
}

/* ─── Mini SVG avatars per agent ─────────────────────────────────────────── */

function AgentAvatar({ id, active }: { id: string; active: boolean }) {
  const size = 36;
  const icons: Record<string, React.ReactNode> = {
    nexus: (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="currentColor" opacity="0.15" />
        <circle cx="18" cy="18" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="18" cy="6" r="2" fill="currentColor" opacity="0.8" />
        <circle cx="28" cy="13" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="8" cy="13" r="1.5" fill="currentColor" opacity="0.4" />
        <circle cx="26" cy="28" r="1.5" fill="currentColor" opacity="0.3" />
        <circle cx="10" cy="27" r="2" fill="currentColor" opacity="0.5" />
        <line x1="18" y1="11" x2="28" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1="18" y1="11" x2="8" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1="18" y1="23" x2="26" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1="18" y1="23" x2="10" y2="27" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
    cipher: (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="6" fill="currentColor" opacity="0.1" />
        <line x1="10" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="10" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1="10" y1="24" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="16" cy="8" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="26" cy="8" r="2" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    kaos: (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="15" fill="currentColor" opacity="0.1" />
        <path d="M10 18Q14 8 18 18Q22 28 28 18" stroke="currentColor" strokeWidth="2" opacity="0.7" fill="none" />
        <circle cx="14" cy="13" r="2.5" fill="currentColor" opacity="0.5" />
        <circle cx="22" cy="23" r="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    aurora: (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="14" fill="currentColor" opacity="0.1" />
        <path d="M4 28Q10 8 18 14Q26 28 32 14" stroke="currentColor" strokeWidth="2" opacity="0.7" fill="none" />
        <circle cx="10" cy="20" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="26" cy="18" r="2.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    volt: (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="currentColor" opacity="0.1" />
        <path d="M18 4L14 16H22L18 32" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" opacity="0.7" fill="none" />
        <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    ethos: (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="8" fill="currentColor" opacity="0.1" />
        <path d="M12 20L16 16M16 16L18 18M16 16L20 12" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <path d="M24 16L20 20M20 20L18 18M20 20L16 24" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <line x1="18" y1="12" x2="18" y2="24" stroke="currentColor" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
        active ? "scale-110 ring-2 ring-offset-1 ring-offset-slate-900" : "scale-90 opacity-60"
      }`}
      style={{ color: "currentColor" }}
    >
      {icons[id] || (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="14" fill="currentColor" opacity="0.15" />
          <circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.5" />
        </svg>
      )}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function AgentSelector({ agents, activeAgentId, onSelect }: AgentSelectorProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-3">
        Especialistas
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist">
        {agents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`Selecionar agente ${agent.name}`}
              onClick={() => onSelect(agent.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50
                ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              style={{
                backgroundColor: isActive ? `${agent.color}15` : "transparent",
                border: `1.5px solid ${isActive ? `${agent.color}50` : "transparent"}`,
              }}
            >
              <AgentAvatar id={agent.id} active={isActive} />
              <span className="hidden sm:inline">{agent.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
