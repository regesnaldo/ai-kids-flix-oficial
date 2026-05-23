"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LabPromptInput } from "@/components/lab/LabPromptInput";
import { RateLimitScreen } from "@/components/lab/RateLimitScreen";
import { FlaskConical, Clock, ArrowRight, Wifi, WifiOff, Zap, FlaskRound, Dot } from "lucide-react";
import { findInLocalCache, saveToLocalCache, getLocalQuestions, normalizeQuestion } from "@/lib/client-cache";

const EXAMPLE_CHIPS = [
  "Como a IA aprende?",
  "O que é deep learning?",
  "Ética na IA",
  "Futuro da IA",
  "O que são LLMs?",
  "IA é criativa?",
];

// Cached questions that are in prebuilt cache (for ⚡ indicator)
const PREBUILT_CHIPS = [
  "como a ia aprende",
  "o que e deep learning",
  "o que e ia",
  "o que e machine learning",
  "o que e uma rede neural",
  "ia pode ser criativa",
  "o que sao tokens",
  "o que e um prompt",
  "como funciona o chatgpt",
  "qual a diferenca entre ia e machine learning",
  "futuro da ia",
  "o que e um transformer",
  "o que e etica na ia",
];

function isPrebuilt(question: string): boolean {
  const normalized = normalizeQuestion(question);
  return PREBUILT_CHIPS.includes(normalized);
}

interface PastExperiment {
  id: string;
  topic: string;
  completedAgents: number;
  createdAt: number;
}

