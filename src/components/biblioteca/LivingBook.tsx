"use client";

import Image from "next/image";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Cpu,
  Languages,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useMemo, useState, type MouseEvent } from "react";

import type { Agent } from "@/data/agents";

export interface LivingBookProps {
  agent: Agent;
  accentClass: string;
  onOpen: (agent: Agent) => void;
  highlighted?: boolean;
}

type LevelConfig = {
  glow: string;
  icon: LucideIcon;
  particles: boolean;
};

const levelConfig: Record<Agent["level"], LevelConfig> = {
  Fundamentos: { glow: "#3b82f6", particles: false, icon: Brain },
  Intermediário: { glow: "#22c55e", particles: false, icon: Languages },
  Avançado: { glow: "#f97316", particles: true, icon: Cpu },
  Mestre: { glow: "#a855f7", particles: true, icon: Sparkles },
};

export default function LivingBook({
  agent,
  accentClass,
  onOpen,
  highlighted = false,
}: LivingBookProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseRatio, setMouseRatio] = useState({ x: 0.5, y: 0.5 });

  const cfg = levelConfig[agent.level];
  const LevelIcon = cfg.icon;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    damping: 20,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    damping: 20,
    stiffness: 150,
  });

  const cardStyle = useMemo<MotionStyle>(
    () => ({
      rotateX,
      rotateY,
      transformStyle: "preserve-3d",
      transformPerspective: 800,
      boxShadow: isHovered
        ? `0 20px 45px ${cfg.glow}99, 0 0 60px ${cfg.glow}`
        : `0 10px 30px ${cfg.glow}99`,
      borderColor: isHovered ? `${cfg.glow}` : `${cfg.glow}66`,
    }),
    [cfg.glow, isHovered, rotateX, rotateY],
  );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = event.clientX - rect.left - width / 2;
    const mouseYFromCenter = event.clientY - rect.top - height / 2;
    const x = mouseXFromCenter / width;
    const y = mouseYFromCenter / height;
    setMouseRatio({ x: x + 0.5, y: y + 0.5 });
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      onClick={() => onOpen(agent)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMouseRatio({ x: 0.5, y: 0.5 });
        mouseX.set(0);
        mouseY.set(0);
      }}
      onMouseMove={handleMouseMove}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="living-book-card group w-full cursor-pointer text-left perspective-1000 preserve-3d"
      aria-label={`Abrir livro guiado por ${agent.technicalName}`}
      data-agent-id={agent.id}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(agent);
        }
      }}
    >
      <motion.article
        style={cardStyle}
        whileHover={{ scale: 1.08, z: 50, transition: { duration: 0.25 } }}
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className={`relative h-full overflow-hidden rounded-xl border bg-[#0d1327]/85 p-4 transition-all duration-300 ${
          highlighted
            ? "ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.45)]"
            : ""
        } preserve-3d`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl ${accentClass}`}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(220px at ${mouseRatio.x * 100}% ${mouseRatio.y * 100}%, ${cfg.glow}33, transparent 65%)`,
          }}
        />

        {cfg.particles ? (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.span
                key={`p-${agent.id}-${index}`}
                className="pointer-events-none absolute h-2 w-2 rounded-full"
                style={{
                  left: `${12 + index * 11}%`,
                  top: `${18 + (index % 2) * 55}%`,
                  backgroundColor: cfg.glow,
                  boxShadow: `0 0 15px ${cfg.glow}`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  x: [0, Math.sin(index) * 20, 0],
                }}
                transition={{
                  duration: 2.5 + index * 0.3,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        ) : null}

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] text-gray-200">
            <LevelIcon className="h-3 w-3" />
            {agent.level}
          </div>
          <motion.span
            animate={{ y: isHovered ? -3 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="rounded-md border border-white/15 bg-black/25 px-2 py-1 text-[10px] text-gray-200"
          >
            #{agent.discoveryOrder}
          </motion.span>
        </div>

        <div className="relative z-10 mt-3 flex gap-3">
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-white/15 bg-black/35">
            <Image
              src={agent.imageUrl}
              alt={agent.technicalName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-white">{agent.technicalName}</h3>
            <p className="truncate text-sm text-cyan-200">&quot;{agent.nickname}&quot;</p>
            <p className="mt-2 line-clamp-3 text-xs text-gray-300">{agent.description}</p>
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/35 px-2 py-1 text-[10px] text-cyan-200">
            <BookOpen className="h-3 w-3" />
            Guia: {agent.nickname}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-cyan-100">
            Abrir
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </motion.article>
    </motion.div>
  );
}
