'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { CognitiveEmotion, detectEmotionFromInput } from '@/cognitive/colorEngine';

interface HeroSectionProps {
  onEnterNexus: () => void;
  onEmotionChange: (emotion: CognitiveEmotion) => void;
}

const subtitles = [
  'IA que sente contexto e responde em tempo real.',
  'Cada escolha muda seu universo narrativo.',
  'Do insight ao metaverso em segundos.',
];

function useTypewriterCycle(lines: string[]) {
  const [lineIndex, setLineIndex] = useState(0);
  const [display, setDisplay] = useState('');

  useEffect(() => {
    const line = lines[lineIndex];
    let char = 0;
    let forward = true;

    const interval = setInterval(() => {
      if (forward) {
        char += 1;
        setDisplay(line.slice(0, char));
        if (char >= line.length) forward = false;
      } else {
        if (char > 0) {
          char -= 1;
          setDisplay(line.slice(0, char));
        } else {
          setLineIndex((prev) => (prev + 1) % lines.length);
          forward = true;
          clearInterval(interval);
        }
      }
    }, forward ? 38 : 22);

    return () => clearInterval(interval);
  }, [lineIndex, lines]);

  return display;
}

function CosmosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = Array.from({ length: 120 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.8 + Math.random() * 1.8,
      speed: 0.0004 + Math.random() * 0.0015,
      depth: 0.5 + Math.random() * 1.5,
      hue: i % 2 === 0 ? 195 : 230,
    }));

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = Math.max(560, innerHeight * 0.82);
    };

    const onMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 18;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 14;
    };

    let raf = 0;
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > 1.03) p.y = -0.02;

        const px = p.x * width + pointer.current.x * p.depth;
        const py = p.y * height + pointer.current.y * p.depth;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 92%, 70%, 0.35)`;
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export default function HeroSection({ onEnterNexus, onEmotionChange }: HeroSectionProps) {
  const subtitle = useTypewriterCycle(subtitles);
  const [input, setInput] = useState('');

  const letters = useMemo(() => 'MENTE.AI HOME'.split(''), []);

  useEffect(() => {
    onEmotionChange(detectEmotionFromInput(input));
  }, [input, onEmotionChange]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_#111739,_#0a0a1a)] px-4 pb-8 pt-12 sm:px-7 md:px-10 md:pt-16">
      <CosmosCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a1a]/30 to-[#0a0a1a]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] tracking-[0.2em] text-white/70">
          SHOWCASE EXPERIENCE
        </div>

        <h1 className="text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-6xl">
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045, duration: 0.35 }}
              className="inline-block"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

        <p className="mt-4 min-h-[2rem] text-sm text-white/80 sm:text-base">
          {subtitle}
          <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-[var(--cognitive-accent)] align-middle" />
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <motion.button
            onClick={onEnterNexus}
            whileHover={{ scale: 1.03, paddingLeft: 30, paddingRight: 30 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-[linear-gradient(120deg,var(--cognitive-primary),var(--cognitive-secondary))] px-6 py-3 text-sm font-bold text-white shadow-[0_0_28px_var(--cognitive-glow)]"
            animate={{ boxShadow: ['0 0 10px var(--cognitive-glow)', '0 0 24px var(--cognitive-glow)', '0 0 10px var(--cognitive-glow)'] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Enter NEXUS
          </motion.button>

          <div className="group relative inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/75">
            <Info className="h-4 w-4 text-[var(--cognitive-accent)]" />
            Cognitive UI ativa
            <div className="pointer-events-none absolute -top-14 left-0 hidden w-64 rounded-lg border border-white/15 bg-[#0a0a1a]/95 p-2 text-[11px] text-white/70 shadow-xl group-hover:block">
              O sistema lê padrões de texto e ajusta a paleta da interface em 800ms para reforçar contexto emocional.
            </div>
          </div>
        </div>

        <div className="mt-6 max-w-2xl">
          <label htmlFor="cognitive-input" className="mb-2 block text-xs tracking-[0.16em] text-white/55">
            COGNITIVE INPUT
          </label>
          <input
            id="cognitive-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma intenção... (ex: quero explorar possibilidades)"
            className="w-full rounded-xl border border-white/15 bg-[#0b1026]/80 px-4 py-3 text-sm text-white outline-none transition duration-300 focus:border-[var(--cognitive-accent)]"
          />
        </div>
      </div>
    </section>
  );
}
