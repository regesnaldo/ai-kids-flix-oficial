"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type ShelfTone = "fundamentos" | "linguagens" | "criacao" | "inovacao";

interface InfiniteShelvesProps {
  children: ReactNode;
  tone?: ShelfTone;
}

const toneStyles: Record<
  ShelfTone,
  { base: string; accent: string; border: string; glow: string }
> = {
  fundamentos: {
    base: "linear-gradient(180deg, rgba(30,58,138,0.24), rgba(10,13,24,0.92))",
    accent: "rgba(59,130,246,0.45)",
    border: "rgba(59,130,246,0.35)",
    glow: "rgba(59,130,246,0.28)",
  },
  linguagens: {
    base: "linear-gradient(180deg, rgba(20,83,45,0.24), rgba(10,13,24,0.92))",
    accent: "rgba(34,197,94,0.45)",
    border: "rgba(34,197,94,0.35)",
    glow: "rgba(34,197,94,0.28)",
  },
  criacao: {
    base: "linear-gradient(180deg, rgba(124,45,18,0.24), rgba(10,13,24,0.92))",
    accent: "rgba(249,115,22,0.45)",
    border: "rgba(249,115,22,0.35)",
    glow: "rgba(249,115,22,0.28)",
  },
  inovacao: {
    base: "linear-gradient(180deg, rgba(88,28,135,0.24), rgba(10,13,24,0.92))",
    accent: "rgba(168,85,247,0.45)",
    border: "rgba(168,85,247,0.35)",
    glow: "rgba(168,85,247,0.28)",
  },
};

const particleOffsets = [
  { x: "12%", y: "16%", size: 4 },
  { x: "28%", y: "72%", size: 5 },
  { x: "44%", y: "22%", size: 3 },
  { x: "61%", y: "64%", size: 4 },
  { x: "78%", y: "26%", size: 5 },
  { x: "90%", y: "74%", size: 3 },
];

export default function InfiniteShelves({
  children,
  tone = "fundamentos",
}: InfiniteShelvesProps) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const config = toneStyles[tone];
  const enableParallax = mounted && !isMobile && !reduceMotion;

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-18, 26]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const particleY = useTransform(scrollYProgress, [0, 1], [-40, 65]);

  const surfaceStyle = useMemo(
    () => ({
      borderColor: hovered ? `${config.border}` : "rgba(255,255,255,0.1)",
      boxShadow: hovered
        ? `0 18px 44px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.07)`
        : "0 10px 28px rgba(15,52,96,0.2)",
      background: config.base,
    }),
    [config.base, config.border, config.glow, hovered],
  );

  return (
    <motion.section
      ref={sectionRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={surfaceStyle}
      className="relative overflow-hidden rounded-2xl border p-6 transition-all duration-300"
    >
      <motion.div
        style={enableParallax ? { y: backgroundY } : undefined}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute -left-16 top-8 h-44 w-44 rounded-full blur-3xl"
          style={{ backgroundColor: config.accent }}
        />
        <div
          className="absolute -right-20 bottom-2 h-52 w-52 rounded-full blur-3xl"
          style={{ backgroundColor: `${config.accent}` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,transparent_45%)]" />
      </motion.div>

      <motion.div
        style={enableParallax ? { y: particleY } : undefined}
        className="pointer-events-none absolute inset-0"
      >
        {particleOffsets.map((item, index) => (
          <motion.span
            key={`${tone}-particle-${index}`}
            className="absolute rounded-full"
            style={{
              left: item.x,
              top: item.y,
              width: `${item.size}px`,
              height: `${item.size}px`,
              backgroundColor: config.accent,
              boxShadow: `0 0 12px ${config.accent}`,
              opacity: 0.7,
            }}
            animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.35, 1] }}
            transition={{
              duration: 3.5 + index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-[10%] h-px w-[80%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]" />

      <motion.div
        style={enableParallax ? { y: foregroundY } : undefined}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
