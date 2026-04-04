"use client";

/**
 * MENTE.AI — Explosão de Confetti (Framer Motion puro)
 * src/components/combinacao/ConfettiBlast.tsx
 *
 * Gera N partículas coloridas que explodem do centro e caem por
 * gravidade simulada — sem dependências externas.
 *
 * Uso:
 *   <AnimatePresence>
 *     {ativar && <ConfettiBlast key="confetti" onDone={() => setAtivar(false)} />}
 *   </AnimatePresence>
 */

import { useEffect } from "react";
import { motion } from "framer-motion";

// ─── Configuração ─────────────────────────────────────────────────────────────

const TOTAL_PARTICULAS = 38;
const CORES = [
  "#f59e0b", "#fbbf24",   // ouro
  "#a855f7", "#9333ea",   // roxo
  "#3b82f6", "#60a5fa",   // azul
  "#22c55e", "#4ade80",   // verde
  "#f97316", "#fb923c",   // laranja
  "#ec4899", "#f472b6",   // rosa
];
const FORMAS = ["circle", "square", "rect"] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function aleatorio(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function gerarParticulas() {
  return Array.from({ length: TOTAL_PARTICULAS }, (_, i) => {
    const angulo = (i / TOTAL_PARTICULAS) * 360 + aleatorio(-20, 20);
    const dist   = aleatorio(80, 220);
    const rad    = (angulo * Math.PI) / 180;
    return {
      id: i,
      x: Math.cos(rad) * dist,
      y: Math.sin(rad) * dist - aleatorio(20, 80),   // tendência para cima
      rotacao: aleatorio(-360, 360),
      escala: aleatorio(0.5, 1.2),
      cor: CORES[Math.floor(Math.random() * CORES.length)],
      forma: FORMAS[Math.floor(Math.random() * FORMAS.length)],
      duracao: aleatorio(0.8, 1.4),
      delay: aleatorio(0, 0.2),
      tamanho: aleatorio(6, 12),
    };
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ConfettiBlastProps {
  /** Chamado quando todas as partículas terminam a animação */
  onDone?: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ConfettiBlast({ onDone }: ConfettiBlastProps) {
  // Desmonta após a animação mais longa (1.6s)
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  const particulas = gerarParticulas();

  return (
    <div
      data-testid="confetti"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 90,
      }}
    >
      {particulas.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y + 80,       // gravidade simulada (+80px extra)
            scale: p.escala,
            opacity: 0,
            rotate: p.rotacao,
          }}
          transition={{
            duration: p.duracao,
            delay: p.delay,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          style={{
            position: "absolute",
            width:  p.forma === "rect" ? p.tamanho * 1.8 : p.tamanho,
            height: p.forma === "rect" ? p.tamanho * 0.55 : p.tamanho,
            borderRadius: p.forma === "circle" ? "50%" : p.forma === "rect" ? 2 : 3,
            background: p.cor,
            boxShadow: `0 0 6px ${p.cor}88`,
          }}
        />
      ))}
    </div>
  );
}
