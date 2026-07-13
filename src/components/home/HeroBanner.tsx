'use client';

/**
 * MENTE.AI — Cinematic Hero Banner
 * Rotating billboard with dark overlays, badges, and premium action buttons.
 * FASE 2 of homepage redesign — preserves all existing functionality.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, Play } from 'lucide-react';
import { getAgentImage } from '@/lib/getAgentImage';

// ── Data ────────────────────────────────────────────────────────────────

type HeroAgent = {
  id: string;
  name: string;
  role: string;
  category: string;
  ageRating: string;
  duration: string;
  description: string;
  accentColor: string;
  badge?: 'new' | 'top10' | 'recommended';
  image: string;
};

const HERO_AGENTS: HeroAgent[] = [
  {
    id: 'nexus', name: 'NEXUS',
    role: 'O Arquiteto da Consciência',
    category: 'Aventura • Ficção Científica',
    ageRating: 'Livre',
    duration: '12 episódios',
    description: 'Orquestra sistemas, conecta decisões e abre rotas seguras para o aprendizado contínuo.',
    accentColor: '#00D9FF',
    badge: 'top10',
    image: getAgentImage('nexus'),
  },
  {
    id: 'volt', name: 'VOLT',
    role: 'O Espírito da Energia Neural',
    category: 'Ação • Tecnologia',
    ageRating: 'Livre',
    duration: '10 episódios',
    description: 'Acelera a execução com precisão. Transforme intenção em progresso mensurável.',
    accentColor: '#FACC15',
    badge: 'new',
    image: getAgentImage('volt'),
  },
  {
    id: 'kaos', name: 'KAOS',
    role: 'O Caos que Gera Ordem',
    category: 'Exploração • Estratégia',
    ageRating: '10+',
    duration: '8 episódios',
    description: 'Explora possibilidades extremas e sintetiza padrões para desbloquear novas estratégias.',
    accentColor: '#F97316',
    badge: 'recommended',
    image: getAgentImage('kaos'),
  },
  {
    id: 'ethos', name: 'ETHOS',
    role: 'A Voz da Consciência',
    category: 'Filosofia • Ética',
    ageRating: 'Livre',
    duration: '6 episódios',
    description: 'Valida decisões com ética aplicada e mantém o sistema alinhado com princípios.',
    accentColor: '#A78BFA',
    image: getAgentImage('ethos'),
  },
  {
    id: 'aurora', name: 'AURORA',
    role: 'A Criadora de Mundos',
    category: 'Criatividade • Arte',
    ageRating: 'Livre',
    duration: '10 episódios',
    description: 'Gera cenários, protótipos e narrativas para ampliar visão e construir caminhos.',
    accentColor: '#EC4899',
    badge: 'new',
    image: getAgentImage('aurora'),
  },
];

// ── Badge config ─────────────────────────────────────────────────────────

const BADGE_LABELS: Record<string, string> = {
  new: 'Novo',
  top10: 'Top 10',
  recommended: 'Recomendado',
};

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-cyan-500/90 text-white',
  top10: 'bg-red-600/90 text-white',
  recommended: 'bg-amber-500/90 text-black',
};

// ── Props ────────────────────────────────────────────────────────────────

interface HeroBannerProps {
  onInfoClick?: () => void;
}

const ROTATION_MS = 7000;

export default function HeroBanner({ onInfoClick }: HeroBannerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);

  const agent = HERO_AGENTS[activeIndex] ?? HERO_AGENTS[0];

  // ── Respect reduced motion preference ────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Rotation timer ────────────────────────────────────────────────────

  useEffect(() => {
    const restartTimer = () => {
      if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (paused || reduceMotion) return;
      intervalRef.current = globalThis.setInterval(() => {
        setActiveIndex((i) => (i + 1) % HERO_AGENTS.length);
        setProgressKey((k) => k + 1);
        setImageError(false);
      }, ROTATION_MS);
    };
    restartTimer();
    return () => { if (intervalRef.current) globalThis.clearInterval(intervalRef.current); };
  }, [paused, reduceMotion]);

  useEffect(() => { setProgressKey((k) => k + 1); }, [activeIndex]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    setProgressKey((k) => k + 1);
    setImageError(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'min(88vh, 800px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="banner"
      aria-label="Destaque principal"
    >
      {/* Container with rounded corners */}
      <div className="absolute inset-4 md:inset-6 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
        {/* Base bg */}
        <div className="absolute inset-0 bg-zinc-950" />

        {/* Background image */}
        {!imageError && (
          <img
            src={agent.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
            style={{ filter: 'brightness(0.35) saturate(1.3)', transform: 'scale(1.05)' }}
            onError={() => setImageError(true)}
          />
        )}

        {/* Dark gradient overlays — bottom-heavy for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 150px 60px rgba(0,0,0,0.5)',
          }}
        />

        {/* ── CONTENT: Lower-left ────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-12 pb-10 md:pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${agent.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-2xl space-y-4 md:space-y-5"
            >
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                {agent.badge && (
                  <span className={`inline-flex items-center px-3 py-1 text-[11px] md:text-xs font-bold rounded-full ${BADGE_STYLES[agent.badge]}`}>
                    {BADGE_LABELS[agent.badge]}
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 text-[11px] md:text-xs font-bold rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
                  {agent.ageRating}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.92] tracking-tight drop-shadow-2xl"
                style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
              >
                {agent.name}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-zinc-300 font-medium">
                <span>{agent.category}</span>
                <span className="text-zinc-600" aria-hidden="true">•</span>
                <span>{agent.duration}</span>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-lg line-clamp-2">
                {agent.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => router.push(`/universo/${agent.id}`)}
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-white text-black text-sm md:text-base font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-xl"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" />
                  Assistir Agora
                </button>

                <button
                  type="button"
                  onClick={onInfoClick}
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-3 md:py-3.5 bg-white/10 backdrop-blur-md text-white text-sm md:text-base font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/15"
                >
                  <Info className="w-4 h-4 md:w-5 md:h-5" />
                  Mais Informações
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── TOP-RIGHT: Episode / category badge ───────────────────────── */}
        <div className="absolute top-6 md:top-8 right-6 md:right-8 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-full bg-white/10 backdrop-blur-md text-white/70 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: agent.accentColor }} />
            AGENTE EM DESTAQUE
          </span>
        </div>
      </div>

      {/* ── BOTTOM INDICATORS ──────────────────────────────────────────── */}
      <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_AGENTS.map((a, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={a.id}
              type="button"
              aria-label={`Ver ${a.name}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: active ? 32 : 8,
                height: 4,
                backgroundColor: active ? agent.accentColor : 'rgba(255,255,255,0.3)',
              }}
            />
          );
        })}
      </div>

      {/* ── PROGRESS BAR ───────────────────────────────────────────────── */}
      {!paused && (
        <div className="absolute bottom-0 left-4 right-4 md:left-6 md:right-6 z-20 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            key={`progress-${agent.id}-${progressKey}`}
            className="h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: ROTATION_MS / 1000, ease: 'linear' }}
            style={{ backgroundColor: agent.accentColor }}
          />
        </div>
      )}
    </section>
  );
}