export default function LabPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pastExperiments, setPastExperiments] = useState<PastExperiment[]>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [labMode, setLabMode] = useState<"fast" | "full">("full");
  const [localQuestions, setLocalQuestions] = useState<string[]>([]);

  // ── Rate limit state ──────────────────────────────────────────────
  const [rateLimit, setRateLimit] = useState<{
    window: string;
    resetIn: number;
    message: any;
    cachedQuestions: string[];
  } | null>(null);

  // ── Lab status (loaded once on mount, no polling) ──────────────────
  const [labStatus, setLabStatus] = useState<{ status: string; message: string }>({
    status: "green",
    message: "Laboratório operando em plena capacidade",
  });

  // Load status ONCE on mount
  useEffect(() => {
    fetch("/api/lab/status")
      .then((r) => r.json())
      .then((data) => setLabStatus({ status: data.status, message: data.message }))
      .catch(() => {});
  }, []); // empty deps = only on mount

  // ── Online/offline detection ──────────────────────────────────────
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // ── Load cached questions + mode + past experiments ─────────────
  useEffect(() => {
    setLocalQuestions(getLocalQuestions());
    try {
      const stored = localStorage.getItem("lab_experiments");
      if (stored) setPastExperiments(JSON.parse(stored));
      const mode = localStorage.getItem("mente_ai_lab_mode") as "fast" | "full" | null;
      if (mode) setLabMode(mode);
    } catch {}
  }, []);

  // ── Save mode ─────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("mente_ai_lab_mode", labMode);
  }, [labMode]);

  // ── Handle start ──────────────────────────────────────────────────
  const handleStart = useCallback(async (topic: string) => {
    setIsLoading(true);
    try {
      // STEP 1: Check localStorage cache FIRST
      const localCached = findInLocalCache(topic);
      if (localCached) {
        // Encode in URL and redirect
        const encoded = encodeURIComponent(JSON.stringify(localCached));
        router.push(`/lab/experiment/cached?data=${encoded}&mode=${labMode}`);
        return;
      }

      // STEP 2: Call API (server checks prebuilt → KV → new)
      const res = await fetch("/api/lab/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, mode: labMode }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setRateLimit({
          window: data.window || "5min",
          resetIn: data.resetIn || 300,
          message: data.message || null,
          cachedQuestions: getLocalQuestions(),
        });
        setIsLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Falha ao criar experimento");

      const data = await res.json();

      // STEP 3: If cache hit on server, display directly
      if (data.source === "cache" && data.instant) {
        saveToLocalCache(topic, data);
        const encoded = encodeURIComponent(JSON.stringify(data));
        router.push(`/lab/experiment/cached?data=${encoded}&mode=${labMode}`);
        return;
      }

      // STEP 4: Cache miss → go to experiment page
      const entry: PastExperiment = {
        id: data.experimentId,
        topic,
        completedAgents: 0,
        createdAt: Date.now(),
      };
      const updated = [entry, ...pastExperiments].slice(0, 10);
      setPastExperiments(updated);
      localStorage.setItem("lab_experiments", JSON.stringify(updated));

      router.push(`/lab/experiment/${data.experimentId}?mode=${labMode}`);
    } catch {
      setIsLoading(false);
    }
  }, [pastExperiments, router, labMode]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "#0e1420" }}
    >
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-[0.03]"
          style={{ background: "var(--accent-cyan)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.02]"
          style={{ background: "#a78bfa" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl"
            >
              🧪
            </motion.span>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--accent-cyan)" }}
            >
              MENTE.AI LAB
            </h1>
          </div>
          <p className="text-white/35 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Um prompt. Quatro agentes. Infinitas descobertas.
          </p>

          {/* ── Status indicator ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-1.5 mt-2"
          >
            <Dot
              size={18}
              className={
                labStatus.status === "green"
                  ? "text-green-400"
                  : labStatus.status === "yellow"
                  ? "text-yellow-400"
                  : "text-red-400 animate-pulse"
              }
            />
            <span className="text-[10px] font-mono text-white/20 tracking-wider">
              {labStatus.message}
            </span>
          </motion.div>
        </motion.div>

        {/* ── Rate limit screen ──────────────────────────────────── */}
        {rateLimit && (
          <RateLimitScreen
            window={rateLimit.window as any}
            resetIn={rateLimit.resetIn}
            message={rateLimit.message}
            cachedQuestions={rateLimit.cachedQuestions}
            onTryCached={(q) => {
              setRateLimit(null);
              handleStart(q);
            }}
            onReset={() => setRateLimit(null)}
          />
        )}

        {/* ── Offline banner ──────────────────────────────────────── */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-2xl p-4 rounded-xl flex items-start gap-3"
              style={{
                background: "rgba(255,107,53,0.06)",
                border: "1px solid rgba(255,107,53,0.15)",
              }}
            >
              <WifiOff size={18} className="text-[#ff6b35] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#ff6b35]">📡 Modo Offline</p>
                <p className="text-xs text-white/35 mt-0.5 leading-relaxed">
                  Sem conexão. Perguntas conhecidas funcionam normalmente.
                  Novas perguntas precisam de internet.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Economy mode toggle ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setLabMode("fast")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              labMode === "fast" ? "brightness-110" : "opacity-50 hover:opacity-75"
            }`}
            style={{
              background: labMode === "fast" ? "rgba(0,245,255,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${labMode === "fast" ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.05)"}`,
              color: labMode === "fast" ? "var(--accent-cyan)" : "rgba(255,255,255,0.3)",
            }}
          >
            <Zap size={12} />
            Modo Rápido
          </button>
          <button
            onClick={() => setLabMode("full")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              labMode === "full" ? "brightness-110" : "opacity-50 hover:opacity-75"
            }`}
            style={{
              background: labMode === "full" ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${labMode === "full" ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)"}`,
              color: labMode === "full" ? "#a78bfa" : "rgba(255,255,255,0.3)",
            }}
          >
            <FlaskRound size={12} />
            Modo Completo
          </button>
        </motion.div>

        {/* Mode description */}
        <p className="text-white/15 text-[10px] -mt-5 text-center max-w-md">
          {labMode === "fast"
            ? "⚡ NEXUS + AURORA · Resposta em segundos · 50% mais econômico"
            : "🔬 4 agentes · Experiência total · Análise profunda"}
        </p>

        {/* Prompt input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full"
        >
          <LabPromptInput onSubmit={handleStart} isLoading={isLoading} isCached={isPrebuilt} />
        </motion.div>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-sm"
            style={{ color: "var(--accent-cyan)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <FlaskConical size={18} />
            </motion.div>
            <span className="font-mono text-xs tracking-wider">
              {!isOnline ? "Verificando cache offline..." : "Instanciando laboratório..."}
            </span>
          </motion.div>
        )}

        {/* Past experiments */}
        {pastExperiments.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full mt-8"
          >
            <p
              className="text-[9px] font-mono uppercase tracking-[0.3em] mb-4 text-center"
              style={{ color: "var(--accent-cyan)" }}
            >
              EXPERIMENTOS ANTERIORES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pastExperiments.map((exp) => (
                <motion.button
                  key={exp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/lab/experiment/${exp.id}`)}
                  className="flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 hover:brightness-110"
                  style={{
                    background: "rgba(22, 29, 46, 0.6)",
                    border: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🧪</span>
                    <div>
                      <p className="text-white/70 text-xs font-bold">{exp.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-white/15" />
                        <span className="text-[9px] text-white/20">
                          {new Date(exp.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-[9px] text-white/10">·</span>
                        <span className="text-[9px] text-white/20">
                          {exp.completedAgents}/4 agentes
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-white/10 flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer label */}
        <p className="text-white/10 text-[9px] font-mono uppercase tracking-[0.2em] mt-4">
          {localQuestions.length > 0 ? `${localQuestions.length} offline · ` : ""}NEXUS · CIPHER · KAOS · AURORA
        </p>
      </div>
    </main>
  );
}
