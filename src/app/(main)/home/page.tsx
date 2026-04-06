'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import FuturisticHero from '@/components/home/FuturisticHero';
import AgentRow from '@/components/home/AgentRow';
import AgentDetailModal from '@/components/home/AgentDetailModal';
import InfoModal from '@/components/home/InfoModal';
import { allAgents, AGENT_ROWS } from '@/data/all-agents';
import type { HomeAgent } from '@/data/all-agents';
import { CATALOG } from '@/constants/catalog';
import JourneyMap from '@/components/home/JourneyMap';

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
      <div className="flex items-end justify-between px-4 md:px-12 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {phase ? `Fase ${phase.id}: ${phase.name}` : 'Temporadas'}
        </h2>
        <Link
          href="/explorar"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          Explorar →
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
          transition-opacity duration-200
          hover:from-black
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
          transition-opacity duration-200
          hover:from-black
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
            href={`/explorar?season=${encodeURIComponent(s.id)}`}
            className="relative group/card flex-none w-44"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/10 bg-zinc-900/40 group-hover/card:border-cyan-400/30 transition-colors">
              <Image
                src={s.coverImageUrl}
                alt={s.title}
                fill
                sizes="176px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
              <div className="absolute inset-0 opacity-[0.22]" style={{ background: 'radial-gradient(circle at 30% 10%, rgba(0,240,255,0.22), transparent 55%)' }} />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs text-zinc-300/80 font-bold uppercase tracking-widest mb-1">
                  Temporada {String(s.number).padStart(2, '0')}
                </p>
                <p className="text-sm font-extrabold text-white leading-tight line-clamp-2">
                  {s.title}
                </p>
                <div className="mt-3 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: '5%', background: '#00F0FF' }} />
                </div>
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
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--cognitive-bg, #03030d)' }}
    >
      <FuturisticHero onInfoClick={() => setIsInfoOpen(true)} />
      <JourneyMap />

      <section className="-mt-20 relative z-20 pb-24 pt-4 space-y-8" aria-label="Catálogo">
        <SeasonRow />

        {AGENT_ROWS.map((row) => (
          <AgentRow
            key={row.title}
            title={row.title}
            agents={row.agents}
            onAgentClick={handleOpenModal}
          />
        ))}

        <AgentRow
          title="Todos os Agentes"
          agents={allAgents}
          onAgentClick={handleOpenModal}
        />
      </section>

      <AgentDetailModal agent={selectedAgent} isOpen={isModalOpen} onClose={handleCloseModal} />

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </main>
  );
}
