"use client";

import { useMemo, useState } from "react";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { t } from "@/lib/translations";

type AgentSelectorProps = {
  onSelect: (agentId: string) => void;
  onSkip: () => void;
};

const SUGGESTED_AGENT_IDS = [
  "logos",
  "psyche",
  "philosophical_human_balance",
  "emotional_human_balance",
  "ethical_human_balance",
  "creative_human_balance",
];

function getDimensionEmoji(dimension: string): string {
  if (dimension === "philosophical") return "🧠";
  if (dimension === "emotional") return "💚";
  if (dimension === "ethical") return "⚖️";
  if (dimension === "creative") return "🎨";
  if (dimension === "spiritual") return "🧘";
  if (dimension === "scientific") return "🧪";
  if (dimension === "mystical") return "🔮";
  if (dimension === "practical") return "🛠️";
  if (dimension === "social") return "🤝";
  if (dimension === "aesthetic") return "✨";
  if (dimension === "political") return "🏛️";
  if (dimension === "intellectual") return "📚";
  return "🧠";
}

export default function AgentSelector({ onSelect, onSkip }: AgentSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const suggestedAgents = useMemo(() => {
    const idSet = new Set(SUGGESTED_AGENT_IDS);
    const list = ALL_AGENTS.filter((a) => idSet.has(a.id));
    if (list.length > 0) return list;
    return ALL_AGENTS.slice(0, 6);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl font-bold mb-4">Escolha seu Agente Guia</h2>
          <p className="text-xl text-white/80">Um companheiro para acompanhar sua jornada de autoconhecimento</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {suggestedAgents.map((agent) => {
            const isSelected = selected === agent.id;
            const borderByFaction: Record<string, string> = {
              order: "ring-blue-500/70",
              chaos: "ring-red-500/70",
              balance: "ring-purple-500/70",
            };

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelected(agent.id)}
                className={[
                  "relative text-left rounded-2xl p-1 transition-all duration-300",
                  isSelected ? "bg-white/15 scale-105 ring-2 ring-white/40" : "bg-white/10 hover:bg-white/20",
                ].join(" ")}
              >
                <div className={["bg-gray-900 rounded-xl p-6 h-full", isSelected ? `ring-2 ${borderByFaction[agent.faction] || "ring-white/20"}` : ""].join(" ")}>
                  <div className="h-40 bg-gradient-to-br from-purple-600 via-blue-600 to-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-5xl">{getDimensionEmoji(agent.dimension)}</div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    {t(`dimensions.${agent.dimension}`)} • {t(`levels.${agent.level}`)}
                  </p>
                  <p className="text-sm text-white/80 line-clamp-2">{agent.personality.approach}</p>

                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Selecionado
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
              "px-8 py-4 rounded-full font-semibold text-lg transition",
              selected ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105" : "bg-gray-700 text-gray-400 cursor-not-allowed",
            ].join(" ")}
          >
            Continuar com {selected ? ALL_AGENTS.find((a) => a.id === selected)?.name : "Agente"} ✨
          </button>
          <button
            onClick={onSkip}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition text-white"
          >
            Pular por enquanto
          </button>
        </div>

        <div className="text-center mt-8">
          <a href="/agentes" className="text-purple-400 hover:text-purple-300 transition">
            Ver todos os 120 agentes →
          </a>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          <div className="w-3 h-3 bg-white/40 rounded-full" />
          <div className="w-3 h-3 bg-white rounded-full" />
          <div className="w-3 h-3 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

