'use client';

/**
 * MENTE.AI — Premium Content Row
 * Horizontal carousel with smooth scroll, fade edges, and hover arrows.
 */

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard, { type ContentCardProps } from './ContentCard';
import type { HomeAgent } from '@/data/agents';

// ── Types ────────────────────────────────────────────────────────────────

export interface ContentRowCard {
  agent: HomeAgent;
  progress?: number;
  ageRating?: string;
  badge?: string;
  badgeColor?: string;
}

export interface ContentRowProps {
  title: string;
  subtitle?: string;
  cards: ContentRowCard[];
  onCardClick: (agent: HomeAgent) => void;
}

// ── Component ────────────────────────────────────────────────────────────

const SCROLL_STEP = 600;

export default function ContentRow({ title, subtitle, cards, onCardClick }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [cards]);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_STEP : SCROLL_STEP,
      behavior: 'smooth',
    });
  };

  if (cards.length === 0) return null;

  return (
    <div
      className="relative group/row mb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-baseline gap-3 mb-4 px-4 md:px-12">
        <h2 className="text-lg md:text-xl font-bold text-white">
          {title}
        </h2>
        {subtitle && (
          <span className="text-xs md:text-sm text-zinc-500 font-medium">
            {subtitle}
          </span>
        )}
      </div>

      {/* ── Left arrow ────────────────────────────────────────────── */}
      <button
        type="button"
        aria-label="Rolar para a esquerda"
        onClick={() => scroll('left')}
        className={`
          absolute left-1 md:left-3 top-0 bottom-0 z-20 w-10 md:w-12
          flex items-center justify-center
          transition-all duration-300
          ${canScrollLeft && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors shadow-lg">
          <ChevronLeft className="w-5 h-5" />
        </div>
      </button>

      {/* ── Right arrow ───────────────────────────────────────────── */}
      <button
        type="button"
        aria-label="Rolar para a direita"
        onClick={() => scroll('right')}
        className={`
          absolute right-1 md:right-3 top-0 bottom-0 z-20 w-10 md:w-12
          flex items-center justify-center
          transition-all duration-300
          ${canScrollRight && isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors shadow-lg">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      {/* ── Fade edges ────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 md:w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 md:w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* ── Cards ─────────────────────────────────────────────────── */}
      <div
        ref={rowRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2 pr-10 md:pr-16"
      >
        {cards.map((card, i) => (
          <motion.div
            key={`${card.agent.id}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.35 }}
          >
            <ContentCard
              agent={card.agent}
              onClick={() => onCardClick(card.agent)}
              progress={card.progress}
              ageRating={card.ageRating}
              badge={card.badge}
              badgeColor={card.badgeColor}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
