'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────────────── */

type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  agentId: string;
  status: 'disponivel' | 'em_breve';
};

type Season = {
  id: string;
  number: number;
  title: string;
  synopsis: string;
  primaryAgent: string;
  primaryAgentId: string;
  episodes: Episode[];
};

const SEASONS: Season[] = [
  {
    id: 's01',
    number: 1,
    title: 'O Início de Tudo',
    synopsis: 'NEXUS guia você pelos fundamentos da inteligência artificial.',
    primaryAgent: 'NEXUS',
    primaryAgentId: 'nexus',
    episodes: [
      { id: 's01e01', number: 1, title: 'O Que É Inteligência Artificial?', description: 'Entenda o conceito fundamental por trás das máquinas que aprendem.', durationMinutes: 12, agentId: 'nexus', status: 'disponivel' },
      { id: 's01e02', number: 2, title: 'Como Máquinas Aprendem', description: 'Descubra os mecanismos de aprendizado de máquina.', durationMinutes: 15, agentId: 'nexus', status: 'disponivel' },
      { id: 's01e03', number: 3, title: 'Redes Neurais Explicadas', description: 'Visualize como neurônios artificiais processam informação.', durationMinutes: 18, agentId: 'nexus', status: 'disponivel' },
      { id: 's01e04', number: 4, title: 'Dados: O Combustível da IA', description: 'Por que dados são tão importantes para a inteligência artificial.', durationMinutes: 14, agentId: 'nexus', status: 'disponivel' },
      { id: 's01e05', number: 5, title: 'Ética e Responsabilidade', description: 'Os dilemas morais de criar máquinas inteligentes.', durationMinutes: 16, agentId: 'nexus', status: 'disponivel' },
      { id: 's01e06', number: 6, title: 'O Futuro da IA', description: 'Para onde estamos indo? Previsões e possibilidades.', durationMinutes: 20, agentId: 'nexus', status: 'em_breve' },
    ],
  },
  {
    id: 's02',
    number: 2,
    title: 'VOLT Entra em Cena',
    synopsis: 'VOLT eletrifica o aprendizado com energia criativa e redes neurais.',
    primaryAgent: 'VOLT',
    primaryAgentId: 'volt',
    episodes: [
      { id: 's02e01', number: 1, title: 'Conheça VOLT', description: 'A energia criativa que transforma aprendizado em ação.', durationMinutes: 10, agentId: 'volt', status: 'disponivel' },
      { id: 's02e02', number: 2, title: 'Deep Learning Descomplicado', description: 'Mergulhe nas camadas profundas das redes neurais.', durationMinutes: 17, agentId: 'volt', status: 'disponivel' },
      { id: 's02e03', number: 3, title: 'Criatividade Artificial', description: 'IA pode ser criativa? VOLT mostra que sim.', durationMinutes: 14, agentId: 'volt', status: 'disponivel' },
      { id: 's02e04', number: 4, title: 'Energia dos Dados', description: 'Como transformar dados brutos em insights poderosos.', durationMinutes: 16, agentId: 'volt', status: 'disponivel' },
      { id: 's02e05', number: 5, title: 'Laboratório de IA', description: 'Mão na massa: construa seu primeiro modelo.', durationMinutes: 22, agentId: 'volt', status: 'em_breve' },
    ],
  },
  {
    id: 's03',
    number: 3,
    title: 'O Paradoxo do Humor',
    synopsis: 'JANUS revela os dois lados de cada conceito com sagacidade.',
    primaryAgent: 'JANUS',
    primaryAgentId: 'janus',
    episodes: [
      { id: 's03e01', number: 1, title: 'Duas Faces da IA', description: 'Toda tecnologia tem dois lados. JANUS mostra ambos.', durationMinutes: 13, agentId: 'janus', status: 'disponivel' },
      { id: 's03e02', number: 2, title: 'O Paradoxo da Consciência', description: 'Máquinas podem ter consciência? O debate filosófico.', durationMinutes: 19, agentId: 'janus', status: 'disponivel' },
      { id: 's03e03', number: 3, title: 'Humor e Inteligência', description: 'Por que o humor é um sinal de inteligência avançada.', durationMinutes: 15, agentId: 'janus', status: 'disponivel' },
      { id: 's03e04', number: 4, title: 'Decisões com IA', description: 'Como algoritmos nos ajudam (e atrapalham) a decidir.', durationMinutes: 17, agentId: 'janus', status: 'em_breve' },
      { id: 's03e05', number: 5, title: 'O Amanhã Bifurcado', description: 'Dois futuros possíveis: qual você escolhe?', durationMinutes: 21, agentId: 'janus', status: 'em_breve' },
    ],
  },
];

function getThumb(agentId: string): string {
  return `/images/agentes/${agentId}.png`;
}

/* ─── Video Modal ──────────────────────────────────────────────────────── */

