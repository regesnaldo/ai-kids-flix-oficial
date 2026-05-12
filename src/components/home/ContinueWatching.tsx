'use client';

/**
 * MENTE.AI — Seção "Continuar Assistindo"
 * Mostra episódios que o usuário começou mas não terminou.
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getEpisodeById, getSeasonById } from '@/constants/catalog';

interface WatchState {
  watchedPct: number;
  completed: boolean;
  updatedAt: number;
}

const WATCH_STORAGE_KEY = 'mente_ai_watch_progress_v1';
const SCROLL_STEP = 320;

export default function ContinueWatching() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [watchMap, setWatchMap] = useState<Record<string, WatchState>>({});

  useEffect(() => {
    try {
      const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, WatchState>;
      if (parsed && typeof parsed === 'object') setWatchMap(parsed);
    } catch {
      void 0;
    }
  }, []);

  const incompleteEpisodes = useMemo(() => {
    return Object.entries(watchMap)
      .filter(([, st]) => st.watchedPct > 0 && st.watchedPct < 1 && !st.completed)
      .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
      .slice(0, 12)
      .map(([episodeId, st]) => {
        const episode = getEpisodeById(episodeId);
        const seasonId = episodeId.slice(0, 3);
        const season = getSeasonById(seasonId);
        return { episodeId, episode, season, watchedPct: st.watchedPct, updatedAt: st.updatedAt };
      })
      .filter((item) => item.episode && item.season);
  }, [watchMap]);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_STEP : SCROLL_STEP,
      behavior: 'smooth',
    });
  };

  if (incompleteEpisodes.length === 0) return null;

  return (
    <div className="relative group/row mb-2">
      <div className="flex items-center justify-between px-4 md:px-12 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Continuar Assistindo
        </h2>
        <span className="text-xs text-zinc-500 font-semibold">
          {incompleteEpisodes.length} episódios em progresso
        </span>
      </div>

      <button
        type="button"
        aria-label="Rolar para a esquerda"
        onClick={() => scroll('left')}
        className="
          absolute left-0 top-8 bottom-8 z-20 w-12
          bg-gradient-to-r from-zinc-950 to-transparent
          flex items-center justify-center
          opacity-0 group-hover/row:opacity-100
          transition-opacity duration-200 hover:from-black
        "
      >
        <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
      </button>

      <button
        type="button"
        aria-label="Rolar para a direita"
        onClick={() => scroll('right')}
        className="
          absolute right-0 top-8 bottom-8 z-20 w-12
          bg-gradient-to-l from-zinc-950 to-transparent
          flex items-center justify-center
          opacity-0 group-hover/row:opacity-100
          transition-opacity duration-200 hover:from-black
        "
      >
        <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
      </button>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      <div ref={rowRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-3">
        {incompleteEpisodes.map(({ episodeId, episode, season, watchedPct }) => (
          <Link
            key={episodeId}
            href={`/player?episode=${encodeURIComponent(episodeId)}`}
            className="group/card flex-none w-72"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-zinc-900/60 group-hover/card:border-cyan-400/30 transition-colors">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${season?.primaryAgent ? '#3B82F6' : '#1a1a2e'}33, #0a0a1a)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center group-hover/card:bg-cyan-500/30 transition-colors">
                  <Play className="w-5 h-5 text-cyan-200 ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                  {season?.title ?? 'Temporada'}
                </p>
                <p className="text-sm font-bold text-white leading-tight line-clamp-1">
                  {episode?.title ?? episodeId}
                </p>
                <div className="mt-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round(watchedPct * 100)}%`, background: '#00D9FF' }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  {Math.round(watchedPct * 100)}% assistido
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
