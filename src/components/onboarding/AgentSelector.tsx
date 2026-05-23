"use client";

import { useState } from "react";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { getAgentImage, AGENT_IMAGE_FALLBACK } from "@/lib/getAgentImage";

type AgentSelectorProps = {
  onSelect: (agentId: string) => void;
  onSkip: () => void;
};

const AGENT_COLORS: Record<string, { glow: string; border: string }> = {
  nexus:   { glow: "shadow-cyan-500/60",    border: "border-cyan-500/60" },
  kaos:    { glow: "shadow-red-500/60",     border: "border-red-500/60" },
  cipher:  { glow: "shadow-emerald-500/60", border: "border-emerald-500/60" },
  lyra:    { glow: "shadow-pink-500/60",    border: "border-pink-500/60" },
  axiom:   { glow: "shadow-sky-500/60",     border: "border-sky-500/60" },
  stratos: { glow: "shadow-slate-400/60",   border: "border-slate-400/60" },
  terra:   { glow: "shadow-green-500/60",   border: "border-green-500/60" },
  prism:   { glow: "shadow-violet-500/60",  border: "border-violet-500/60" },
  janus:   { glow: "shadow-yellow-400/60",  border: "border-yellow-400/60" },
  volt:    { glow: "shadow-amber-400/60",   border: "border-amber-400/60" },
  aurora:  { glow: "shadow-rose-400/60",    border: "border-rose-400/60" },
  ethos:   { glow: "shadow-amber-600/60",   border: "border-amber-600/60" },
};

export default function AgentSelector({ onSelect, onSkip }: AgentSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const agents = ALL_AGENTS.slice(0, 12);
  const selectedAgent = agents.find((a) => a.id === selected);

  return (
    <div className="min-h-screen bg-[#07070f] py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-cyan-400/70 uppercase mb-3">Metaverso MENTE.AI</p>
          <h2 className="text-5xl font-black mb-4 text-white">
            Escolha seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Agente Guia</span>
          </h2>
          <p className="text-lg text-white/50">Quem vai acompanhar sua jornada no metaverso?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {agents.map((agent) => {
            const isSelected = selected === agent.id;
            const colors = AGENT_COLORS[agent.id] ?? { glow: "shadow-purple-500/60", border: "border-purple-500/60" };

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelected(agent.id)}
                className={[
                  "relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group border",
                  isSelected
                    ? `${colors.border} shadow-xl ${colors.glow} scale-105`
                    : "border-white/10 hover:border-white/30 hover:scale-102",
                ].join(" ")}
              >
                <div className="relative h-52 bg-[#0f0f1a]">
                  <img
                    src={getAgentImage(agent.id)}
                    alt={agent.name}
                    onError={(e) => { e.currentTarget.src = AGENT_IMAGE_FALLBACK }}
                    className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/20 to-transparent" />
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10">
                      ✓ Selecionado
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#0f0f1a]">
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{agent.name}</h3>
                  <p className="text-xs text-white/40 line-clamp-2">{agent.personality.approach.slice(0, 70)}...</p>
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
              "px-10 py-4 rounded-full font-bold text-lg transition-all duration-300",
              selected
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105 shadow-lg shadow-purple-500/30"
                : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10",
            ].join(" ")}
          >
            {selected ? `Entrar com ${selectedAgent?.name} →` : "Selecione um agente"}
          </button>
          <button
            onClick={onSkip}
            className="px-10 py-4 bg-transparent border border-white/20 rounded-full font-semibold text-lg hover:bg-white/5 transition text-white/50"
          >
            Pular
          </button>
        </div>

      </div>
    </div>
  );
}

