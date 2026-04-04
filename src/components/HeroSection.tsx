'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FlaskConical, BarChart2, Zap } from 'lucide-react';

/* ─── Neural-network particle canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Dot = { x: number; y: number; vx: number; vy: number };
    const COUNT = 60;
    const MAX_DIST = 130;
    const dots: Dot[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147,51,234,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147,51,234,0.55)';
        ctx.fill();

        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* ─── NEXUS agent card ────────────────────────────────────────────────────── */
function NexusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
      className="relative flex flex-col items-center gap-3 rounded-2xl border border-purple-500/40 bg-[#0d0b1e]/80 p-5 backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.45)]"
    >
      {/* glow ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.18),transparent_65%)]" />

      {/* badge */}
      <span className="rounded-full border border-purple-400/50 bg-purple-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-purple-300">
        Agente #36
      </span>

      {/* avatar placeholder — energy figure */}
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-purple-500/60 bg-[#1a0d3a] shadow-[0_0_30px_rgba(147,51,234,0.5)]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.35),transparent_70%)]" />
        <Zap className="h-12 w-12 text-purple-300 drop-shadow-[0_0_8px_rgba(147,51,234,0.9)]" />
        {/* orbit rings */}
        <div className="pointer-events-none absolute inset-[-8px] animate-spin rounded-full border border-dashed border-purple-400/30 [animation-duration:8s]" />
        <div className="pointer-events-none absolute inset-[-18px] animate-spin rounded-full border border-dashed border-cyan-400/20 [animation-duration:14s] [animation-direction:reverse]" />
      </div>

      {/* name */}
      <div className="text-center">
        <p className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent">
          NEXUS
        </p>
        <p className="mt-0.5 text-sm text-gray-400">&ldquo;O Conector&rdquo;</p>
      </div>

      {/* stats row */}
      <div className="mt-1 grid w-full grid-cols-3 gap-2 text-center">
        {[
          { label: 'Conexões', value: '120' },
          { label: 'Sincronias', value: '∞' },
          { label: 'Nível', value: 'Mestre' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/5 py-1.5">
            <p className="text-xs font-bold text-white">{value}</p>
            <p className="text-[9px] text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <p className="mt-1 text-center text-[11px] leading-relaxed text-gray-400">
        Sincroniza jornadas entre todos os módulos do laboratório.
      </p>
    </motion.div>
  );
}

/* ─── HeroSection ─────────────────────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0f] py-20 md:py-28">
      {/* background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_50%_95%,rgba(6,182,212,0.15),transparent_40%)]" />

      {/* particle network */}
      <ParticleCanvas />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-[1fr_340px]">

        {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-4xl">
              MENTE.AI
            </span>
          </motion.div>

          {/* headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              Laboratório de{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Inteligência Viva
              </span>
            </h1>
            <p className="text-lg font-medium text-gray-300 md:text-xl">
              Onde mentes são formadas, não formatadas
            </p>
          </motion.div>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-xl text-sm leading-relaxed text-gray-400 md:text-base"
          >
            Uma plataforma com{' '}
            <span className="font-semibold text-purple-300">120 agentes especializados</span>{' '}
            em inteligência emocional, aprendizado profundo e autoconhecimento — cada um
            guiando sua jornada com precisão e propósito.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-3"
          >
            <Link

              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:brightness-110"
            >
              <FlaskConical className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Explorar Laboratório
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>

            <Link
              href="/conta"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
            >
              <BarChart2 className="h-4 w-4" />
              Minha Jornada
            </Link>
          </motion.div>

          {/* stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-6 border-t border-white/10 pt-6"
          >
            {[
              { value: '120', label: 'Agentes ativos' },
              { value: '6', label: 'Temporadas' },
              { value: '∞', label: 'Possibilidades' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent">
                  {value}
                </p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — NEXUS card ───────────────────────────────────── */}
        <div className="flex justify-center lg:justify-end">
          <NexusCard />
        </div>
      </div>
    </section>
  );
}
