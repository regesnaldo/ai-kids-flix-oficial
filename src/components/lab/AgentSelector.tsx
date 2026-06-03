"use client";

import React from "react";
import type { Agent } from "@/types/agent";

interface AgentSelectorProps {
  agents: Agent[];
  activeAgentId: string;
  onSelect: (id: string) => void;
}

export function AgentSelector({ agents, activeAgentId, onSelect }: AgentSelectorProps) {
  return (
    <div>
      <p className="text-xs font-medium text-mente-muted uppercase tracking-wider mb-3">
        Especialistas
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" role="tablist">
        {agents.map((agent) => {
          const isActive = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              role="tab"
              aria-selected={isActive}
              aria-label={`Selecionar agente ${agent.name}`}
              onClick={() => onSelect(agent.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mente-primary/50
                ${isActive ? "text-white shadow-sm" : "text-mente-muted hover:text-mente-text"}
              `}
              style={{
                backgroundColor: isActive ? `${agent.color}18` : "transparent",
                border: `1px solid ${isActive ? `${agent.color}50` : "rgba(148,163,184,0.2)"}`,
                color: isActive ? agent.color : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: agent.color }}
              />
              <span className="hidden sm:inline">{agent.name}</span>
              <span className="sm:hidden text-xs">{agent.name.slice(0, 4)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
