'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface CinematicUniverseTransitionProps {
  open: boolean;
  fromUniverse: string;
  toUniverse: string;
  reason?: string;
  onComplete?: () => void;
}

function playVoiceCue(text: string) {
  if (typeof window === 'undefined' || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.95;
  utterance.pitch = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function CinematicUniverseTransition({
  open,
  fromUniverse,
  toUniverse,
  reason,
  onComplete,
}: CinematicUniverseTransitionProps) {
  useEffect(() => {
    if (!open) return;

    playVoiceCue(`Portal dimensional: ${fromUniverse} para ${toUniverse}`);
    const timeout = setTimeout(() => onComplete?.(), 1800);
    return () => clearTimeout(timeout);
  }, [open, fromUniverse, toUniverse, onComplete]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 z-50 pointer-events-none"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {[...Array(42)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-cyan-300"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 19) % 100}%`,
              }}
              animate={{
                scale: [0.5, 1.8, 0.4],
                opacity: [0, 1, 0],
                x: [0, ((i % 2 === 0 ? 1 : -1) * (14 + (i % 5) * 10))],
                y: [0, (8 + (i % 7) * 6)],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.02,
              }}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-cyan-300/40 bg-black/50 px-6 py-5 text-center shadow-[0_0_60px_rgba(34,211,238,0.25)]"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Gateway Sequence</p>
              <p className="mt-2 text-lg font-semibold text-white">{fromUniverse} → {toUniverse}</p>
              <p className="mt-2 text-sm text-white/70">{reason === 'stagnation' ? 'Recalibrando rota narrativa' : 'Sincronizando metaverso adaptativo'}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
