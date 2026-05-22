"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Copy, Check, Trophy } from "lucide-react";

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

interface UserHudProps {
  username: string;
  xpData: XpData | null;
  levels: RewardLevel[];
  episodeCount: number;
  validReferrals: number;
  referralLink: string;
  /** Hidden entirely — e.g. during episode playback */
  hidden: boolean;
  /** Called when panel closes */
  onClose: () => void;
  /** Notify parent when panel is open (mutex with conquest) */
  onPanelOpenChange?: (open: boolean) => void;
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
  onPanelOpenChange,
}: UserHudProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseRef = useRef(6000);

  const clearTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleOpen = useCallback(() => {
    if (hidden) return;
    setOpen(true);
    onPanelOpenChange?.(true);
    clearTimer();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      onPanelOpenChange?.(false);
    }, autoCloseRef.current);
  }, [hidden, onPanelOpenChange]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onPanelOpenChange?.(false);
    onClose();
    clearTimer();
  }, [onClose, onPanelOpenChange]);

  useEffect(() => {
    return () => clearTimer();
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
      {/* Floating HUD icon — 40px, pulse, right edge */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleOpen}
            className="fixed right-4 top-[45%] z-40 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "rgba(0, 245, 255, 0.1)",
              border: "1px solid rgba(0, 245, 255, 0.2)",
              boxShadow: "0 0 20px rgba(0, 245, 255, 0.1)",
            }}
            aria-label="Abrir painel de progresso"
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Zap size={18} style={{ color: "var(--accent-cyan)" }} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Holographic sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[300px] p-5 overflow-y-auto"
            style={{
              background: "rgba(14, 20, 32, 0.94)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(0, 245, 255, 0.08)",
              boxShadow: "-8px 0 40px rgba(0, 0, 0, 0.6)",
            }}
            onMouseEnter={() => {
              clearTimer();
              autoCloseRef.current = 30000;
            }}
            onMouseLeave={() => {
              autoCloseRef.current = 6000;
              clearTimer();
              closeTimer.current = setTimeout(() => {
                setOpen(false);
                onPanelOpenChange?.(false);
              }, 6000);
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/25 hover:text-white transition-colors"
              aria-label="Fechar painel"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <p
              className="text-[10px] font-mono uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--accent-cyan)" }}
            >
              JORNADA ATIVA
            </p>

            {/* Username */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "rgba(0, 245, 255, 0.1)",
                  color: "var(--accent-cyan)",
                }}
              >
                {username.charAt(0)}
              </div>
              <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {username}
              </span>
            </div>

            {/* XP Total Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/35">XP Total</span>
                <span className="text-white font-bold">{(xpData?.total ?? 0).toLocaleString()} XP</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--accent-cyan)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-white/20 mt-1.5">
                +{xpData?.today ?? 0} hoje · teto {xpData?.dailyCeiling ?? 100} XP/dia
              </p>
            </div>

            {/* Stats row */}
            <div
              className="flex justify-between text-xs mb-5 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <span className="text-white/35">
                EPISÓDIOS <span className="text-white font-bold">{episodeCount}/500</span>
              </span>
              <span className="text-white/35">
                FASE <span className="text-white font-bold">{currentLevel?.level ?? 0} DE 5</span>
              </span>
            </div>

            {/* Next reward progress */}
            {nextLevel && (
              <div className="mb-5 p-3 rounded-lg" style={{ background: "var(--dark-card)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy size={12} style={{ color: "var(--accent-cyan)" }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-cyan)" }}>
                    Próxima Recompensa
                  </p>
                </div>
                <p className="text-white/60 text-xs mb-2">{nextLevel.label}</p>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-1.5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--accent-cyan)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/25">{xpData?.total ?? 0} XP</span>
                  <span className="text-white/25">{nextLevel.xpRequired} XP</span>
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: "var(--accent-cyan)" }}>
                  Faltam {nextLevel.xpRequired - (xpData?.total ?? 0)} XP → {nextLevel.reward}
                </p>
              </div>
            )}

            {/* Referral */}
            <div className="mb-5 p-3 rounded-lg" style={{ background: "var(--dark-card)" }}>
              <div className="flex justify-between text-xs mb-2.5">
                <span className="text-white/35">Indicações</span>
                <span className="text-white font-bold">{validReferrals}/7 válidas</span>
              </div>
              <button
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 hover:brightness-110"
                style={{
                  background: "rgba(0, 245, 255, 0.08)",
                  color: "var(--accent-cyan)",
                  border: "1px solid rgba(0, 245, 255, 0.12)",
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Link copiado!" : "Copiar link de convite"}
              </button>
            </div>

            {/* 5-Level Map */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/20 mb-2">
                Níveis de Recompensa
              </p>
              {levels.map((l) => {
                const unlocked = (xpData?.total ?? 0) >= l.xpRequired;
                const isCurrent = currentLevel?.level === l.level;
                return (
                  <div
                    key={l.level}
                    className="flex items-center gap-2.5 text-xs py-1"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: unlocked ? "var(--accent-cyan)" : "rgba(255,255,255,0.06)",
                        boxShadow: unlocked ? "0 0 6px rgba(0, 245, 255, 0.3)" : "none",
                      }}
                    />
                    <span
                      className={unlocked ? "text-white/80" : "text-white/18"}
                      style={{ fontWeight: isCurrent ? 700 : 400 }}
                    >
                      {l.label}
                    </span>
                    {unlocked && (
                      <span className="text-[10px] ml-auto" style={{ color: "var(--accent-cyan)" }}>
                        {l.reward}
                      </span>
                    )}
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
