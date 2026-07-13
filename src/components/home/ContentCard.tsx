'use client';

/**
 * MENTE.AI — Premium Content Card
 * Landscape card with rounded corners, shadow, hover effects, and progress bar.
 */

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Info, Play, Plus, Check } from 'lucide-react';
import type { HomeAgent } from '@/data/agents';
import { useMyList } from '@/hooks/useMyList';
import { useState } from 'react';

// ── Props ────────────────────────────────────────────────────────────────

export interface ContentCardProps {
  agent: HomeAgent;
  onClick: () => void;
  /** Show a progress bar at the bottom (0-100) — only for "Continue Watching" */
  progress?: number;
  /** Age rating badge (e.g. "Livre", "10+") */
  ageRating?: string;
  /** Additional badge label */
  badge?: string;
  /** Badge accent color */
  badgeColor?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export default function ContentCard({
  agent,
  onClick,
  progress,
  ageRating,
  badge,
  badgeColor = '#00D9FF',
}: ContentCardProps) {
  const { isInList, toggle } = useMyList();
  const inList = isInList('agent', agent.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative group cursor-pointer flex-none"
      style={{ width: 'clamp(240px, 28vw, 320px)' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${agent.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* Card container */}
      <div
        className="relative aspect-video rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          boxShadow: `0 4px 24px ${agent.color}18`,
          background: `linear-gradient(145deg, ${agent.color}22 0%, #0a0a0a 100%)`,
        }}
      >
        {/* Background gradient (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />

        {/* Agent image */}
        <Image
          src={agent.image}
          alt={agent.name}
          fill
          sizes="(max-width: 768px) 240px, 320px"
          className={`object-cover object-top transition-all duration-700 group-hover:scale-105 group-hover:brightness-50 z-10 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        {/* Loading shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-zinc-900 z-0" />
        )}

        {/* Dark gradient overlay — bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20" />

        {/* ── Badges (top-left) ─────────────────────────────────────── */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
          {badge && (
            <span
              className="px-2.5 py-0.5 text-[10px] font-bold rounded-full text-white"
              style={{ backgroundColor: badgeColor, backdropFilter: 'blur(8px)' }}
            >
              {badge}
            </span>
          )}
          {ageRating && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-white/15 backdrop-blur-md text-white/80 border border-white/10">
              {ageRating}
            </span>
          )}
        </div>

        {/* ── Info at bottom ────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
          <h3 className="text-white text-sm md:text-base font-bold leading-tight drop-shadow-lg">
            {agent.name}
          </h3>
          <p className="text-zinc-300 text-[11px] md:text-xs mt-0.5 line-clamp-1 drop-shadow">
            {agent.role}
          </p>
        </div>

        {/* ── Hover actions ─────────────────────────────────────────── */}
        <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggle('agent', agent.id); }}
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            aria-label={inList ? 'Remover da lista' : 'Adicionar à lista'}
          >
            {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            aria-label="Mais informações"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Play button overlay on hover */}
        <div className="absolute inset-0 z-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-xl">
            <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* ── Progress bar (Continue Watching) ──────────────────────── */}
        {typeof progress === 'number' && progress >= 0 && (
          <div className="absolute bottom-0 left-0 right-0 z-40 h-[3px] bg-white/[0.08]">
            <div
              className="h-full bg-cyan-400 rounded-r-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