function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      style={{ zIndex: 200 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative w-full max-w-4xl rounded-xl overflow-hidden border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 transition text-white"
        >
          <X size={20} />
        </button>
        <video
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          controls
          autoPlay
          className="w-full aspect-video"
          style={{ background: '#000' }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Episode Card ─────────────────────────────────────────────────────── */

function EpisodeCard({ episode }: { episode: Episode }) {
  const [hovered, setHovered] = useState(false);
  const isLocked = episode.status === 'em_breve';

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.05, y: isLocked ? 0 : -5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: 220 }}
    >
      <div className="relative rounded-md overflow-hidden"
        style={{ background: '#1A1A1A', aspectRatio: '16/9',
          boxShadow: hovered && !isLocked ? '0 8px 32px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.3)' }}>
        <img src={getThumb(episode.agentId)} alt={episode.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg'; }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />

        {isLocked && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
            style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#f59e0b' }}>
            EM BREVE
          </div>
        )}

        <AnimatePresence>
          {hovered && !isLocked && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#00f5ff' }}>
                <Play size={20} fill="#000" color="#000" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-2 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <span className="flex items-center gap-1"><Clock size={12} /> {episode.durationMinutes} min</span>
        </div>
        <h4 className="text-sm font-semibold text-white leading-tight"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {episode.number}. {episode.title}
        </h4>
      </div>
    </motion.div>
  );
}

/* ─── Season Row ───────────────────────────────────────────────────────── */

function SeasonRow({ season, onPlay }: { season: Season; onPlay: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = useCallback((dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: 'smooth' });
  }, []);

  return (
    <div className="mb-10" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
      <div className="flex items-center gap-4 mb-4 px-4 md:px-16">
        <h2 className="text-lg md:text-xl font-bold text-white"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          Temporada {season.number} — {season.title}
        </h2>
        <span className="text-sm text-gray-500 hidden md:inline">{season.synopsis}</span>
      </div>

      <div className="relative">
        {showArrows && (
          <>
            <button onClick={() => scroll(-1)} className="absolute left-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-r-lg transition">
              <ChevronLeft size={24} color="#fff" />
            </button>
            <button onClick={() => scroll(1)} className="absolute right-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-l-lg transition">
              <ChevronRight size={24} color="#fff" />
            </button>
          </>
        )}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-4 md:px-16 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {season.episodes.map((ep) => (
            <div key={ep.id} onClick={() => { if (ep.status === 'disponivel') onPlay(); }}>
              <EpisodeCard episode={ep} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Banner ──────────────────────────────────────────────────────── */

function HeroBanner({ onPlay }: { onPlay: () => void }) {
  const s = SEASONS[0];

  return (
    <div className="relative h-[65vh] min-h-[380px] max-h-[550px] mb-8 overflow-hidden">
      <div className="absolute inset-0">
        <img src={getThumb(s.primaryAgentId)} alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>

      <div className="absolute inset-0" style={{
        background: `linear-gradient(to right, #0a0a1a 0%, #0a0a1a40 50%, transparent 100%),
          linear-gradient(to top, #0a0a1a 0%, transparent 50%),
          linear-gradient(to bottom, #0a0a1a 80%, transparent 100%)` }} />

      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-bold text-gray-400 tracking-wider">TEMPORADA 01</span>
            <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: '#00f5ff', color: '#000' }}>
              NOVA
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            {s.title}
          </h1>

          <p className="text-gray-300 mb-6 line-clamp-2 text-sm md:text-base">{s.synopsis}</p>

          <div className="flex items-center gap-4">
            <button onClick={onPlay}
              className="flex items-center gap-2 px-8 py-3 rounded font-bold text-sm transition hover:scale-105"
              style={{ background: '#00f5ff', color: '#000' }}>
              <Play size={20} fill="#000" /> Assistir
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span className="font-mono">{s.primaryAgent} lidera esta temporada</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function SeriesPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a1a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'linear-gradient(to bottom, #0a0a1a, transparent)' }}>
        <div className="flex items-center gap-8" style={{ pointerEvents: 'auto' }}>
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">MENTE</span><span className="text-red-500">.AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition">Início</Link>
            <Link href="/series" className="text-white font-semibold">Séries</Link>
            <Link href="/agentes" className="text-gray-400 hover:text-white transition">Agentes</Link>
            <Link href="/explorar" className="text-gray-400 hover:text-white transition">Explorar</Link>
          </div>
        </div>
      </nav>

      <HeroBanner onPlay={() => setShowVideo(true)} />

      <div className="pb-16">
        {SEASONS.map((season) => (
          <SeasonRow key={season.id} season={season} onPlay={() => setShowVideo(true)} />
        ))}
      </div>

      <AnimatePresence>
        {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
      </AnimatePresence>
    </div>
  );
}
