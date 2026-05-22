"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Star, Copy, Check } from "lucide-react";

interface XpData {
  total: number;
  today: number;
  streak: number;
  dailyCeiling: number;
}

interface RewardLevel {
  level: number;
  label: string;
  xpRequired: number;
  referralsRequired: number;
  daysRequired: number;
  reward: string;
}

export function UserHud({
  username,
  xpData,
  levels,
  episodeCount,
  validReferrals,
  referralLink,
  hidden,
  onClose,
}: {
  username: string;
  xpData: XpData | null;
  levels: RewardLevel[];
  episodeCount: number;
  validReferrals: number;
  referralLink: string;
  hidden: boolean;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = useCallback(() => {
    if (hidden) return;
    setOpen(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 6000);
  }, [hidden]);

  useEffect(() => {
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLevel = levels
    .filter((l) => (xpData?.total ?? 0) >= l.xpRequired)
    .slice(-1)[0];
  const nextLevel = levels.find((l) => (xpData?.total ?? 0) < l.xpRequired);
  const xpPercent = Math.min(100, ((xpData?.total ?? 0) / (nextLevel?.xpRequired ?? 10000)) * 100);
  const todayPercent = Math.min(100, ((xpData?.today ?? 0) / (xpData?.dailyCeiling ?? 100)) * 100);

  if (hidden) return null;

  return (
    <>
      {/* Floating icon */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleOpen}
            className="fixed right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(0,240,255,0.12)",
              border: "1px solid rgba(0,240,255,0.25)",
              boxShadow: "0 0 16px rgba(0,240,255,0.15)",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Zap size={18} style={{ color: "var(--neon-cyan)" }} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[280px] p-5 overflow-y-auto"
            style={{
              background: "rgba(10,10,26,0.92)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(0,240,255,0.1)",
              boxShadow: "-4px 0 32px rgba(0,0,0,0.5)",
            }}
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => setOpen(false), 3000);
            }}
          >
            {/* Close */}
            <button onClick={() => { setOpen(false); onClose(); }} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={16} />
            </button>

            {/* Header */}
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4" style={{ color: "var(--neon-cyan)" }}>
              // JORNADA ATIVA
            </p>

            {/* Username */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(0,240,255,0.15)", color: "var(--neon-cyan)" }}>
                {username.charAt(0)}
              </div>
              <span className="text-white text-sm font-bold">{username}</span>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">XP Total</span>
                <span className="text-white font-bold">{(xpData?.total ?? 0).toLocaleString()} XP</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: "var(--neon-cyan)" }}
                  initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 0.8 }} />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                +{xpData?.today ?? 0} hoje · teto {xpData?.dailyCeiling ?? 100} XP/dia
              </p>
            </div>

            {/* Progress */}
            <div className="flex justify-between text-xs mb-4 py-2 border-y border-white/5">
              <span className="text-gray-400">EPISÓDIOS <span className="text-white">{episodeCount}/500</span></span>
              <span className="text-gray-400">FASE <span className="text-white">{currentLevel?.level ?? 0} DE 5</span></span>
            </div>

            {/* Next reward */}
            {nextLevel && (
              <div className="mb-4">
                <p className="text-[10px] text-gray-500 mb-1">PRÓXIMA RECOMPENSA</p>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1">
                  <motion.div className="h-full rounded-full" style={{ background: "#f59e0b" }}
                    initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 0.8 }} />
                </div>
                <p className="text-[10px] text-amber-400">
                  {nextLevel.xpRequired - (xpData?.total ?? 0)} XP → {nextLevel.reward}
                </p>
              </div>
            )}

            {/* Referrals */}
            <div className="mb-4 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">REFERRALS</span>
                <span className="text-white font-bold">{validReferrals}/7 válidos</span>
              </div>
              <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs transition"
                style={{ background: "rgba(0,240,255,0.08)", color: "var(--neon-cyan)", border: "1px solid rgba(0,240,255,0.15)" }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copiado!" : "Copiar link"}
              </button>
            </div>

            {/* Levels */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">NÍVEIS</p>
              {levels.map((l, i) => {
                const unlocked = (xpData?.total ?? 0) >= l.xpRequired;
                return (
                  <div key={l.level} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${unlocked ? "" : "opacity-30"}`}
                      style={{ background: unlocked ? "var(--neon-cyan)" : "#333" }} />
                    <span className={unlocked ? "text-white" : "text-gray-600"}>{l.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
