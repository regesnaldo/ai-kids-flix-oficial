"use client";

import { useState } from "react";
import { ALL_AGENTS } from "@/canon/agents/all-agents";

type AgentSelectorProps = {
  onSelect: (agentId: string) => void;
  onSkip: () => void;
};

const AGENT_COLORS: Record<string, { bg: string; glow: string; emoji: string }> = {
  nexus:   { bg: "from-blue-600 to-cyan-500",    glow: "shadow-blue-500/50",   emoji: "🔗" },
  kaos:    { bg: "from-red-600 to-orange-500",   glow: "shadow-red-500/50",    emoji: "🌀" },
  cipher:  { bg: "from-green-700 to-emerald-500",glow: "shadow-green-500/50",  emoji: "🔐" },
  lyra:    { bg: "from-pink-500 to-purple-500",  glow: "shadow-pink-500/50",   emoji: "🎵" },
  axiom:   { bg: "from-sky-600 to-blue-400",     glow: "shadow-sky-500/50",    emoji: "🔬" },
  stratos: { bg: "from-slate-600 to-blue-700",   glow: "shadow-slate-500/50",  emoji: "♟️" },
  terra:   { bg: "from-green-600 to-teal-500",   glow: "shadow-green-500/50",  emoji: "🌿" },
  prism:   { bg: "from-violet-600 to-fuchsia-500",glow: "shadow-violet-500/50",emoji: "🔮" },
  janus:   { bg: "from-yellow-500 to-orange-400",glow: "shadow-yellow-500/50", emoji: "🃏" },
  volt:    { bg: "from-yellow-400 to-amber-500", glow: "shadow-yellow-400/50", emoji: "⚡" },
  aurora:  { bg: "from-pink-400 to-rose-500",    glow: "shadow-pink-400/50",   emoji: "🌅" },
  ethos:   { bg: "from-amber-600 to-yellow-500", glow: "shadow-amber-500/50",  emoji: "⚖️" },
};

export default function AgentSelector({ onSelect, onSkip }: AgentSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const agents = ALL_AGENTS.slice(0, 12);

  const selectedAgent = agents.find((a) => a.id === selected);

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center text-white mb-10">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Escolha seu Agente Guia
          </h2>
          <p className="text-lg text-white/60">Quem vai acompanhar sua jornada no metaverso?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {agents.map((agent) => {
            const isSelected = selected === agent.id;
            const colors = AGENT_COLORS[agent.id] ?? { bg: "from-purple-600 to-blue-600", glow: "shadow-purple-500/50", emoji: "🧠" };

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelected(agent.id)}
                className={[
                  "relative rounded-2xl p-[2px] transition-all duration-300 cursor-pointer",
                  isSelected
                    ? `bg-gradient-to-br ${colors.bg} shadow-lg ${colors.glow} scale-105`
                    : "bg-white/10 hover:bg-white/20 hover:scale-102",
                ].join(" ")}
              >
                <div className="bg-[#0f0f1a] rounded-2xl p-4 h-full text-left">
                  <div className={`h-24 bg-gradient-to-br ${colors.bg} rounded-xl mb-3 flex items-center justify-center shadow-lg ${colors.glow}`}>
                    <span className="text-4xl">{colors.emoji}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{agent.name}</h3>
                  <p className="text-xs text-white/50 line-clamp-2">{agent.personality.approach.slice(0, 60)}...</p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className={[
              "px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300",
              selected
                ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:scale-105 shadow-lg shadow-purple-500/30"
                : "bg-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            {selected ? `Continuar com ${selectedAgent?.name} ✨` : "Selecione um agente"}
          </button>
          <button
            onClick={onSkip}
            className="px-8 py-4 bg-white/5 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 transition text-white/70"
          >
            Pular por enquanto
          </button>
        </div>

        <div className="text-center mt-6">
          <a href="/agentes" className="text-purple-400/60 hover:text-purple-300 transition text-sm">
            Ver todos os 12 agentes →
          </a>
        </div>

      </div>
    </div>
  );
}

