"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AGENT_IMAGE_FALLBACK } from "@/lib/getAgentImage";
import type { HeroAgentPosition } from "@/config/heroAgents";

export interface HeroAgentProps {
  image: string;
  name: string;
  accentColor: string;
  position: HeroAgentPosition;
}

const POSITION_STYLES: Record<HeroAgentPosition, React.CSSProperties> = {
  "top-left":     { top: "-15%",  left: "-8%"  },
  "top-right":    { top: "-15%",  right: "-8%" },
  "bottom-left":  { bottom: "-15%", left: "-8%"  },
  "bottom-right": { bottom: "-15%", right: "-8%" },
};

const FLOAT_DELAY: Record<HeroAgentPosition, number> = {
  "top-left": 0,
  "top-right": 0.6,
  "bottom-left": 1.2,
  "bottom-right": 1.8,
};

export function HeroAgent({ image, name, accentColor, position }: HeroAgentProps) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        ...POSITION_STYLES[position],
        width: "clamp(140px, 20vw, 260px)",
        height: "clamp(140px, 20vw, 260px)",
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.55, 0.7, 0.55],
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 1, delay: FLOAT_DELAY[position] * 0.3 },
        y: {
          duration: 5 + FLOAT_DELAY[position],
          repeat: Infinity,
          ease: "easeInOut",
          delay: FLOAT_DELAY[position],
        },
      }}
    >
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          boxShadow: `0 0 60px -10px ${accentColor}40, inset 0 0 40px ${accentColor}15`,
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="260px"
          onError={(e) => { e.currentTarget.src = AGENT_IMAGE_FALLBACK; }}
          className="object-cover"
          style={{ filter: "brightness(0.65) saturate(1.1)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, transparent 40%, ${accentColor}22 100%)`,
          }}
        />
      </div>
      <span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.2em] uppercase whitespace-nowrap"
        style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}60` }}
      >
        {name}
      </span>
    </motion.div>
  );
}
