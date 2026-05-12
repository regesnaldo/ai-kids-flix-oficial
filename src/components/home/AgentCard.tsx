'use client';

/**
 * MENTE.AI — Card de Agente estilo Netflix
 * Card com hover expand, vídeo trailer, e overlay informativo.
 */

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Plus } from 'lucide-react';
import type { HomeAgent } from '@/data/all-agents';
import { useMyList } from '@/hooks/useMyList';

interface AgentCardProps {
  agent: HomeAgent;
  onClick: () => void;
}

const LEVEL_BADGE: Record<string, { bg: string; text: string }> = {
  Iniciante:    { bg: 'bg-blue-600',   text: 'Iniciante'    },
  Intermediário:{ bg: 'bg-green-600',  text: 'Intermediário' },
  Avançado:     { bg: 'bg-orange-600', text: 'Avançado'     },
  Mestre:       { bg: 'bg-purple-600', text: 'Mestre'       },
};

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const badge = LEVEL_BADGE[agent.level] ?? LEVEL_BADGE.Iniciante;
  const { isInList, toggle } = useMyList();
  const inList = isInList('agent', agent.id);
  const [showTrailer, setShowTrailer] = useState(false);
  const timerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const [muted] = useState(true);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) globalThis.clearTimeout(timerRef.current);
    };
  }, []);

  const onHoverStart = () => {
    if (timerRef.current != null) globalThis.clearTimeout(timerRef.current);
    timerRef.current = globalThis.setTimeout(() => setShowTrailer(true), 1200);
  };

  const onHoverEnd = () => {
    if (timerRef.current != null) globalThis.clearTimeout(timerRef.current);
    timerRef.current = null;
    setShowTrailer(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="relative group cursor-pointer flex-none w-44"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${agent.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div
        className="relative aspect-[2/3] rounded-lg overflow-hidden"
        style={{ boxShadow: `0 4px 20px ${agent.color}22` }}
      >
        {/* Gradiente base */}
        <div
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{ background: `linear-gradient(145deg, ${agent.color}44 0%, #0f0f0f 100%)` }}
          aria-hidden="true"
        >
          <span
            className="text-7xl font-black select-none"
            style={{ color: agent.color, opacity: 0.15 }}
          >
            {agent.name.charAt(0)}
          </span>
        </div>

        {/* Imagem do agente */}
        <Image
          src={agent.image}
          alt={agent.name}
          fill
          sizes="176px"
          className="object-cover object-top transition-opacity duration-500 group-hover:opacity-80 z-10"
          onLoad={() => setImageReady(true)}
          onError={() => setImageReady(true)}
        />

        {/* Loading placeholder */}
        {!imageReady ? (
          <div
            className="absolute inset-0 animate-pulse z-20"
            style={{ background: '#141414' }}
          />
        ) : null}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

        {/* Hover content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
          {/* Categoria */}
          <span
            className="inline-block self-start px-2 py-0.5 text-white text-[10px] font-bold rounded mb-1"
            style={{ background: agent.color }}
          >
            {agent.category}
          </span>

          {/* Nome e descrição */}
          <h3 className="text-sm font-extrabold text-white leading-tight">{agent.name}</h3>
          <p className="text-[10px] text-zinc-300 mt-0.5 mb-2 line-clamp-2">{agent.description}</p>

          {/* Botões */}
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggle('agent', agent.id); }}
              className="flex-1 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-[10px] font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
            >
              {inList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex-1 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-[10px] font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
            >
              <Info className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Nível badge (sempre visível) */}
        <div className={`absolute top-2 left-2 px-1.5 py-0.5 ${badge.bg} text-white text-[8px] font-bold rounded-full z-20`}>
          {badge.text}
        </div>
      </div>

      {/* Nome abaixo do card */}
      <div className="mt-1.5 px-0.5">
        <p className="text-white text-xs font-bold truncate">{agent.name}</p>
        <p className="text-zinc-500 text-[10px] truncate">{agent.role}</p>
      </div>
    </motion.div>
  );
}
