'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { CATALOG } from '@/constants/catalog';
import type { Season, Episode } from '@/constants/catalog';

const TYPE_LABEL: Record<string, string> = {
  narrativa: 'NARRATIVA',
  teoria: 'TEORIA',
  laboratorio: 'LABORATÓRIO',
  desafio: 'DESAFIO',
  reflexao: 'REFLEXÃO',
};

const TYPE_STYLE: Record<string, string> = {
  narrativa: 'text-violet-300 bg-violet-500/15 border-violet-400/30',
  teoria: 'text-sky-300 bg-sky-500/15 border-sky-400/30',
  laboratorio: 'text-amber-300 bg-amber-500/15 border-amber-400/30',
  desafio: 'text-rose-300 bg-rose-500/15 border-rose-400/30',
  reflexao: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/30',
};

function isSeasonLocked(season: Season): boolean {
  return season.number !== 1 || (season.episodes?.length ?? 0) === 0;
}

function getEpisodeThumb(agentId: string): string {
  return `/images/agentes/${agentId.toLowerCase()}.png`;
}

export default function AulasPage() {
  const [isSeasonMenuOpen, setIsSeasonMenuOpen] = useState(false);

  const seasons = useMemo(() => {
    return CATALOG.flatMap((phase) => phase.seasons ?? []).sort((a, b) => a.number - b.number);
  }, []);

  const unlockedSeason = seasons.find((season) => !isSeasonLocked(season)) ?? seasons[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(unlockedSeason?.id ?? '');
  const selectedSeason = seasons.find((season) => season.id === selectedSeasonId) ?? unlockedSeason;
  const episodes = selectedSeason?.episodes ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Episódios</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Explore a jornada da temporada</p>
          </div>
          <Link href="/home" className="text-sm text-zinc-400 hover:text-white transition">
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 md:px-10 py-8">
        <div className="relative w-full max-w-sm mb-8">
          <button
            type="button"
            onClick={() => setIsSeasonMenuOpen((open) => !open)}
            className="w-full flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-left hover:bg-white/[0.06] transition"
          >
            <span className="font-semibold">
              Temporada {String(selectedSeason?.number ?? 1).padStart(2, '0')} - {selectedSeason?.title ?? 'Sem título'}
            </span>
            <ChevronDown className={`h-4 w-4 text-zinc-400 transition ${isSeasonMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSeasonMenuOpen && (
            <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-[#101024] shadow-2xl">
              {seasons.map((season) => {
                const locked = isSeasonLocked(season);
                const selected = season.id === selectedSeason?.id;

                return (
                  <li key={season.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!locked) {
                          setSelectedSeasonId(season.id);
                          setIsSeasonMenuOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition ${
                        locked
                          ? 'text-zinc-500 cursor-not-allowed bg-white/[0.01]'
                          : 'text-zinc-200 hover:bg-white/[0.07]'
                      }`}
                    >
                      <span>
                        Temporada {String(season.number).padStart(2, '0')} - {season.title}
                      </span>
                      <span className="flex items-center gap-2">
                        {locked ? <Lock className="h-4 w-4" /> : null}
                        {selected ? <Check className="h-4 w-4 text-sky-300" /> : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <section className="border-t border-white/10">
          {episodes.map((ep: Episode) => {
            const locked = ep.status !== 'disponivel';
            const href = `/player?episode=${encodeURIComponent(ep.id)}`;

            return (
              <Link
                key={ep.id}
                href={locked ? '#' : href}
                onClick={(event) => {
                  if (locked) event.preventDefault();
                }}
                className="group grid grid-cols-[40px_160px_1fr] items-center gap-4 border-b border-white/10 py-4 hover:bg-white/[0.04] transition px-2"
              >
                <div className="text-zinc-400 text-lg font-semibold text-center">
                  {String(ep.number).padStart(2, '0')}
                </div>

                <div className="relative h-[90px] w-[160px] overflow-hidden rounded-md bg-zinc-900">
                  <img
                    src={getEpisodeThumb(ep.agentId)}
                    alt={ep.title}
                    className={`h-full w-full object-cover ${locked ? 'brightness-50' : ''}`}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/agentes/nexus.png';
                    }}
                  />
                  {locked ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Lock className="h-5 w-5 text-zinc-200" />
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-base md:text-lg font-semibold truncate">{ep.title}</h2>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${TYPE_STYLE[ep.type] ?? TYPE_STYLE.teoria}`}>
                      {TYPE_LABEL[ep.type] ?? ep.type.toUpperCase()}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-zinc-400 truncate">{ep.description}</p>

                  <div className="mt-2 text-xs text-zinc-500 text-right">
                    {ep.durationMinutes} min • {ep.xpReward} XP
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
