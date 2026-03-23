"use client";

import { useEffect, useMemo, useState } from "react";
import { BookMarked, Sparkles } from "lucide-react";

import type { Agent } from "@/data/agents";
import { agents } from "@/data/agents";
import InfiniteShelves from "@/components/biblioteca/InfiniteShelves";
import LivingBook from "@/components/biblioteca/LivingBook";
import BookModal from "@/components/biblioteca/BookModal";

type FloorConfig = {
  floor: string;
  season: string;
  seasonSlug: "fundamentos" | "linguagens" | "criacao" | "inovacao";
  colorClass: string;
  accentClass: string;
  level: Agent["level"];
};

const FLOOR_CONFIG: FloorConfig[] = [
  {
    floor: "Térreo",
    season: "Fundamentos",
    seasonSlug: "fundamentos",
    colorClass: "text-blue-300",
    accentClass: "bg-blue-500/35",
    level: "Fundamentos",
  },
  {
    floor: "1º Andar",
    season: "Linguagens",
    seasonSlug: "linguagens",
    colorClass: "text-emerald-300",
    accentClass: "bg-emerald-500/35",
    level: "Intermediário",
  },
  {
    floor: "2º Andar",
    season: "Criação",
    seasonSlug: "criacao",
    colorClass: "text-orange-300",
    accentClass: "bg-orange-500/35",
    level: "Avançado",
  },
  {
    floor: "3º Andar",
    season: "Inovação",
    seasonSlug: "inovacao",
    colorClass: "text-purple-300",
    accentClass: "bg-purple-500/35",
    level: "Mestre",
  },
];

interface BibliotecaVivaClientProps {
  initialSeason?: string | null;
  initialAgent?: string | null;
}

export default function BibliotecaVivaClient({
  initialSeason,
  initialAgent,
}: BibliotecaVivaClientProps) {
  const [selectedBook, setSelectedBook] = useState<Agent | null>(null);
  const [highlightedAgentId, setHighlightedAgentId] = useState<string | null>(null);

  const nexusSuggestions = useMemo(() => {
    if (!selectedBook) {
      return [];
    }

    return agents
      .filter(
        (agent) =>
          agent.level === selectedBook.level && agent.id !== selectedBook.id,
      )
      .slice(0, 3);
  }, [selectedBook]);

  useEffect(() => {
    if (!initialSeason) {
      return;
    }

    const floor = FLOOR_CONFIG.find((item) => item.seasonSlug === initialSeason);
    if (!floor) {
      return;
    }

    const floorElement = document.getElementById(floor.seasonSlug);
    floorElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initialSeason]);

  useEffect(() => {
    if (!initialAgent) {
      return;
    }

    const target = agents.find((agent) => agent.id === initialAgent);
    if (!target) {
      return;
    }

    setHighlightedAgentId(target.id);

    const timer = window.setTimeout(() => {
      const card = document.querySelector<HTMLElement>(`[data-agent-id="${target.id}"]`);
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      setSelectedBook(target);
    }, 450);

    const clearHighlight = window.setTimeout(() => {
      setHighlightedAgentId(null);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearHighlight);
    };
  }, [initialAgent]);

  return (
    <>
      <main className="relative min-h-screen bg-[#05070e] px-4 py-10 text-white md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.22),transparent_38%),radial-gradient(circle_at_83%_12%,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_74%_84%,rgba(147,51,234,0.2),transparent_42%)]" />
        <div className="relative mx-auto w-full max-w-7xl">
          <header className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">
              A Biblioteca que Respira
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Biblioteca Viva
            </h1>
            <p className="mt-3 text-sm text-gray-300 md:text-base">
              Quatro temporadas em andares conectados pelo NEXUS. Cada livro
              vivo abre com resumo, guia e ações.
            </p>
          </header>

          <section className="mt-8 grid gap-6">
            {FLOOR_CONFIG.map((floor) => {
              const floorAgents = agents.filter(
                (agent) => agent.level === floor.level,
              );

              return (
                <section id={floor.seasonSlug} key={floor.level} className="scroll-mt-24">
                  <InfiniteShelves tone={floor.seasonSlug}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        {floor.floor}
                      </p>
                      <h2 className={`text-xl font-bold ${floor.colorClass}`}>
                        Temporada: {floor.season}
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-gray-200">
                      {floorAgents.length} agentes guias
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {floorAgents.map((agent) => (
                      <LivingBook
                        key={agent.id}
                        agent={agent}
                        accentClass={floor.accentClass}
                        onOpen={setSelectedBook}
                        highlighted={highlightedAgentId === agent.id}
                      />
                    ))}
                  </div>
                  </InfiniteShelves>
                </section>
              );
            })}
          </section>

          <aside className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1325]/65 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <h3 className="text-sm font-semibold text-cyan-200">
                Conexões sugeridas pelo NEXUS
              </h3>
            </div>
            {nexusSuggestions.length > 0 ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                {nexusSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-200"
                  >
                    {suggestion.technicalName} &quot;{suggestion.nickname}&quot;
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-gray-400">
                <BookMarked className="h-3.5 w-3.5" />
                Abra um livro para ver conexões relacionadas.
              </p>
            )}
          </aside>
        </div>
      </main>

      <BookModal
        isOpen={selectedBook !== null}
        agent={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
