'use client';

/**
 * MENTE.AI — Card de Agente estilo Netflix
 * src/components/home/AgentCard.tsx
 *
 * Card compacto usado nas fileiras horizontais.
 * Ao hover: escala, overlay com info e botão "Mais Informações".
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

// Mapa de nível para badge colorido
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
  const [muted, setMuted] = useState(true);
  const [imageReady, setImageReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const currentLetter = agent.name.charAt(0);

  useEffect(() => {
    try {
      const stored = globalThis.localStorage?.getItem('mente_ai_muted');
      if (stored === '0') setMuted(false);
      if (stored === '1') setMuted(true);
    } catch (_e) {
      void _e;
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'mente_ai_muted') return;
      if (e.newValue === '0') setMuted(false);
      if (e.newValue === '1') setMuted(true);
    };
    globalThis.addEventListener?.('storage', onStorage);
    return () => globalThis.removeEventListener?.('storage', onStorage);
  }, []);

  useEffect(() => {
    if (showTrailer) setVideoReady(false);
  }, [showTrailer]);

  const onHoverStart = () => {
    if (timerRef.current != null) globalThis.clearTimeout(timerRef.current);
    timerRef.current = globalThis.setTimeout(() => setShowTrailer(true), 1500);
  };

  const onHoverEnd = () => {
    if (timerRef.current != null) globalThis.clearTimeout(timerRef.current);
    timerRef.current = null;
    setShowTrailer(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.06, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="relative group cursor-pointer flex-none w-52"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${agent.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* ── Imagem / Placeholder ── */}
      <div
        className="relative aspect-[2/3] rounded-lg overflow-hidden"
        style={{
          boxShadow: `0 12px 48px ${agent.color}44, inset 0 0 25px ${agent.color}33`,
          border: `1px solid ${agent.color}30`,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{ background: `linear-gradient(135deg, ${agent.color}55 0%, #09090b 100%)` }}
          aria-hidden="true"
        >
          <span
            className="text-6xl font-black opacity-20 select-none"
            style={{ color: agent.color }}
          >
            {agent.name.charAt(0)}
          </span>
        </div>

        {showTrailer ? (
          <video
            className="absolute inset-0 w-full h-full object-cover z-10"
            autoPlay
            loop
            playsInline
            muted={muted}
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            style={{ filter: 'hue-rotate(190deg) saturate(1.45) contrast(1.15) brightness(0.72)' }}
          >
            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src={agent.image}
            alt={agent.name}
            fill
            sizes="208px"
            className="object-cover transition-transform duration-500 group-hover:scale-110 z-10"
            onLoad={() => setImageReady(true)}
            onError={() => setImageReady(true)}
          />
        )}

        {(!showTrailer && !imageReady) || (showTrailer && !videoReady) ? (
          <div
            className="absolute inset-0 animate-pulse z-20"
            style={{
              background: '#141414',
              boxShadow: 'inset 0 0 0 1px rgba(0,240,255,0.12), 0 0 22px rgba(0,240,255,0.12)',
            }}
          />
        ) : null}

        {/* ── Overlay on hover ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black opacity-0 group-hover:opacity-90 transition-opacity duration-300" />

        {/* ── Conteúdo do hover ── */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {/* Categoria badge */}
          <span
            className="inline-block self-start px-2 py-0.5 text-white text-[10px] font-bold rounded mb-1.5"
            style={{ background: agent.color }}
          >
            {agent.category}
          </span>

          {/* Nome */}
          <h3
            className="text-base font-extrabold text-white leading-tight"
            style={{ fontFamily: '"Orbitron", "Space Grotesk", sans-serif' }}
          >
            {agent.name}
          </h3>
          <p className="text-[11px] tracking-[0.2em] text-white/60 uppercase">{agent.role}</p>
          <p className="text-xs text-white/60 mt-1 line-clamp-2">{agent.description}</p>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.3em]">
            Ativa quando você busca {agent.category.toLowerCase()}
          </p>

          {/* Botão */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggle('agent', agent.id); }}
              className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              Minha Lista
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              Detalhes
            </button>
          </div>
        </div>

        {/* ── Nível badge (sempre visível) ── */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 ${badge.bg} text-white text-[9px] font-bold rounded-full`}>
          {badge.text}
        </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold text-white">
          {currentLetter}
        </span>
        <span className="text-[10px] text-white/60 uppercase">Preview do universo</span>
      </div>

      {/* ── Nome abaixo do card (visível sempre) ── */}
      <div className="mt-2 px-1">
        <p className="text-white text-sm font-bold truncate">{agent.name}</p>
        <p className="text-zinc-500 text-xs truncate">{agent.role}</p>
      </div>
    </motion.div>
  );
}
