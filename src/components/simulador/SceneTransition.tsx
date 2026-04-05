"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { Emotion } from "@/cognitive/audio/ambientEngine";
import ParticleField from "@/components/simulador/ParticleField";

interface SceneTransitionProps {
  currentEmotion: Emotion;
}

const emotionConfig: Record<
  Emotion,
  {
    color: string;
    particles: "ascending" | "descending" | "chaotic" | "floating";
    flash: string;
  }
> = {
  alegria: {
    color: "from-yellow-600/20 to-orange-600/20",
    particles: "ascending",
    flash: "#fbbf24",
  },
  tristeza: {
    color: "from-blue-900/30 to-indigo-900/30",
    particles: "descending",
    flash: "#1e3a8a",
  },
  tensao: {
    color: "from-red-900/30 to-orange-900/30",
    particles: "chaotic",
    flash: "#dc2626",
  },
  neutro: {
    color: "from-purple-900/20 to-violet-900/20",
    particles: "floating",
    flash: "#581c87",
  },
};

export default function SceneTransition({ currentEmotion }: SceneTransitionProps) {
  const [previousEmotion, setPreviousEmotion] = useState<Emotion>("neutro");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentEmotion === previousEmotion) return;
    setIsTransitioning(true);
    const timer = window.setTimeout(() => {
      setIsTransitioning(false);
      setPreviousEmotion(currentEmotion);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [currentEmotion, previousEmotion]);

  const config = emotionConfig[currentEmotion];

  return (
    <>
      <AnimatePresence>
        {isTransitioning ? (
          <motion.div
            key={`flash-${currentEmotion}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-40"
            style={{ backgroundColor: config.flash }}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        key={`bg-${currentEmotion}`}
        className={`pointer-events-none fixed inset-0 z-0 bg-gradient-to-br ${config.color}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      />

      <ParticleField emotion={currentEmotion} type={config.particles} />
    </>
  );
}
