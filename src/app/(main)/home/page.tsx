'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import HeroBanner from '@/components/home/HeroBanner';
import AgentRow from '@/components/home/AgentRow';
import ContinueWatching from '@/components/home/ContinueWatching';
import AgentDetailModal from '@/components/home/AgentDetailModal';
import InfoModal from '@/components/home/InfoModal';
import { allAgents, AGENT_ROWS } from '@/data/all-agents';
import type { HomeAgent } from '@/data/all-agents';
import { CATALOG } from '@/constants/catalog';

function SeasonRow() {
  const rowRef = useRef<HTMLDivElement>(null);
  const phase = CATALOG.find((p) => p.id === 1) ?? CATALOG[0];
  const seasons = phase?.seasons ?? [];

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({
      left: dir === 'left' ? -520 : 520,
      behavior: 'smooth',
    });
  };

  if (seasons.length === 0) return null;

  return (
    <div className="relative group/row mb-2">
      <div className="flex items-center justify-between px-4 md:px-12 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {phase ? `Fase ${phase.id}: ${phase.name}` : 'Temporadas'}
        </h2>
        <Link
          href="/explorar"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          Ver tudo →
        </Link>
      </div>

      <button
        type="button"
        aria-label="Rolar temporadas para a esquerda"
        onClick={() => scroll('left')}
        className="
          absolute left-0 top-8 bottom-8 z-20 w-12
          bg-gradient-to-r from-zinc-950 to-transparent
          flex items-center justify-center
          opacity-0 group-hover/row:opacity-100
          transition-opacity duration-200 hover:from-black
        "
      >
        <span className="text-white text-3xl leading-none">‹</span>
      </button>

      <button
        type="button"
        aria-label="Rolar temporadas para a direita"
        onClick={() => scroll('right')}
        className="
          absolute right-0 top-8 bottom-8 z-20 w-12
          bg-gradient-to-l from-zinc-950 to-transparent
          flex items-center justify-center
          opacity-0 group-hover/row:opacity-100
          transition-opacity duration-200 hover:from-black
        "
      >
        <span className="text-white text-3xl leading-none">›</span>
      </button>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      <div ref={rowRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-3">
        {seasons.map((s) => (
          <Link
            key={s.id}
            href={`/player?episode=${encodeURIComponent(s.episodes?.[0]?.id ?? '')}`}
            className="relative group/card flex-none w-72"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-zinc-900/40 group-hover/card:border-cyan-400/30 transition-colors">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${s.primaryAgent ? '#3B82F6' : '#1a1a2e'}33, #0a0a1a)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[10px] text-cyan-200/80 font-bold uppercase tracking-widest mb-1">
                  Temporada {String(s.number).padStart(2, '0')} · {s.episodes?.length ?? 0} episódios
                </p>
                <p className="text-sm font-extrabold text-white leading-tight line-clamp-1">
                  {s.title}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                  {s.synopsis?.slice(0, 80) ?? ''}…
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedAgent, setSelectedAgent] = useState<HomeAgent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleOpenModal = (agent: HomeAgent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAgent(null), 300);
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <HeroBanner onInfoClick={() => setIsInfoOpen(true)} />

      <section
        className="-mt-20 relative z-20 pb-24 pt-4 space-y-8"
        aria-label="Catálogo"
      >
        <ContinueWatching />
        <SeasonRow />

        {AGENT_ROWS.map((row) => (
          <AgentRow
            key={row.title}
            title={row.title}
            agents={row.agents}
            onAgentClick={handleOpenModal}
          />
        ))}
      </section>

      <AgentDetailModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </main>
  );
}
