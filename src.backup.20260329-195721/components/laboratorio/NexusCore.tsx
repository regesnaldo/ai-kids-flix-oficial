"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ORBITS = Array.from({ length: 8 });
const WAVES = Array.from({ length: 5 });
const LINES = Array.from({ length: 12 });

export default function NexusCore() {
  const [isActivated, setIsActivated] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/nexus-activate.mp3");
    audio.volume = 0.6;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const playFallbackTone = () => {
    if (typeof window === "undefined") return;
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  };

  const handleNexusClick = () => {
    setIsActivated(true);

    playFallbackTone();

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    window.setTimeout(() => setIsActivated(false), 1800);
  };

  return (
    <div className="pointer-events-none relative h-56 w-56 overflow-visible">
      <div className="absolute inset-0">
        {WAVES.map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/35"
            animate={{
              scale: isActivated ? [1, 3.8 + i * 0.25] : [1, 3 + i * 0.25],
              opacity: isActivated ? [0.65, 0] : [0.45, 0],
            }}
            transition={{
              duration: isActivated ? 1.2 : 1.8 + i * 0.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 224 224">
        <defs>
          <linearGradient id="nexusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {LINES.map((_, i) => {
          const angle = (i / LINES.length) * Math.PI * 2;
          const x2 = 112 + Math.cos(angle) * 92;
          const y2 = 112 + Math.sin(angle) * 92;
          return (
            <motion.line
              key={`line-${i}`}
              x1="112"
              y1="112"
              x2={x2}
              y2={y2}
              stroke="url(#nexusGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, isActivated ? 1 : 0.8, 0] }}
              transition={{ duration: isActivated ? 1.2 : 2, repeat: Infinity, delay: i * 0.12 }}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={handleNexusClick}
          className="pointer-events-auto relative h-48 w-48 cursor-pointer rounded-full focus:outline-none"
          aria-label="Ativar NEXUS"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400"
            animate={{
              scale: isActivated ? [1, 2, 1] : [1, 1.5, 1],
              opacity: isActivated ? [0.4, 1, 0.4] : [0.3, 0.85, 0.3],
            }}
            transition={{ duration: isActivated ? 0.6 : 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: "blur(20px)",
              boxShadow: isActivated
                ? "0 0 100px rgba(147, 51, 234, 1)"
                : "0 0 60px rgba(147, 51, 234, 0.8)",
            }}
          />

          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500"
            animate={{ scale: isActivated ? [1, 1.28, 1] : [1, 1.2, 1] }}
            transition={{ duration: isActivated ? 0.8 : 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 40px rgba(59, 130, 246, 0.9)" }}
          />

          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: i % 2 === 0 ? "#9333ea" : "#06b6d4",
                borderWidth: `${Math.max(1, 3 - i * 0.3)}px`,
              }}
              animate={{
                scale: [1 + i * 0.18, isActivated ? 2.5 + i * 0.3 : 2 + i * 0.28, 1 + i * 0.18],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: isActivated ? 1.3 + i * 0.15 : 2 + i * 0.25,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              }}
            />
          ))}
        </button>
      </div>

      {ORBITS.map((_, i) => {
        const angle = (i / ORBITS.length) * Math.PI * 2;
        const x = Math.cos(angle) * 72;
        const y = Math.sin(angle) * 72;
        return (
          <motion.div
            key={`orb-${i}`}
            className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-cyan-300"
            style={{ boxShadow: "0 0 12px rgba(6, 182, 212, 1)" }}
            animate={{
              x: [x, x * 1.2, x],
              y: [y, y * 1.2, y],
              scale: [1, 1.6, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1 + i * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        );
      })}

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 108;
        const left = (50 + (Math.cos(angle) * radius) / 2.24).toFixed(4);
        const top = (50 + (Math.sin(angle) * radius) / 2.24).toFixed(4);

        return (
          <motion.button
            key={`center-particle-${i}`}
            type="button"
            className="absolute z-[80] h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-0 p-0"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: i % 2 === 0 ? "#9333ea" : "#06b6d4",
              boxShadow: `0 0 15px ${i % 2 === 0 ? "#9333ea" : "#06b6d4"}`,
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
            whileHover={{ scale: 2, opacity: 1 }}
            onClick={(event) => {
              event.stopPropagation();
              handleNexusClick();
            }}
            title={`Partícula ${i + 1}`}
          />
        );
      })}

      <motion.div
        className="absolute left-1/2 top-[78%] -translate-x-1/2 text-center"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.04, 0.98] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-sm font-bold tracking-[0.22em] text-cyan-300">NEXUS</p>
        <p className="text-[11px] text-purple-300">O Conector</p>
      </motion.div>

      {isActivated ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="pointer-events-none absolute left-1/2 top-[72%] z-[110] -translate-x-1/2 text-center"
        >
          <div className="rounded-xl border border-cyan-400 bg-gradient-to-r from-purple-900/80 to-blue-900/80 px-6 py-3 shadow-[0_0_40px_rgba(6,182,212,0.5)]">
            <p className="text-lg font-bold tracking-[0.18em] text-cyan-300">NEXUS ATIVADO</p>
            <p className="text-xs text-purple-300">&quot;Eu conecto tudo. O que voce busca?&quot;</p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

