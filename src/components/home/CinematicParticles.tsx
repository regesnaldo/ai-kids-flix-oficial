"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
};

const COLORS = ["rgba(0,245,255,", "rgba(139,92,246,", "rgba(255,255,255,"];

function getParticleCount(): number {
  if (typeof window === "undefined") return 30;
  return window.innerWidth < 768 ? 12 : 30;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 1.2,
    opacity: Math.random() * 0.12 + 0.03,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 10,
    driftX: (Math.random() - 0.5) * 25,
    driftY: (Math.random() - 0.5) * 15,
  }));
}

export default function CinematicParticles() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo(() => {
    if (!mounted || prefersReducedMotion) return [];
    return generateParticles(getParticleCount());
  }, [mounted, prefersReducedMotion]);

  if (!mounted || prefersReducedMotion || particles.length === 0) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.15) 100%)" }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.x}%`, y: `${p.y}%` }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            x: [`${p.x}%`, `${p.x + p.driftX * 0.3}%`, `${p.x + p.driftX * 0.7}%`, `${p.x + p.driftX}%`],
            y: [`${p.y}%`, `${p.y + p.driftY * 0.3}%`, `${p.y + p.driftY * 0.7}%`, `${p.y + p.driftY}%`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `${COLORS[p.id % COLORS.length]}${p.opacity + 0.015})`,
            filter: "blur(1px)",
            willChange: "transform, opacity",
          }}
        />
      ))}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.15) 100%)" }} />
    </div>
  );
}
