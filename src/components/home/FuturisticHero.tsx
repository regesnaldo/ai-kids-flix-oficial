'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

const HERO_PHRASES = [
  'Aprenda IA com agentes vivos.',
  'Decisões narrativas moldam sua jornada.',
  'O metaverso responde ao seu pulso.',
];

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  hue: number;
};

function createParticle(canvasWidth: number, canvasHeight: number): Particle {
  const radius = Math.random() * 1.4 + 0.5;
  const speedX = (Math.random() - 0.5) * 0.2;
  const speedY = (Math.random() - 0.5) * 0.2;
  const hue = Math.random() * 360;
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius,
    speedX,
    speedY,
    hue,
  };
}

export default function FuturisticHero({
  onInfoClick,
  onEnterMetaverse,
}: {
  onInfoClick?: () => void;
  onEnterMetaverse?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedValue, setTypedValue] = useState('');
  const [typing, setTyping] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const grid = canvasRef.current;
    if (!grid) return;
    const resize = () => {
      grid.width = grid.clientWidth;
      grid.height = grid.clientHeight;
      const newParticles = Array.from({ length: 120 }, () =>
        createParticle(grid.width, grid.height)
      );
      setParticles(newParticles);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let anim: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX + ((mousePos.current?.x ?? canvas.width / 2) - p.x) * 0.0005;
        p.y += p.speedY + ((mousePos.current?.y ?? canvas.height / 2) - p.y) * 0.0005;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.35)`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim);
  }, [particles]);

  useEffect(() => {
    let timeout: number;
    const current = HERO_PHRASES[phraseIndex];
    if (typing) {
      timeout = window.setTimeout(() => {
        setTypedValue(current.slice(0, typedValue.length + 1));
        if (typedValue.length + 1 === current.length) {
          setTyping(false);
          timeout = window.setTimeout(() => setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length), 1200);
        }
      }, 80);
    } else {
      timeout = window.setTimeout(() => {
        setTypedValue('');
        setTyping(true);
      }, 700);
    }
    return () => clearTimeout(timeout);
  }, [typedValue, typing, phraseIndex]);

  const subtype = useMemo(() => {
    return HERO_PHRASES[phraseIndex];
  }, [phraseIndex]);

  return (
    <section
      className="relative min-h-[80vh] overflow-hidden rounded-b-[80px] border border-white/10 bg-black"
      onMouseMove={(event) =>
        (mousePos.current = { x: event.clientX, y: event.clientY })
      }
      onMouseLeave={() => (mousePos.current = null)}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(10,14,39,.8),_transparent_55%)]" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 py-16 md:px-16">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.4em] text-cyan-300/70">
            <Sparkles className="h-4 w-4 text-white" />
            Conectando consciências
          </div>
          <motion.h1
            className="text-[3.4rem] md:text-[4.5rem] leading-[1] font-extrabold text-white tracking-[-0.05em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            MENTE.AI
          </motion.h1>
          <p className="text-xl md:text-3xl text-white font-semibold">
            <span className="text-cyan-300">{typedValue}</span>
            <span className="text-white/30">|</span>
          </p>
          <div className="space-y-2 text-sm md:text-base text-white/70 leading-relaxed">
            <p>
              Experimente um dashboard que dança com suas emoções, muda cores e responde ao seu toque.
            </p>
            <p>
              A cada decisão, o metaverso te empurra para o próximo universo certo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onEnterMetaverse}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full text-black font-extrabold uppercase tracking-[0.4em] shadow-[0_0_32px_rgba(15,118,255,0.6)] transition"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--cognitive-accent, #00d9ff), #f97316)',
              }}
            >
              Entrar no Metaverso
            </motion.button>
            <button
              type="button"
              onClick={onInfoClick}
              className="px-6 py-3 text-xs md:text-sm uppercase tracking-[0.4em] rounded-full border border-white/30 text-white hover:border-white/80 transition"
            >
              Saber Mais
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
