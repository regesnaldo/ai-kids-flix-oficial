"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, BookOpen } from "lucide-react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
};

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 100;

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.3 + 0.2,
    color: Math.random() > 0.5 ? "0,212,255" : "139,92,246",
  };
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = [];
    let animationFrame = 0;

    const resize = () => {
      const width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      const height = canvas.parentElement?.offsetHeight ?? 300;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(width, height));
      }
    };

    const draw = () => {
      if (!isVisible) return;
      const width = canvas.parentElement?.offsetWidth ?? window.innerWidth;
      const height = canvas.parentElement?.offsetHeight ?? 300;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!prefersReducedMotion) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < CONNECTION_DISTANCE) {
            const opacity = 0.12 * (1 - distance / CONNECTION_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,212,255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) { animationFrame = requestAnimationFrame(draw); }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.5 }} aria-hidden="true" />
    </div>
  );
}

export default function FinalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-4 md:mx-16 mb-8 rounded-2xl overflow-hidden"
      style={{
        maxHeight: 300,
        background: "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(8,8,20,0.95))",
        border: "1px solid rgba(0,212,255,0.15)",
      }}
    >
      <ParticleCanvas />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(139,92,246,0.05) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-10">
        <h2 className="text-xl md:text-3xl font-black mb-3 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Pronto para transformar sua mente?
          </span>
        </h2>
        <p className="text-gray-400 text-base mb-6 max-w-lg">
          Entre no universo MENTE.AI. Conhecimento infinito, 12 agentes canônicos, uma jornada que vai mudar como você pensa.
        </p>

        <div className="flex flex-row gap-3">
          <Link
            href="/universo/nexus"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white transition-all duration-200"
            style={{ boxShadow: "0 0 15px rgba(0,212,255,0.5)" }}
          >
            <Rocket size={14} />
            Comece Grátis
          </Link>
          <Link
            href="/series"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200"
          >
            <BookOpen size={14} />
            Ver Conteúdo
          </Link>
        </div>

        <p className="text-gray-600 text-[11px] mt-4 font-mono">
          MENTE.AI — onde mentes são formadas, não formatadas.
        </p>
      </div>
    </motion.section>
  );
}
