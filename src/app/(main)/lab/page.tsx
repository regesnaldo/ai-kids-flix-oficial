"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { LabPromptInput } from "@/components/lab/LabPromptInput";
import { RateLimitScreen } from "@/components/lab/RateLimitScreen";
import { WifiOff } from "lucide-react";
import { findInLocalCache, saveToLocalCache, getLocalQuestions, normalizeQuestion } from "@/lib/client-cache";
import dynamic from "next/dynamic";

const LabCanvas = dynamic(() => import("@/components/lab/LabCanvas"), { ssr: false });
const AgentChatOverlay = dynamic(() => import("@/components/lab/AgentChatOverlay"), { ssr: false });

// ─── Design System ────────────────────────────────────────────────────────────
import { tokens } from "@/design-system/tokens";
import { typography, toStyle } from "@/design-system/typography";

// ─── Phase 3 — HUD Layer ─────────────────────────────────────────────────────
import { useLabInterface } from "@/components/lab/useLabInterface";
// ─── Phase 4 — Motion System ──────────────────────────────────────────────────
import { LabMotionController } from "@/components/motion";
import { useCognitiveStore } from "@/store/useCognitiveStore";
import {
  ScannerRing,
  SignalBars,
  GridOverlay,
  PulseBeacon,
  ActionNode,
  ClassificationTag,
  priorityToPulseBeaconState,
} from "@/components/hud";
import { SECTION_DISPLAY_NAMES, getActiveBeacons } from "@/lib/navigation-hints";
import { useNavigationStore } from "@/store/useNavigationStore";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const EXAMPLE_CHIPS = [
  "Como a IA aprende?",
  "O que e deep learning?",
  "Etica na IA",
  "Futuro da IA",
  "O que sao LLMs?",
  "IA e criativa?",
];

// Clearance tags for topic suggestions
const CHIP_CLEARANCE: Record<string, "surface" | "deep" | "core" | "restricted"> = {
  "Como a IA aprende?": "surface",
  "O que e deep learning?": "deep",
  "Etica na IA": "core",
  "Futuro da IA": "restricted",
  "O que sao LLMs?": "deep",
  "IA e criativa?": "surface",
};

// Cached questions that are in prebuilt cache
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

// ─── Mode description text ────────────────────────────────────────────────────

const MODE_DESCRIPTIONS: Record<"fast" | "full", string> = {
  fast: "NEXUS + AURORA · Resposta em segundos · 50% mais economico",
  full: "4 agentes · NEXUS + CIPHER + KAOS + AURORA · Analise profunda",
};

