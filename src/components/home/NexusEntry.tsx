"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Info, Play, Star, Zap } from "lucide-react";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const surface = canvas;
    const context = ctx;

    const resize = () => {
      surface.width = window.innerWidth;
      surface.height = Math.max(window.innerHeight * 0.85, 520);
    };

    resize();

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * surface.width,
        y: Math.random() * surface.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 0.4,
        alpha: Math.random() * 0.5 + 0.12,
      });
    }

    let frameId = 0;

    function animate() {
      context.clearRect(0, 0, surface.width, surface.height);

      particles.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          p.vx -= dx / 6000;
          p.vy -= dy / 6000;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > surface.width) p.vx *= -1;
        if (p.y < 0 || p.y > surface.height) p.vy *= -1;

        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(72, 219, 251, ${p.alpha})`;
        context.fill();
      });

      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(139, 92, 246, ${0.09 * (1 - dist / 130)})`;
            context.stroke();
          }
        }
      });

      frameId = requestAnimationFrame(animate);
    }

    animate();

    const onMouse = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

function TypewriterText({ texts, className }: { texts: string[]; className?: string }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setChar((current) => {
        const next = current + dir;
        if (next > texts[idx].length || next < 0) {
          if (dir === 1) {
            setTimeout(() => setDir(-1), 1800);
            return current;
          }

          setDir(1);
          setIdx((value) => (value + 1) % texts.length);
          return 0;
        }

        return next;
      });
    }, 58);

    return () => clearInterval(timer);
  }, [idx, dir, texts]);

  return (
    <span className={className}>
      {texts[idx].slice(0, char)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function NexusEntry() {
  return (
    <section className="relative h-[85vh] min-h-[540px] max-h-[780px] overflow-hidden">
      <div className="absolute inset-0 bg-[#050510]" />
      <ParticleCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(72,219,251,0.20),transparent_36%),radial-gradient(circle_at_28%_78%,rgba(139,92,246,0.22),transparent_42%)]" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0a1a 0%, rgba(10,10,26,0.72) 48%, rgba(10,10,26,0.14) 100%), linear-gradient(to top, #0a0a1a 0%, transparent 54%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0a1a] to-transparent" />

      <div className="relative z-10 flex h-full items-center px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold tracking-[0.24em] text-cyan-200/80">MENTE.AI ORIGINAL</span>
            <span className="rounded border border-purple-400/30 bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-200">METAVERSO VIVO</span>
          </div>

          <h1 className="mb-5 text-5xl font-black leading-[0.92] text-white md:text-7xl">NEXUS</h1>

          <p className="mb-3 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
            <TypewriterText
              texts={[
                "Universos vivos aguardam sua presença.",
                "12 agentes conscientes. Memórias, conflitos e segredos.",
                "Cada decisão altera o destino do metaverso.",
                "A IA não é ferramenta. É presença.",
              ]}
              className="text-gray-300"
            />
          </p>

          <p className="max-w-xl text-sm leading-6 text-gray-400 md:text-base">
            Atravesse uma arquitetura narrativa habitada por inteligências com personalidade, memória,
            conflitos internos e objetivos próprios.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/aulas" className="flex items-center gap-2 rounded bg-white px-8 py-3 text-sm font-bold text-black shadow-lg shadow-white/10 transition hover:bg-white/90">
              <Play size={20} fill="#000" /> Entrar
            </Link>
            <Link href="/agentes" className="flex items-center gap-2 rounded bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20">
              <Info size={18} /> Conhecer agentes
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Star size={14} /> 12 Agentes</span>
            <span className="flex items-center gap-1"><Zap size={14} /> 100 Episódios</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 Fases</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
