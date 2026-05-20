'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, Clock, Zap, Star } from 'lucide-react';
import { CATALOG } from '@/constants/catalog';
import type { Season, Episode } from '@/constants/catalog';

const WATCH_STORAGE_KEY = 'mente_ai_watch_progress_v1';

function getWatchMap(): Record<string, { watchedPct: number; completed: boolean }> {
  try {
    const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function getEpisodeThumb(agentId: string): string {
  return `/images/agentes/${agentId.toLowerCase()}.png`;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  teoria: { icon: '📖', color: '#00D9FF', label: 'Teoria' },
  laboratorio: { icon: '🧪', color: '#F59E0B', label: 'Laboratório' },
  desafio: { icon: '🎯', color: '#E50914', label: 'Desafio' },
  narrativa: { icon: '🎬', color: '#8B5CF6', label: 'Narrativa' },
  reflexao: { icon: '💭', color: '#10B981', label: 'Reflexão' },
};

function EpisodeCard({ episode }: { episode: Episode }) {
  const config = TYPE_CONFIG[episode.type] || TYPE_CONFIG.teoria;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: 200 }}
    >
      <Link href={`/player?episode=${encodeURIComponent(episode.id)}`}>
        <div
          className="relative rounded-md overflow-hidden"
          style={{
            background: '#1A1A1A',
            aspectRatio: '16/9',
            boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <img
            src={getEpisodeThumb(episode.agentId)}
            alt={episode.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg'; }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: config.color }}>
                  <Play size={20} fill="#fff" color="#fff" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 px-1">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span style={{ color: config.color }}>{config.label}</span>
            <span>•</span>
            <span>{episode.durationMinutes} min</span>
          </div>
          <h4 className="text-sm font-medium text-white leading-tight">{episode.title}</h4>
        </div>
      </Link>
    </motion.div>
  );
}

function SeasonRow({ season }: { season: Season }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  if (!season.episodes?.length) return null;

  return (
    <div
      className="mb-10"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="flex items-center gap-4 mb-4 px-4">
        <h2 className="text-xl font-bold text-white">
          Temporada {String(season.number).padStart(2, '0')} — {season.title}
        </h2>
        {season.synopsis && (
          <span className="text-sm text-gray-500 hidden md:inline">{season.synopsis}</span>
        )}
      </div>

      <div className="relative">
        {showArrows && (
          <>
            <button
              onClick={() => scroll(-1)}
              className="absolute left-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-r-lg transition"
            >
              <ChevronLeft size={24} color="#fff" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="absolute right-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-l-lg transition"
            >
              <ChevronRight size={24} color="#fff" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {season.episodes.filter(ep => ep.status === 'disponivel').map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroBanner() {
  const [watchMap, setWatchMap] = useState<Record<string, { completed: boolean }>>({});

  useEffect(() => {
    setWatchMap(getWatchMap());
  }, []);

  const nextEpisode = useMemo(() => {
    for (const phase of CATALOG) {
      for (const season of phase.seasons || []) {
        for (const ep of season.episodes || []) {
          if (ep.status !== 'disponivel') continue;
          const progress = watchMap[ep.id];
          if (!progress?.completed) return ep;
        }
      }
    }
    return null;
  }, [watchMap]);

  if (!nextEpisode) return null;

  const config = TYPE_CONFIG[nextEpisode.type] || TYPE_CONFIG.teoria;

  return (
    <div className="relative h-[75vh] min-h-[400px] max-h-[600px] mb-8 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={getEpisodeThumb(nextEpisode.agentId)}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, #0a0a1a 0%, #0a0a1a40 50%, transparent 100%),
            linear-gradient(to top, #0a0a1a 0%, transparent 50%),
            linear-gradient(to bottom, #0a0a1a 80%, transparent 100%)
          `,
        }}
      />

      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-gray-400 tracking-wider">PRÓXIMO EPISÓDIO</span>
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: config.color, color: '#000' }}>
              {config.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {nextEpisode.title}
          </h1>

          <p className="text-gray-300 mb-6 line-clamp-2 text-sm md:text-base">
            {nextEpisode.description}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/player?episode=${encodeURIComponent(nextEpisode.id)}`}
              className="flex items-center gap-2 px-8 py-3 rounded font-bold text-sm transition hover:scale-105"
              style={{ background: config.color, color: '#000' }}
            >
              <Play size={20} fill="#000" />
              Assistir
            </Link>

            <Link
              href={`/player?episode=${encodeURIComponent(nextEpisode.id)}`}
              className="flex items-center gap-2 px-6 py-3 rounded font-medium text-sm bg-white/10 hover:bg-white/20 transition text-white"
            >
              <Info size={18} />
              Mais info
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock size={14} /> {nextEpisode.durationMinutes} min</span>
            <span className="flex items-center gap-1"><Zap size={14} /> {nextEpisode.xpReward} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AulasPage() {
  const [selectedPhase, setSelectedPhase] = useState(1);

  const phases = useMemo(() => CATALOG.filter((p) => p.seasons?.length > 0), []);

  const activePhase = phases.find((p) => p.id === selectedPhase) ?? phases[0];
  const seasons = activePhase?.seasons ?? [];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a1a', fontFamily: 'system-ui, sans-serif' }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'linear-gradient(to bottom, #0a0a1a, transparent)' }}
      >
        <div className="flex items-center gap-8" style={{ pointerEvents: 'auto' }}>
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">MENTE</span><span className="text-red-500">.AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition">Início</Link>
            <Link href="/aulas" className="text-white font-semibold">Séries</Link>
            <Link href="/agentes" className="text-gray-400 hover:text-white transition">Agentes</Link>
            <Link href="/explorar" className="text-gray-400 hover:text-white transition">Explorar</Link>
          </div>
        </div>
      </nav>

      <HeroBanner />

      <div className="px-4 md:px-8 pb-16">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 px-4">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition"
              style={{
                background: selectedPhase === phase.id ? '#fff' : 'rgba(255,255,255,0.1)',
                color: selectedPhase === phase.id ? '#000' : 'rgba(255,255,255,0.7)',
              }}
            >
              {phase.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {seasons.map((season) => (
            <SeasonRow key={season.id} season={season} />
          ))}
        </div>
      </div>
    </div>
  );
}