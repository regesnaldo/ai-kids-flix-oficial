"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Zap, Copy, Check, Trophy, Volume2 } from "lucide-react";

const TOOLTIP_KEY = "hud_tooltip_seen";

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

/** TTS text for the audio button */
const TTS_TEXT = `Olá! Este é seu painel de jornada.
Aqui você acompanha seu XP, episódios
assistidos e suas recompensas.
Quanto mais você aprender, mais sobe de nível!
Compartilhe seu link de convite e ganhe
recompensas incríveis. Acesse o blog para
saber todos os detalhes!`;

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
  const [tooltipSeen, setTooltipSeen] = useState(true);
  const [ttsState, setTtsState] = useState<"idle" | "loading" | "playing">("idle");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseMs = useRef(6000);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Tooltip localStorage ────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    setTooltipSeen(localStorage.getItem(TOOLTIP_KEY) === "1");
  }, []);

  const dismissTooltip = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOOLTIP_KEY, "1");
    setTooltipSeen(true);
  };

  // ── Timer helpers ────────────────────────────────────────────────
  const clearTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const startAutoClose = useCallback((ms: number) => {
    clearTimer();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      onPanelOpenChange?.(false);
    }, ms);
  }, [onPanelOpenChange]);

  // ── Open / Close ─────────────────────────────────────────────────
  const handleOpen = useCallback(() => {
    if (hidden) return;
    setOpen(true);
    onPanelOpenChange?.(true);
    dismissTooltip(); // close tooltip on first click
    clearTimer();
    startAutoClose(autoCloseMs.current);
  }, [hidden, onPanelOpenChange, startAutoClose]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onPanelOpenChange?.(false);
    onClose();
    clearTimer();
    // stop TTS
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setTtsState("idle");
  }, [onClose, onPanelOpenChange]);

  // ── Escape key ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // ── Cleanup on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ── Copy link ────────────────────────────────────────────────────
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── TTS ──────────────────────────────────────────────────────────
  const toggleTts = async () => {
    if (ttsState === "playing") {
      audioRef.current?.pause();
      audioRef.current = null;
      setTtsState("idle");
      return;
    }

    setTtsState("loading");
    try {
      const voiceId =
        process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_DEFAULT || "pNInz6obpgDQGcFmaJgB";
      const res = await fetch("/api/elevenlabs/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: TTS_TEXT, voice_id: voiceId }),
      });

      if (!res.ok) throw new Error("TTS fetch failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setTtsState("idle");
        audioRef.current = null;
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        setTtsState("idle");
        audioRef.current = null;
        URL.revokeObjectURL(url);
      };

      await audio.play();
      setTtsState("playing");
    } catch {
      setTtsState("idle");
    }
  };

  // ── Computed values ──────────────────────────────────────────────
  const currentLevel = levels
    .filter((l) => (xpData?.total ?? 0) >= l.xpRequired)
    .slice(-1)[0];
  const nextLevel = levels.find((l) => (xpData?.total ?? 0) < l.xpRequired);
  const xpPercent = Math.min(
    100,
    ((xpData?.total ?? 0) / (nextLevel?.xpRequired ?? 10000)) * 100
  );
  const todayPercent = Math.min(
    100,
    ((xpData?.today ?? 0) / (xpData?.dailyCeiling ?? 100)) * 100
  );

  if (hidden) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          FLOATING HUD ICON + TOOLTIP + HOVER LABEL
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!open && (
          <div className="fixed right-4 top-[45%] z-40 flex flex-col items-end gap-2">
            {/* First-time tooltip */}
            <AnimatePresence>
              {!tooltipSeen && (
                <motion.div
                  initial={{ opacity: 0, x: 12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="relative w-[260px] p-3.5 rounded-xl text-xs leading-relaxed"
                  style={{
                    background: "rgba(14, 20, 32, 0.96)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(0, 245, 255, 0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(0,245,255,0.06)",
                  }}
                >
                  {/* Arrow pointing to icon */}
                  <div
                    className="absolute -bottom-1.5 right-3 w-3 h-3 rotate-45"
                    style={{ background: "rgba(14, 20, 32, 0.96)", borderRight: "1px solid rgba(0,245,255,0.15)", borderBottom: "1px solid rgba(0,245,255,0.15)" }}
                  />
                  <p className="text-white/90 mb-2.5">
                    ✨ Sua jornada de aprendizado está aqui!
                    <br />
                    Clique para ver seu progresso
                  </p>
                  <button
                    onClick={dismissTooltip}
                    className="w-full px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 hover:brightness-110"
                    style={{
                      background: "rgba(0, 245, 255, 0.1)",
                      color: "var(--accent-cyan)",
                      border: "1px solid rgba(0, 245, 255, 0.15)",
                    }}
                  >
                    Entendi!
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon + hover label wrapper */}
            <div className="relative group">
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={handleOpen}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
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

              {/* Hover label */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <span
                  className="text-[10px] font-mono uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  Minha Jornada
                </span>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          BACKDROP (click outside to close)
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          HOLOGRAPHIC SLIDING PANEL
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 z-50 w-[300px] max-w-[300px] p-4 overflow-y-auto"
            style={{
              background: "rgba(14, 20, 32, 0.94)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(0, 245, 255, 0.08)",
              boxShadow: "-8px 0 40px rgba(0, 0, 0, 0.6)",
              maxHeight: "calc(100vh - 100px)",
            }}
            onMouseEnter={() => {
              clearTimer();
              autoCloseMs.current = 30000;
            }}
            onMouseLeave={() => {
              autoCloseMs.current = 6000;
              clearTimer();
              startAutoClose(6000);
            }}
          >
            {/* ── Close button ─────────────────────────────────── */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-50 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              aria-label="Fechar painel"
            >
              <X size={14} className="text-white/80" />
            </button>

            {/* ── Header ───────────────────────────────────────── */}
            <p
              className="text-[10px] font-mono uppercase tracking-[0.25em] mb-5"
              style={{ color: "var(--accent-cyan)" }}
            >
              JORNADA ATIVA
            </p>

            {/* ── Instructions box ─────────────────────────────── */}
            <div
              className="mb-5 p-3 rounded-xl text-[10px] leading-relaxed"
              style={{
                background: "#0e1420",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--accent-cyan)" }}
              >
                // COMO FUNCIONA
              </p>
              <div className="space-y-1.5 text-white/60">
                <p>🎬 Assista episódios → +10 XP</p>
                <p>⚡ Faça todas as escolhas → +5 XP</p>
                <p>🔗 Indique amigos → prêmios</p>
              </div>
              <Link
                href="/blog/como-funciona-o-sistema-de-recompensas"
                onClick={handleClose}
                className="inline-block mt-2 text-[10px] font-bold transition-colors duration-200 hover:brightness-125"
                style={{ color: "var(--accent-cyan)" }}
              >
                📖 Saiba mais no Blog →
              </Link>
            </div>

            {/* ── Username ─────────────────────────────────────── */}
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
              <span
                className="text-white text-sm font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {username}
              </span>
            </div>

            {/* ── XP Total Bar ─────────────────────────────────── */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/35">XP Total</span>
                <span className="text-white font-bold">
                  {(xpData?.total ?? 0).toLocaleString()} XP
                </span>
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

            {/* ── Stats row ────────────────────────────────────── */}
            <div
              className="flex justify-between text-xs mb-5 py-3"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span className="text-white/35">
                EPISÓDIOS{" "}
                <span className="text-white font-bold">{episodeCount}/500</span>
              </span>
              <span className="text-white/35">
                FASE{" "}
                <span className="text-white font-bold">
                  {currentLevel?.level ?? 0} DE 5
                </span>
              </span>
            </div>

            {/* ── Next reward progress ─────────────────────────── */}
            {nextLevel && (
              <div className="mb-4 p-3 rounded-lg" style={{ background: "var(--dark-card)" }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy size={12} style={{ color: "var(--accent-cyan)" }} />
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--accent-cyan)" }}
                  >
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

            {/* ── Action buttons: Share + Blog ─────────────────── */}
            <div className="flex gap-2 mb-4">
              {/* Share button */}
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all duration-300 hover:brightness-110"
                style={{
                  background: "rgba(0, 245, 255, 0.08)",
                  color: "var(--accent-cyan)",
                  border: "1px solid rgba(0, 245, 255, 0.12)",
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copiado!" : "Compartilhar"}
              </button>

              {/* Blog link */}
              <Link
                href="/blog/como-funciona-o-sistema-de-recompensas"
                onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold text-center transition-all duration-300 hover:brightness-110"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                📖 Blog →
              </Link>
            </div>

            {/* ── TTS Audio button ─────────────────────────────── */}
            <div className="mb-5">
              <button
                onClick={toggleTts}
                disabled={ttsState === "loading"}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                style={{
                  background:
                    ttsState === "playing"
                      ? "rgba(0, 245, 255, 0.12)"
                      : "rgba(255,255,255,0.03)",
                  color: ttsState === "playing" ? "var(--accent-cyan)" : "rgba(255,255,255,0.4)",
                  border:
                    ttsState === "playing"
                      ? "1px solid rgba(0, 245, 255, 0.2)"
                      : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {ttsState === "loading" ? (
                  <>
                    <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/30">Carregando...</span>
                  </>
                ) : ttsState === "playing" ? (
                  <>
                    <Volume2 size={12} />
                    <span>Ouvindo...</span>
                    {/* Waveform bars */}
                    <span className="flex items-end gap-px h-3">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className="w-0.5 bg-[var(--accent-cyan)] rounded-full animate-pulse"
                          style={{
                            height: `${6 + Math.sin(i * 1.5) * 4}px`,
                            animationDelay: `${i * 0.12}s`,
                            animationDuration: "0.6s",
                          }}
                        />
                      ))}
                    </span>
                  </>
                ) : (
                  <>
                    🔊 <span>Ouvir como funciona</span>
                  </>
                )}
              </button>
            </div>

            {/* ── Referral card ────────────────────────────────── */}
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

            {/* ── 5-Level Map ──────────────────────────────────── */}
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
                        background: unlocked
                          ? "var(--accent-cyan)"
                          : "rgba(255,255,255,0.06)",
                        boxShadow: unlocked
                          ? "0 0 6px rgba(0, 245, 255, 0.3)"
                          : "none",
                      }}
                    />
                    <span
                      className={unlocked ? "text-white/80" : "text-white/18"}
                      style={{ fontWeight: isCurrent ? 700 : 400 }}
                    >
                      {l.label}
                    </span>
                    {unlocked && (
                      <span
                        className="text-[10px] ml-auto"
                        style={{ color: "var(--accent-cyan)" }}
                      >
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
