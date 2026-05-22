"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

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

const PARTICLE_COUNT = 30;
const COLORS = ["rgba(0,245,255,", "rgba(139,92,246,", "rgba(255,255,255,"];

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    opacity: Math.random() * 0.15 + 0.04,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 20,
  }));
}

export default function CinematicParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo(() => (mounted ? generateParticles() : []), [mounted]);

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: `${p.x}%`,
            y: `${p.y}%`,
          }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            x: [
              `${p.x}%`,
              `${p.x + p.driftX * 0.3}%`,
              `${p.x + p.driftX * 0.7}%`,
              `${p.x + p.driftX}%`,
            ],
            y: [
              `${p.y}%`,
              `${p.y + p.driftY * 0.3}%`,
              `${p.y + p.driftY * 0.7}%`,
              `${p.y + p.driftY}%`,
            ],
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
            background: `${COLORS[p.id % COLORS.length]}${p.opacity + 0.02})`,
            filter: "blur(1px)",
          }}
        />
      ))}
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.15) 100%)",
        }}
      />
    </div>
  );
}
