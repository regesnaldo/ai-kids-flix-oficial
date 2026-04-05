"use client";

import { motion } from "framer-motion";

import type { Emotion } from "@/cognitive/audio/ambientEngine";

type ParticleMode = "ascending" | "descending" | "chaotic" | "floating";

interface ParticleFieldProps {
  emotion: Emotion;
  type: ParticleMode;
}

const particleColors: Record<Emotion, string> = {
  alegria: "#fbbf24",
  tristeza: "#3b82f6",
  tensao: "#dc2626",
  neutro: "#a855f7",
};

function animationByType(type: ParticleMode, i: number) {
  switch (type) {
    case "ascending":
      return { y: [80, -80], opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] };
    case "descending":
      return { y: [-80, 80], opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] };
    case "chaotic":
      return {
        x: [0, Math.sin(i) * 45, 0],
        y: [0, Math.cos(i) * 45, 0],
        opacity: [0, 1, 0],
        scale: [0.5, 1.5, 0.5],
      };
    case "floating":
    default:
      return { y: [0, -28, 0], opacity: [0.3, 0.95, 0.3], scale: [0.8, 1, 0.8] };
  }
}

export default function ParticleField({ emotion, type }: ParticleFieldProps) {
  const color = particleColors[emotion];
  const count = type === "chaotic" ? 50 : 30;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = ((i * 13.37) % 100).toFixed(4);
        const top = ((i * 7.91 + 12) % 100).toFixed(4);
        const duration = 2.2 + (i % 7) * 0.35;
        const delay = (i % 12) * 0.1;
        return (
          <motion.div
            key={`sim-particle-${i}`}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={animationByType(type, i)}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
