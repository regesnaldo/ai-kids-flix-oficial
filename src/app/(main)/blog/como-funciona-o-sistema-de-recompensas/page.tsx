"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  ShieldCheck,
  Star,
  Copy,
  Check,
} from "lucide-react";

// ── Level data (kept in sync with GamificationProvider) ──────────────
const LEVELS = [
  {
    level: 1,
    label: "Explorador Iniciante",
    xpRequired: 500,
    referralsRequired: 3,
    daysRequired: 7,
    reward: "10% desconto na assinatura",
    emoji: "🧭",
  },
  {
    level: 2,
    label: "Navegador Cósmico",
    xpRequired: 1500,
    referralsRequired: 7,
    daysRequired: 21,
    reward: "20% desconto na assinatura",
    emoji: "🚀",
  },
  {
    level: 3,
    label: "Arquiteto Neural",
    xpRequired: 3000,
    referralsRequired: 15,
    daysRequired: 45,
    reward: "1 mês de ChatGPT grátis",
    emoji: "🧠",
  },
  {
    level: 4,
    label: "Mestre do Metaverso",
    xpRequired: 6000,
    referralsRequired: 25,
    daysRequired: 90,
    reward: "Distintivo + acesso antecipado",
    emoji: "🌌",
  },
  {
    level: 5,
    label: "Lenda Viva",
    xpRequired: 10000,
    referralsRequired: 40,
    daysRequired: 180,
    reward: "Hall da Fama + surpresa",
    emoji: "👑",
  },
];

const XP_RULES = [
  {
    icon: "🎬",
    label: "Episódio completo",
    value: "+10 XP",
    detail: "Assista até o fim",
  },
  {
    icon: "⚡",
    label: "Todas as escolhas",
    value: "+5 XP",
    detail: "Faça todas as interações",
  },
  {
    icon: "🌅",
    label: "Primeiro do dia",
    value: "+2 XP bônus",
    detail: "Bônus diário de engajamento",
  },
  {
    icon: "⚠️",
    label: "Teto diário",
    value: "100 XP",
    detail: "Máximo por dia",
  },
];

const REFERRAL_RULES = [
  { icon: "🌐", text: "IP diferente do seu", ok: true },
  { icon: "📱", text: "Device diferente do seu", ok: true },
  { icon: "✉️", text: "Email verificado", ok: true },
  { icon: "🎬", text: "Assistiu 1 episódio completo", ok: true },
  { icon: "⏱️", text: "Ficou 10 min na plataforma", ok: true },
  { icon: "📅", text: "Conta com mais de 24h", ok: true },
  { icon: "⚠️", text: "Máximo 3 indicações válidas por semana", ok: false },
  { icon: "⏳", text: "Link expira em 30 dias", ok: false },
];

// ── Animated counter hook ────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let frame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return count;
}

