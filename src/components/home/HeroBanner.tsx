'use client';

/**
 * MENTE.AI — Hero Banner com Billboard rotativo
 * Billboard de destaque com rotação automática entre agentes.
 */

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
  const [progressKey, setProgressKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);

  const agent = HERO_AGENTS[activeIndex] ?? HERO_AGENTS[0];

  useEffect(() => {
    const restartTimer = () => {
      if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (paused) return;
      intervalRef.current = globalThis.setInterval(() => {
        setActiveIndex((i) => (i + 1) % HERO_AGENTS.length);
        setProgressKey((k) => k + 1);
      }, ROTATION_MS);
    };

    restartTimer();
    return () => {
      if (intervalRef.current) globalThis.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [paused]);

  useEffect(() => {
    setProgressKey((k) => k + 1);
  }, [activeIndex]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    setProgressKey((k) => k + 1);
  };

  return (
    <section
      className="relative min-h-[88vh] w-full overflow-hidden flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Base */}
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Imagem do agente como background com blur */}
      <AnimatePresence mode="sync">
        <motion.img
          key={agent.id}
          src={agent.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            filter: 'brightness(0.3) blur(4px) saturate(1.5)',
            transform: 'scale(1.1)',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </AnimatePresence>

      {/* Gradiente radial com cor do agente */}
      <motion.div
        key={`radial-${agent.id}`}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 35%, ${agent.accentColor}22 0%, transparent 60%),
                       radial-gradient(ellipse 50% 80% at 20% 80%, ${agent.accentColor}11 0%, transparent 50%)`,
        }}
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Grid sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradiente inferior */}
      <div className="absolute bottom-0 w-full h-[35vh] bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent z-10" />

      {/* ── Conteúdo ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${agent.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-2xl space-y-6"
          >
            {/* Badge */}
            <div>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-extrabold rounded-full border backdrop-blur-sm"
                style={{
                  background: `${agent.accentColor}18`,
                  borderColor: `${agent.accentColor}50`,
                  color: agent.accentColor,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AGENTE EM DESTAQUE
              </span>
            </div>

            {/* Título */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight drop-shadow-2xl">
                {agent.name}
              </h1>
              <p className="text-lg md:text-2xl text-zinc-200 font-semibold">
                {agent.role}
              </p>
              <p className="text-sm md:text-lg text-zinc-300 leading-relaxed max-w-xl">
                {agent.description}
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => router.push(`/player?episode=${agent.episode}`)}
                className="inline-flex items-center gap-2 px-6 py-3 text-zinc-950 font-extrabold rounded-xl transition-colors shadow-lg"
                style={{
                  backgroundColor: agent.accentColor,
                  boxShadow: `0 8px 32px ${agent.accentColor}40`,
                }}
              >
                <Play className="w-5 h-5" />
                Iniciar Missão
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onInfoClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-700/60 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-zinc-600/80 transition-colors border border-zinc-500/50"
              >
                <Info className="w-5 h-5" />
                Mais Informações
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Indicadores ── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_AGENTS.map((a, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={a.id}
              type="button"
              aria-label={`Ir para ${a.name}`}
              onClick={() => goTo(i)}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: active ? 28 : 10,
                backgroundColor: active ? agent.accentColor : 'rgba(255,255,255,0.25)',
              }}
            />
          );
        })}
      </div>

      {/* Barra de progresso */}
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/25 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
