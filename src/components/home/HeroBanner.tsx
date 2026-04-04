'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Info, Play, Sparkles, Volume2, VolumeX } from 'lucide-react';

type HeroAgent = {
  id: string;
  name: string;
  role: string;
  description: string;
  accentColor: string;
  episode: string;
  image: string;
};

export const HERO_AGENTS: HeroAgent[] = [
  {
    id: 'nexus',
    name: 'NEXUS',
    role: 'O Arquiteto da Consciência',
    description: 'Orquestra sistemas, conecta decisões e abre rotas seguras para o aprendizado contínuo.',
    accentColor: '#00D9FF',
    episode: 'S01E01',
    image: '/images/agentes/nexus.png',
  },
  {
    id: 'volt',
    name: 'VOLT',
    role: 'O Espírito da Energia Neural',
    description: 'Acelera a execução com precisão. Transforme intenção em progresso mensurável.',
    accentColor: '#FACC15',
    episode: 'S02E01',
    image: '/images/agentes/volt.png',
  },
  {
    id: 'kaos',
    name: 'KAOS',
    role: 'O Caos que Gera Ordem',
    description: 'Explora possibilidades extremas e sintetiza padrões para desbloquear novas estratégias.',
    accentColor: '#F97316',
    episode: 'S03E01',
    image: '/images/agentes/kaos.png',
  },
  {
    id: 'ethos',
    name: 'ETHOS',
    role: 'A Voz da Consciência',
    description: 'Valida decisões com ética aplicada e mantém o sistema alinhado com princípios.',
    accentColor: '#A78BFA',
    episode: 'S04E01',
    image: '/images/agentes/ethos.png',
  },
  {
    id: 'aurora',
    name: 'AURORA',
    role: 'A Criadora de Mundos',
    description: 'Gera cenários, protótipos e narrativas para ampliar visão e construir caminhos.',
    accentColor: '#EC4899',
    episode: 'S05E01',
    image: '/images/agentes/aurora.png',
  },
];

interface HeroBannerProps {
  onInfoClick?: () => void;
}

const ROTATION_MS = 6000;

export default function HeroBanner({ onInfoClick }: HeroBannerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);

  const agent = HERO_AGENTS[activeIndex] ?? HERO_AGENTS[0];

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

  const restartTimer = () => {
    if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (paused) return;
    intervalRef.current = globalThis.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_AGENTS.length);
      setProgressKey((k) => k + 1);
    }, ROTATION_MS);
  };

  useEffect(() => {
    restartTimer();
    return () => {
      if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [paused]);

  useEffect(() => {
    setProgressKey((k) => k + 1);
  }, [activeIndex]);

  const toggleMuted = () => {
    setMuted((prev) => {
      const next = !prev;
      try {
        globalThis.localStorage?.setItem('mente_ai_muted', next ? '1' : '0');
      } catch (_e) {
        void _e;
      }
      return next;
    });
  };

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    setProgressKey((k) => k + 1);
    restartTimer();
  };

  return (
    <section
      className="relative min-h-[88vh] w-full overflow-hidden flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-zinc-950" />

      <AnimatePresence mode="sync">
        <motion.img
          key={agent.id}
          src={agent.image}
          alt={agent.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{ filter: 'brightness(0.55)' }}
        />
      </AnimatePresence>

      <motion.div
        key={`radial-${agent.id}`}
        className="absolute inset-0"
        initial={{ opacity: 0.12 }}
        animate={{ opacity: 0.18 }}
        exit={{ opacity: 0.12 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(ellipse 70% 55% at 60% 40%, ${agent.accentColor}28 0%, transparent 62%)`,
        }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), ' +
          'linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent z-10" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${agent.id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-3xl space-y-6"
          >
            <div>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 text-white text-xs font-extrabold rounded-full border"
                style={{
                  background: `${agent.accentColor}22`,
                  borderColor: `${agent.accentColor}55`,
                  color: agent.accentColor,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AGENTE EM DESTAQUE
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight">
                {agent.name}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-200 font-semibold">
                {agent.role}
              </p>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                {agent.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <button
                type="button"
                onClick={() => router.push(`/player?episode=${agent.episode}`)}
                className="inline-flex items-center gap-2 px-6 py-3 text-zinc-950 font-extrabold rounded-xl transition-colors shadow-md"
                style={{ backgroundColor: agent.accentColor }}
              >
                <Play className="w-5 h-5" />
                Iniciar Missão
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onInfoClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-700/80 text-white font-semibold rounded-xl hover:bg-zinc-600 transition-colors border border-zinc-600"
              >
                <Info className="w-5 h-5" />
                Mais Informações
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_AGENTS.map((a, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={a.id}
              type="button"
              aria-label={`Ir para ${a.name}`}
              onClick={() => goTo(i)}
              className="h-[3px] rounded-full transition-all"
              style={{
                width: active ? 28 : 10,
                backgroundColor: active ? agent.accentColor : 'rgba(255,255,255,0.30)',
              }}
            />
          );
        })}
      </div>

      {!paused ? (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10">
          <motion.div
            key={`progress-${agent.id}-${progressKey}`}
            className="h-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: ROTATION_MS / 1000, ease: 'linear' }}
            style={{ backgroundColor: agent.accentColor }}
          />
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </div>
      </motion.div>

      <button
        type="button"
        onClick={toggleMuted}
        className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:border-white/30 transition"
        aria-label={muted ? 'Ativar som' : 'Silenciar'}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </section>
  );
}
