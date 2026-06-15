"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, ArrowRight } from "lucide-react";

interface RateLimitScreenProps {
  window: "5min" | "hour" | "day" | "global";
  resetIn: number; // seconds
  message?: { title: string; body: string; suggestion: string };
  cachedQuestions: string[];
  onTryCached: (question: string) => void;
  onReset: () => void;
}

export function RateLimitScreen({
  window: rlWindow,
  resetIn,
  message,
  cachedQuestions,
  onTryCached,
  onReset,
}: RateLimitScreenProps) {
  const [timeLeft, setTimeLeft] = useState(resetIn);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onReset();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onReset]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const progress = Math.min(100, ((resetIn - timeLeft) / resetIn) * 100);

  // Default message fallback
  const msg = message || {
    title: "🧠 Calibrando frequência neural...",
    body: "O laboratório está sincronizando seus experimentos. Novos experimentos estarão disponíveis em breve.",
    suggestion: "Enquanto isso, perguntas do cache respondem instantaneamente ⚡",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 p-8 max-w-lg mx-auto text-center"
    >
      {/* Animated brain/pulse icon */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.12)",
            boxShadow: "0 0 40px rgba(0,245,255,0.08)",
          }}
        >
          <Brain size={32} style={{ color: "var(--accent-cyan)" }} />
        </div>
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(0,245,255,0.15)" }}
        />
      </motion.div>

      {/* Title */}
      <h3
        className="text-lg font-bold leading-snug"
        style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-display)" }}
      >
        {msg.title}
      </h3>

      {/* Body */}
      <p className="text-white/45 text-sm leading-relaxed max-w-sm">{msg.body}</p>

      {/* Suggestion */}
      <p className="text-white/25 text-xs italic leading-relaxed">{msg.suggestion}</p>

      {/* Countdown + progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/25 mb-2">
          <span>Disponível em</span>
          <span className="text-white/50 font-bold">{display}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--accent-cyan)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Cached suggestions */}
      {cachedQuestions.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/15 mb-3">
            ⚡ Disponíveis agora (instantâneo)
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {cachedQuestions.slice(0, 6).map((q) => (
              <motion.button
                key={q}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onTryCached(q)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200 hover:brightness-125"
                style={{
                  background: "rgba(0,245,255,0.06)",
                  border: "1px solid rgba(0,245,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <Zap size={9} style={{ color: "var(--accent-cyan)" }} />
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Try again hint */}
      <p className="text-white/10 text-[9px] font-mono uppercase tracking-wider">
        {rlWindow === "day"
          ? "Reinicia à meia-noite"
          : rlWindow === "global"
          ? "Processando em lote"
          : "Calibrando frequência"}
      </p>
    </motion.div>
  );
}