export default function LabPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pastExperiments, setPastExperiments] = useState<PastExperiment[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [labMode, setLabMode] = useState<"fast" | "full">("fast");
  const [localQuestions, setLocalQuestions] = useState<string[]>([]);

  // ─── Hydration safety ───────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);
    try {
      const saved = localStorage.getItem("mente_ai_lab_mode") as "fast" | "full" | null;
      if (saved === "fast" || saved === "full") {
        setLabMode(saved);
      }
    } catch {}
  }, []);

  // ─── Phase 3 — HUD Interface ────────────────────────────────────────────────
  const {
    currentState,
    statusText,
    hudConfig,
    beacons,
    mission,
  } = useLabInterface();
  const activeBeacons = getActiveBeacons(beacons);

  // ── Rate limit state ────────────────────────────────────────────────────────
  const [rateLimit, setRateLimit] = useState<{
    window: string;
    resetIn: number;
    message: any;
    cachedQuestions: string[];
  } | null>(null);

  // ── Lab status ──────────────────────────────────────────────────────────────
  const [labStatus, setLabStatus] = useState<{ status: string; message: string }>({
    status: "green",
    message: "Laboratorio operando em plena capacidade",
  });

  useEffect(() => {
    fetch("/api/lab/status")
      .then((r) => r.json())
      .then((data) => setLabStatus({ status: data.status, message: data.message }))
      .catch(() => {});
  }, []);

  // ── Online/offline detection ────────────────────────────────────────────────
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

  // ── Load cached questions + past experiments ────────────────────────────────
  useEffect(() => {
    setLocalQuestions(getLocalQuestions());
    try {
      const stored = localStorage.getItem("lab_experiments");
      if (stored) setPastExperiments(JSON.parse(stored));
    } catch {}
  }, []);

  // ── Save mode ───────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("mente_ai_lab_mode", labMode);
  }, [labMode]);

  // ── Cognitive decay tick ─────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      useCognitiveStore.getState().decayTick()
    }, 2000)
    return () => clearInterval(id)
  }, []);

  // ── Handle start ────────────────────────────────────────────────────────────
  const handleStart = useCallback(async (topic: string) => {
    setIsLoading(true);
    try {
      const localCached = findInLocalCache(topic);
      if (localCached) {
        const encoded = encodeURIComponent(JSON.stringify(localCached));
        router.push(`/lab/experiment/cached?data=${encoded}&mode=${labMode}`);
        return;
      }

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

      if (data.source === "cache" && data.instant) {
        saveToLocalCache(topic, data);
        const encoded = encodeURIComponent(JSON.stringify(data));
        router.push(`/lab/experiment/cached?data=${encoded}&mode=${labMode}`);
        return;
      }

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
      className={`${orbitron.variable} ${jetBrainsMono.variable} ${inter.variable} min-h-screen`}
      style={{
        background: tokens.color.system.idle,
        ...toStyle(typography.operational),
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          PHASE 3 + 4 — OVERLAY LAYER (HUD + Motion)
          ═══════════════════════════════════════════════════════════════════ */}
      {mounted && (
        <>
          {/* GridOverlay: scanner grid background */}
          <GridOverlay
            state={
              currentState === "scanning" || currentState === "processing"
                ? "scanning"
                : "idle"
            }
          />

          {/* TOP BAR — fixed, full width */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: tokens.zIndex.hud,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              background: tokens.color.surface.panel,
              borderBottom: tokens.border.subtle,
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Left: ScannerRing */}
            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
              <ScannerRing
                state={hudConfig.scannerRing ?? "idle"}
                size={36}
              />
              <span
                style={{
                  ...toStyle(typography.signal),
                  color: tokens.color.access.deep,
                }}
              >
                {statusText}
              </span>
            </div>

            {/* Right: SignalBars */}
            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
              {hudConfig.signalBars ? (
                <SignalBars state={hudConfig.signalBars} />
              ) : (
                <SignalBars state="weak" />
              )}
            </div>
          </div>

          {/* PulseBeacon: active discovery beacons */}
          {activeBeacons.length > 0 && (
            <div
              style={{
                position: "fixed",
                top: "60px",
                right: tokens.spacing.md,
                zIndex: tokens.zIndex.beacon,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.xs,
                maxWidth: "280px",
              }}
            >
              {activeBeacons.slice(0, 3).map((beacon) => (
                <PulseBeacon
                  key={beacon.id}
                  state={priorityToPulseBeaconState(beacon.priority)}
                  label={SECTION_DISPLAY_NAMES[beacon.section]}
                  subtitle={beacon.subtitle}
                  onNavigate={() => {
                    useNavigationStore.getState().pushHandoff(beacon.section);
                    router.push(beacon.route);
                  }}
                />
              ))}
            </div>
          )}

          {/* BOTTOM PANEL — mission continuity */}
          {mission && (
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: tokens.zIndex.hud,
                padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
                background: tokens.color.surface.panel,
                borderTop: tokens.border.subtle,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                ...toStyle(typography.restricted),
                color: tokens.color.text.tertiary,
              }}
            >
              <span>
                CAMADA ATUAL: {mission.currentLayer}
                {" · "}
                NOS DESBLOQUEADOS: {mission.unlockedNodes.length}
                {" · "}
                SINAIS ATIVOS: {activeBeacons.length}
              </span>
              <span style={{ color: tokens.color.access.deep }}>
                {statusText}
              </span>
            </div>
          )}

          {/* PHASE 4 — Motion Overlay (topmost layer) */}
          <LabMotionController />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          CONTENT AREA
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: tokens.zIndex.content,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: tokens.spacing.xl,
          padding: `${tokens.spacing.xxxl} ${tokens.spacing.md} ${tokens.spacing.xxxl}`,
          paddingTop: "80px", // clear top bar
          maxWidth: "720px",
          margin: "0 auto",
          minHeight: "100vh",
        }}
      >
        {/* ── BACK BUTTON ───────────────────────────────────────────────── */}
        <button
          onClick={() => router.back()}
          style={{
            alignSelf: "flex-start",
            padding: "6px 16px",
            fontSize: "0.85rem",
            color: "#A0A0B0",
            background: "transparent",
            border: "1px solid #2A2A3F",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← VOLTAR
        </button>

        {/* ── TITLE ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              ...toStyle(typography.broadcast),
              fontSize: "2.5rem",
              color: tokens.color.access.deep,
              textShadow: tokens.shadow.glowCyan,
              margin: 0,
            }}
          >
            MENTE.AI LAB
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: tokens.color.text.secondary,
              marginTop: tokens.spacing.sm,
            }}
          >
            Interface de experimentacao cognitiva
          </p>
        </div>

        {/* ── LAB STATUS ────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.sm,
            fontSize: "1rem",
            color: tokens.color.text.tertiary,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              backgroundColor:
                labStatus.status === "green"
                  ? tokens.color.text.success
                  : labStatus.status === "yellow"
                    ? tokens.color.text.warning
                    : tokens.color.text.danger,
              clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
            }}
          />
          <span>{labStatus.message}</span>
        </div>

        {/* ── MODE SELECTOR ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: tokens.spacing.md,
            justifyContent: "center",
          }}
        >
          <ActionNode
            state={labMode === "fast" ? "active" : "unlocked"}
            label="MODO RAPIDO"
            onClick={() => setLabMode("fast")}
          />
          <ActionNode
            state={labMode === "full" ? "active" : "unlocked"}
            label="MODO COMPLETO"
            onClick={() => setLabMode("full")}
          />
        </div>

        {/* Mode description */}
        <p
          style={{
            fontSize: "0.9rem",
            color: tokens.color.text.tertiary,
            textAlign: "center",
            marginTop: `-${tokens.spacing.lg}`,
          }}
        >
          {MODE_DESCRIPTIONS[labMode]}
        </p>

        {/* ── RATE LIMIT SCREEN ─────────────────────────────────────────── */}
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

        {/* ── OFFLINE BANNER ────────────────────────────────────────────── */}
        {!isOnline && (
          <div
            style={{
              width: "100%",
              maxWidth: "640px",
              padding: tokens.spacing.md,
              display: "flex",
              alignItems: "flex-start",
              gap: tokens.spacing.sm,
              border: tokens.border.danger,
              background: tokens.color.system.error,
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
            }}
          >
            <WifiOff size={16} style={{ color: tokens.color.danger.critical, flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p
                style={{
                  ...toStyle(typography.classifiedLabel),
                  color: tokens.color.text.danger,
                  margin: 0,
                }}
              >
                MODO OFFLINE
              </p>
              <p
                style={{
                  ...toStyle(typography.micro),
                  color: tokens.color.text.tertiary,
                  margin: 0,
                  marginTop: "2px",
                  lineHeight: "1.4",
                }}
              >
                Sem conexao. Perguntas conhecidas funcionam normalmente.
                Novas perguntas precisam de internet.
              </p>
            </div>
          </div>
        )}

        {/* ── TOPIC SUGGESTIONS ─────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            maxWidth: "600px",
          }}
        >
          {EXAMPLE_CHIPS.map((chip, idx) => {
            const colors = ["#00E5FF", "#7C3AED", "#00E5FF", "#7C3AED", "#00E5FF", "#7C3AED"];
            const bg = colors[idx % colors.length];
            return (
              <button
                key={chip}
                onClick={() => handleStart(chip)}
                disabled={isLoading}
                style={{
                  borderRadius: "50px",
                  padding: "12px 24px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: bg,
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* ── CHAT INPUT ────────────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            padding: tokens.spacing.md,
            border: tokens.border.subtle,
            borderLeft: `3px solid ${tokens.color.access.deep}`,
            background: tokens.color.surface.panel,
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
          }}
        >
          <LabPromptInput onSubmit={handleStart} isLoading={isLoading} isCached={isPrebuilt} />
        </div>

        {/* ── LOADING INDICATOR ─────────────────────────────────────────── */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.sm,
              ...toStyle(typography.signal),
              color: tokens.color.access.deep,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                border: `1px solid ${tokens.color.access.deep}`,
                borderTopColor: "transparent",
                animation: "lab-spin 1s linear infinite",
              }}
            />
            {!isOnline ? "Verificando cache offline..." : "Instanciando laboratorio..."}
          </div>
        )}

        {/* ── PAST EXPERIMENTS ──────────────────────────────────────────── */}
        {pastExperiments.length > 0 && !isLoading && (
          <div style={{ width: "100%", maxWidth: "560px" }}>
            <p
              style={{
                ...toStyle(typography.classifiedLabel),
                color: tokens.color.text.tertiary,
                marginBottom: tokens.spacing.md,
                textAlign: "center",
              }}
            >
              EXPERIMENTOS ANTERIORES
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.sm,
              }}
            >
              {pastExperiments.map((exp) => (
                <ActionNode
                  key={exp.id}
                  state="unlocked"
                  label={exp.topic}
                  onClick={() => router.push(`/lab/experiment/${exp.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── AGENT ROSTER FOOTER ───────────────────────────────────────── */}
        <p
          style={{
            ...toStyle(typography.micro),
            color: tokens.color.text.tertiary,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          {localQuestions.length > 0 ? `${localQuestions.length} OFFLINE · ` : ""}
          NEXUS · CIPHER · KAOS · AURORA
        </p>
      </div>

      {/* Three.js canvas + Chat overlay — only after mount */}
      {mounted && <LabCanvas />}
      {mounted && <AgentChatOverlay />}

      {/* Global keyframe for loading spinner */}
      <style jsx global>{`
        @keyframes lab-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
