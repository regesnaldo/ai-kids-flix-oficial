"use client";

/**
 * ScrollIndicator
 * Indicador animado de scroll — estética Netflix/MENTE.AI.
 *
 * Comportamento:
 * - Aparece com fade-in após 1.2s (delay cinematográfico)
 * - Anima em loop vertical suave (bounce)
 * - Desaparece ao rolar > 80px (fade-out automático)
 * - Respeta prefers-reduced-motion (WCAG 2.1 AA)
 * - Fix Safari/iOS: translateZ(0) + backfaceVisibility
 *
 * Uso:
 * <ScrollIndicator />
 * <ScrollIndicator label="Descubra mais" onClick={() => scrollToSection()} />
 */

import { memo, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ScrollIndicatorProps {
  /** Texto acessível exibido abaixo do ícone (padrão: "Role para baixo") */
  label?: string;
  /** Deslocamento em px que dispara o fade-out (padrão: 80) */
  hideAfterPx?: number;
  /** Callback ao clicar — se omitido, faz scroll suave até 100vh */
  onClick?: () => void;
  /** Classe CSS adicional para o container */
  className?: string;
}

// ─── Constantes de animação ───────────────────────────────────────────────────

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 1.2 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

const BOUNCE_VARIANTS = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 1.6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
  static: { y: 0 }, // prefers-reduced-motion
};

// ─── Componente principal ─────────────────────────────────────────────────────

const ScrollIndicator = memo(function ScrollIndicator({
  label = "Role para baixo",
  hideAfterPx = 80,
  onClick,
  className = "",
}: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(true);
  const prefersReduced = usePrefersReducedMotion();

  // Oculta ao rolar
  const handleScroll = useCallback(() => {
    setVisible(window.scrollY <= hideAfterPx);
  }, [hideAfterPx]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll suave padrão (1 viewport)
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, [onClick]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-indicator"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClick}
          aria-label={label}
          title={label}
          className={`flex flex-col items-center gap-2 cursor-pointer border-none bg-transparent p-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent rounded-lg ${className}`}
          // Fix Safari/iOS — evita flicker em animações compostas
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Ícone animado */}
          <motion.div
            variants={BOUNCE_VARIANTS}
            animate={prefersReduced ? "static" : "animate"}
            style={{ transform: "translateZ(0)" }}
          >
            <ChevronDoubleDown />
          </motion.div>

          {/* Label */}
          <span
            className="text-xs font-medium tracking-widest uppercase select-none"
            style={{
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.18em",
              textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {label}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

// ─── Ícone interno (SVG puro — sem dependência extra) ─────────────────────────

function ChevronDoubleDown() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Chevron superior — mais opaco */}
      <path
        d="M7 8L14 15L21 8"
        stroke="url(#grad-top)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Chevron inferior — mais vívido */}
      <path
        d="M7 14L14 21L21 14"
        stroke="url(#grad-bottom)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="grad-top" x1="7" y1="8" x2="21" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="grad-bottom" x1="7" y1="14" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default ScrollIndicator;
