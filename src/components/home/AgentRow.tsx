'use client';

/**
 * MENTE.AI — Fileira de Agentes estilo Netflix
 * src/components/home/AgentRow.tsx
 *
 * Scroll horizontal com:
 *  - Setas esquerda/direita (visíveis no hover da fileira)
 *  - Scroll suave via scrollBy
 *  - Animação de entrada staggered dos cards
 */

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AgentCard from './AgentCard';
import type { HomeAgent } from '@/data/all-agents';

interface AgentRowProps {
  title: string;
  agents: HomeAgent[];
  onAgentClick: (agent: HomeAgent) => void;
}

const SCROLL_STEP = 440; // px por clique

export default function AgentRow({ title, agents, onAgentClick }: AgentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_STEP : SCROLL_STEP,
      behavior: 'smooth',
    });
  };

  if (agents.length === 0) return null;

  return (
    <div className="relative group/row mb-2">
      {/* Título */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-12">
        {title}
      </h2>

      {/* Seta esquerda */}
      <button
        type="button"
        aria-label="Rolar para a esquerda"
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
        <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
      </button>

      {/* Seta direita */}
      <button
        type="button"
        aria-label="Rolar para a direita"
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
        <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
      </button>

      {/* Fades laterais */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* Cards */}
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-3"
      >
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <AgentCard agent={agent} onClick={() => onAgentClick(agent)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