// ── Section wrapper ──────────────────────────────────────────────────
function Section({
  id,
  label,
  title,
  children,
  center,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
  center?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`py-16 md:py-20 border-b border-white/[0.04] ${center ? "text-center" : ""}`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3 text-[var(--accent-cyan)]">
          {label}
        </p>
        <h2
          className="text-3xl md:text-4xl font-black tracking-tight mb-8 text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {children}
      </div>
    </motion.section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function RecompensasPage() {
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    // Try to get referral link from session
    navigator.clipboard.writeText(
      typeof window !== "undefined"
        ? `${window.location.origin}?ref=compartilhe`
        : "https://mente.ai?ref=compartilhe"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "var(--dark-bg)" }}
    >
      {/* ── Background ambient ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px] opacity-[0.04]"
          style={{ background: "var(--accent-cyan)" }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.03]"
          style={{ background: "var(--accent-cyan)" }}
        />
      </div>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header
        className="relative z-10 px-6 md:px-12 pt-40 pb-10 border-b border-white/[0.04]"
        style={{ background: "linear-gradient(180deg, rgba(0,245,255,0.03) 0%, transparent 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6"
          >
            <ArrowLeft size={12} />
            Blog
          </Link>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] mb-3 text-[var(--accent-cyan)]">
            MENTE.AI · SISTEMA DE PROGRESSÃO
          </p>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            // COMO FUNCIONA O SISTEMA
            <br />
            <span className="text-[var(--accent-cyan)]">DE RECOMPENSAS</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
            Cada episódio, cada escolha e cada amigo que você traz para o
            MENTE.AI te aproxima de recompensas reais. Entenda como subir de
            nível e desbloquear cada conquista.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs"
              style={{
                background: "var(--dark-card)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <span className="text-lg">🏆</span>
              <span className="text-white/40">5 Níveis de progressão</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs"
              style={{
                background: "var(--dark-card)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <span className="text-lg">⚡</span>
              <span className="text-white/40">Até 100 XP por dia</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs"
              style={{
                background: "var(--dark-card)",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <span className="text-lg">🔗</span>
              <span className="text-white/40">Indicações aceleram níveis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* ════════════════════════════════════════════════════════════
            SECTION 1 — O QUE É O XP?
            ════════════════════════════════════════════════════════════ */}
        <Section id="xp" label="// SEÇÃO 1" title="O que é o XP?">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Animated XP counter */}
            <div className="flex flex-col items-center md:items-start">
              <div
                className="relative w-48 h-48 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)",
                  border: "2px solid rgba(0,245,255,0.12)",
                }}
              >
                <AnimatedXpCounter />
              </div>
              <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mt-4">
                XP TOTAL ACUMULADO
              </p>
            </div>

            {/* Rules list */}
            <div className="space-y-4">
              {XP_RULES.map((rule, i) => (
                <motion.div
                  key={rule.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg flex-shrink-0">{rule.icon}</span>
                  <div>
                    <p className="text-white/80 text-sm font-bold">{rule.value}</p>
                    <p className="text-white/25 text-xs">
                      {rule.label}
                      {rule.detail ? ` — ${rule.detail}` : ""}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 2 — OS 5 NÍVEIS
            ════════════════════════════════════════════════════════════ */}
        <Section id="niveis" label="// SEÇÃO 2" title="Os 5 Níveis" center>
          <div className="relative">
            {/* Horizontal connector line */}
            <div
              className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {LEVELS.map((lvl, i) => (
                <LevelNode key={lvl.level} level={lvl} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 3 — COMO GANHAR XP
            ════════════════════════════════════════════════════════════ */}
        <Section id="ganhar" label="// SEÇÃO 3" title="Como Ganhar XP" center>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {XP_RULES.map((rule, i) => (
              <motion.div
                key={rule.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl text-center transition-all duration-300 hover:brightness-110"
                style={{
                  background: "var(--dark-card)",
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                <span className="text-3xl block mb-3">{rule.icon}</span>
                <p className="text-white/80 text-sm font-bold mb-1">
                  {rule.value}
                </p>
                <p className="text-white/30 text-xs">{rule.label}</p>
                <p className="text-white/15 text-[10px] mt-1">{rule.detail}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 4 — SISTEMA DE INDICAÇÕES
            ════════════════════════════════════════════════════════════ */}
        <Section id="indicacoes" label="// SEÇÃO 4" title="Sistema de Indicações">
          {/* Flow diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 mb-12">
            {[
              { icon: "🔗", label: "Você compartilha\no link" },
              { icon: "👤", label: "Amigo se\ncadastra" },
              { icon: "🎬", label: "Assiste 1 episódio\ncompleto" },
              { icon: "✅", label: "Indicação\nválida!" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl w-36"
                  style={{
                    background: "var(--dark-card)",
                    border: `1px solid ${
                      i === 3
                        ? "rgba(0,245,255,0.2)"
                        : "rgba(255,255,255,0.03)"
                    }`,
                  }}
                >
                  <span className="text-2xl">{step.icon}</span>
                  <span
                    className="text-[10px] leading-tight text-center whitespace-pre-line"
                    style={{
                      color: i === 3 ? "var(--accent-cyan)" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {step.label}
                  </span>
                </motion.div>
                {i < 3 && (
                  <span className="text-white/10 hidden md:block text-lg">→</span>
                )}
              </div>
            ))}
          </div>

          {/* Rules checklist */}
          <div
            className="max-w-2xl mx-auto p-6 rounded-2xl"
            style={{
              background: "var(--dark-card)",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5 text-[var(--accent-cyan)]">
              REGRAS DE VALIDAÇÃO
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {REFERRAL_RULES.map((rule, i) => (
                <motion.div
                  key={rule.text}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-2.5 text-xs py-2 px-3 rounded-lg ${
                    rule.ok ? "" : "opacity-70"
                  }`}
                  style={{
                    color: rule.ok ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)",
                    background: rule.ok ? "transparent" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <ShieldCheck
                    size={12}
                    style={{
                      color: rule.ok ? "#10b981" : "rgba(255,255,255,0.15)",
                    }}
                  />
                  <span className="flex-shrink-0 text-sm">{rule.icon}</span>
                  <span>{rule.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 5 — RECOMPENSAS
            ════════════════════════════════════════════════════════════ */}
        <Section id="recompensas" label="// SEÇÃO 5" title="Recompensas por Nível">
          <div className="space-y-4">
            {LEVELS.map((lvl, i) => (
              <RewardCard key={lvl.level} level={lvl} index={i} />
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════════════════════
            SECTION 6 — CTA
            ════════════════════════════════════════════════════════════ */}
        <Section id="cta" label="// SEÇÃO 6" title="Comece agora" center>
          <p className="text-white/30 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Compartilhe seu link de indicação e comece a acumular XP. Cada
            amigo que se cadastrar te aproxima do próximo nível.
          </p>

          <div className="flex flex-col items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={copyReferral}
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-base font-extrabold transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,245,255,0.15)]"
              style={{
                background: "var(--accent-cyan)",
                color: "var(--dark-bg)",
              }}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Link copiado!
                </>
              ) : (
                <>
                  <Share2 size={18} />
                  Compartilhar meu link agora →
                </>
              )}
            </motion.button>

            <Link
              href="/"
              className="text-white/20 text-xs hover:text-white/40 transition-colors duration-300 mt-2"
            >
              ← Voltar ao início
            </Link>
          </div>
        </Section>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center">
        <p className="text-white/10 text-[10px] font-mono uppercase tracking-[0.2em]">
          MENTE.AI — Sistema de Recompensas v1.0
        </p>
      </footer>
    </main>
  );
}

// ── Animated XP Counter ──────────────────────────────────────────────
function AnimatedXpCounter() {
  const count = useCountUp(10000, 2500);
  return (
    <div className="text-center">
      <motion.span
        className="text-4xl font-black tabular-nums block"
        style={{
          color: "var(--accent-cyan)",
          fontFamily: "var(--font-display)",
          textShadow: "0 0 30px rgba(0,245,255,0.3)",
        }}
      >
        {count.toLocaleString()}
      </motion.span>
      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/15 block mt-1">
        XP
      </span>
    </div>
  );
}

// ── Level Node ───────────────────────────────────────────────────────
function LevelNode({ level, index }: { level: (typeof LEVELS)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      className="relative p-5 rounded-xl text-center transition-all duration-300 hover:brightness-110 group"
      style={{
        background: "var(--dark-card)",
        border: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      {/* Node dot */}
      <div
        className="w-4 h-4 rounded-full mx-auto mb-3 relative z-10 ring-4 ring-[var(--dark-bg)]"
        style={{
          background: "var(--accent-cyan)",
          boxShadow: "0 0 12px rgba(0,245,255,0.4)",
        }}
      />

      <span className="text-2xl block mb-2">{level.emoji}</span>
      <p
        className="text-xs font-black mb-1 text-white/90"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Nível {level.level}
      </p>
      <p className="text-[11px] font-bold mb-2 text-[var(--accent-cyan)]">
        {level.label}
      </p>

      <div className="space-y-1 text-[10px] text-white/25">
        <p>
          <span className="text-white/40">XP</span> {level.xpRequired.toLocaleString()}
        </p>
        <p>
          <span className="text-white/40">Refs</span> {level.referralsRequired}
        </p>
        <p>
          <span className="text-white/40">Dias</span> {level.daysRequired}
        </p>
      </div>

      <div
        className="mt-3 pt-3 text-[10px] font-bold"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", color: "var(--accent-cyan)" }}
      >
        {level.reward}
      </div>
    </motion.div>
  );
}

// ── Reward Card ──────────────────────────────────────────────────────
function RewardCard({ level, index }: { level: (typeof LEVELS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl transition-colors duration-300 hover:bg-white/[0.02]"
      style={{
        background: "var(--dark-card)",
        border: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      {/* Level badge */}
      <div className="flex-shrink-0 flex items-center gap-3 sm:w-52">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: "rgba(0,245,255,0.08)",
            border: "1px solid rgba(0,245,255,0.1)",
          }}
        >
          {level.emoji}
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/15">
            NÍVEL {level.level}
          </p>
          <p className="text-sm font-bold text-white/80">{level.label}</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="flex-1 grid grid-cols-3 gap-3">
        <RequirementBar
          label="XP"
          value={level.xpRequired}
          max={10000}
          unit="XP"
          color="var(--accent-cyan)"
          delay={index * 0.1}
        />
        <RequirementBar
          label="Indicações"
          value={level.referralsRequired}
          max={40}
          unit="refs"
          color="#a855f7"
          delay={index * 0.1 + 0.1}
        />
        <RequirementBar
          label="Dias"
          value={level.daysRequired}
          max={180}
          unit="dias"
          color="#f97316"
          delay={index * 0.1 + 0.2}
        />
      </div>

      {/* Reward */}
      <div className="flex-shrink-0 sm:text-right">
        <p className="text-[10px] font-bold text-[var(--accent-cyan)]">
          <Star size={10} className="inline mr-1" />
          {level.reward}
        </p>
      </div>
    </motion.div>
  );
}

// ── Requirement Progress Bar ─────────────────────────────────────────
function RequirementBar({
  label,
  value,
  max,
  unit,
  color,
  delay,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  delay: number;
}) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div>
      <div className="flex justify-between text-[9px] mb-1">
        <span className="text-white/20">{label}</span>
        <span className="text-white/30">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
