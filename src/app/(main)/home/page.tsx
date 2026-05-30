"use client";
import { useState, useRef, useEffect, useCallback, useMemo, memo, Suspense } from "react";
import Link from "next/link";
import { useOasis } from "@/providers/OasisProvider";
import { agentsShowcase } from "@/data/agents";
import NexusEntry from "@/components/home/NexusEntry";
import JourneyCards from "@/components/home/JourneyCards";
import UniversesGrid from "@/components/home/UniversesGrid";
import FinalCTA from "@/components/home/FinalCTA";
import dynamic from "next/dynamic";

const CinematicParticles = dynamic(
  () => import("@/components/home/CinematicParticles"),
  { ssr: false }
);

const WATCH_KEY = "mente_ai_watch_progress_v1";
const PROFILE_KEY = "mente_ai_profile_v1";

function getWatchMap(): Record<string, { watchedPct: number; completed: boolean }> {
  try { return JSON.parse(globalThis.localStorage?.getItem(WATCH_KEY) || "{}"); } catch { return {}; }
}

function getProfile(): { archetype?: string; emotionalScore?: number } {
  try { return JSON.parse(globalThis.localStorage?.getItem(PROFILE_KEY) || "{}"); } catch { return {}; }
}

/* ─── UTC Clock HUD ───────────────────────────────────────────── */

function UtcClock() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const iso = now.toISOString().replace("T", " // ").slice(0, 22);
      setClock(`UTC ${iso}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!clock) return null;

  return (
    <div style={{
      position: "fixed",
      top: "16px",
      right: "calc(200px + 2rem)",
      zIndex: 9999,
      color: "#0088FF",
      fontFamily: "monospace",
      fontSize: "10px",
      letterSpacing: "0.05em",
      opacity: 0.7,
      pointerEvents: "none",
    }}>
      {clock}
    </div>
  );
}

/* ─── Footer Status HUD ───────────────────────────────────────── */

function FooterHud() {
  return (
    <div style={{
      position: "fixed",
      bottom: "16px",
      left: "24px",
      zIndex: 9999,
      color: "#00FF88",
      fontFamily: "monospace",
      fontSize: "10px",
      opacity: 0.6,
      letterSpacing: "0.03em",
      pointerEvents: "none",
    }}>
      NEXUS PRIME // TORRE CENTRAL // SISTEMA OPERACIONAL
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────────── */

const Header = memo(function Header({ username, onLogout }: { username: string; onLogout?: () => void }) {
  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
      borderBottom: "1px solid rgba(0,255,255,0.1)",
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#FFFFFF" }}>
          MENTE<span style={{ color: "#FF0000" }}>.AI</span>
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#00FFFF", opacity: 0.8 }}>
          {username}
        </span>
        <button
          onClick={onLogout}
          style={{
            background: "transparent",
            border: "1px solid rgba(0,255,255,0.2)",
            borderRadius: "4px",
            color: "#00FFFF",
            fontFamily: "monospace",
            fontSize: "10px",
            padding: "4px 10px",
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,255,0.5)"; e.currentTarget.style.background = "rgba(0,255,255,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,255,0.2)"; e.currentTarget.style.background = "transparent"; }}
        >
          SAIR
        </button>
      </div>
    </header>
  );
});

/* ─── Greeting Section ───────────────────────────────────────── */

const Greeting = memo(function Greeting({ username, archetype }: { username: string; archetype: string }) {
  return (
    <div style={{ textAlign: "center", paddingTop: "100px", paddingBottom: "48px" }}>
      <h1 style={{
        fontSize: "2rem",
        color: "#FFFFFF",
        fontWeight: 400,
        margin: 0,
        marginBottom: "8px",
      }}>
        Bem-vindo, {archetype}
      </h1>
      <p style={{
        fontFamily: "monospace",
        fontSize: "1rem",
        color: "#00FFFF",
        margin: 0,
        letterSpacing: "0.05em",
      }}>
        Seu universo aguarda.
      </p>
    </div>
  );
});

/* ─── Progression Bar ────────────────────────────────────────── */

const ProgressionBar = memo(function ProgressionBar({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div style={{ padding: "0 24px 32px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "6px",
      }}>
        <span style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#00FF88",
          letterSpacing: "0.08em",
        }}>
          MUNDOS DESBLOQUEADOS: {completed}/{total}
        </span>
      </div>
      <div style={{
        width: "100%",
        height: "2px",
        background: "rgba(0,255,255,0.1)",
        position: "relative",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: "#00FFFF",
          transition: "width 0.5s ease",
          boxShadow: "0 0 8px rgba(0,255,255,0.4)",
        }} />
      </div>
    </div>
  );
});

/* ─── Agent Card ─────────────────────────────────────────────── */

const AgentCard = memo(function AgentCard({ agent, completed }: {
  agent: typeof agentsShowcase[0];
  completed: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/universo/${agent.id}/lab`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: hovered ? "rgba(0,255,255,0.08)" : "rgba(0,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(0,255,255,0.5)" : "rgba(0,255,255,0.15)"}`,
        borderRadius: "4px",
        padding: "20px",
        transition: "all 0.2s ease",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <div style={{
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#00FFFF",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
        }}>
          {agent.name}
        </div>
        <div style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: "#00FF88",
          letterSpacing: "0.05em",
        }}>
          {agent.category}
        </div>
        <div style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: completed ? "#00FF88" : "rgba(255,255,255,0.3)",
          letterSpacing: "0.05em",
          marginTop: "auto",
        }}>
          {completed ? "ONLINE" : "LOCKED"}
        </div>
      </div>
    </Link>
  );
});

/* ─── Agent Cards Grid ───────────────────────────────────────── */

const AgentCardsGrid = memo(function AgentCardsGrid({ agents, watchMap }: {
  agents: typeof agentsShowcase;
  watchMap: Record<string, { completed: boolean }>;
}) {
  return (
    <div style={{
      padding: "0 24px 48px",
      maxWidth: "1200px",
      margin: "0 auto",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
        className="agent-grid"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 900px) {
            .agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .agent-grid { grid-template-columns: 1fr !important; }
          }
        `}} />
        {agents.slice(0, 12).map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            completed={!!watchMap[agent.id]?.completed}
          />
        ))}
      </div>
    </div>
  );
});

/* ─── Quick Actions ──────────────────────────────────────────── */

const QUICK_ACTIONS = [
  { label: "MAPA GALACTICO", href: "/universo" },
  { label: "EXPLORAR", href: "/explorar" },
  { label: "LABORATORIO", href: "/lab" },
  { label: "AGENTES", href: "/agentes" },
] as const;

const QuickActions = memo(function QuickActions() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "12px",
      padding: "0 24px 48px",
      flexWrap: "wrap",
    }}>
      {QUICK_ACTIONS.map((action) => (
        <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid rgba(0,255,255,0.3)",
              color: "#00FFFF",
              fontFamily: "monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              padding: "10px 20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderRadius: "0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,255,255,0.1)";
              e.currentTarget.style.borderColor = "#00FFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(0,255,255,0.3)";
            }}
          >
            {action.label}
          </button>
        </Link>
      ))}
    </div>
  );
});

/* ─── Upgrade Prompt ─────────────────────────────────────────── */

const UpgradePrompt = memo(function UpgradePrompt() {
  return (
    <div style={{
      textAlign: "center",
      padding: "0 24px 48px",
    }}>
      <div style={{
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#00FF88",
        letterSpacing: "0.08em",
        marginBottom: "12px",
      }}>
        DESBLOQUEIE TODOS OS MUNDOS
      </div>
      <Link href="/planos" style={{ textDecoration: "none" }}>
        <button
          style={{
            background: "transparent",
            border: "1px solid #00FF88",
            color: "#00FF88",
            fontFamily: "monospace",
            fontSize: "12px",
            letterSpacing: "0.1em",
            padding: "10px 28px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            borderRadius: "0",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,255,136,0.1)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(0,255,136,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          UPGRADE
        </button>
      </Link>
    </div>
  );
});

/* ─── Page ───────────────────────────────────────────────────── */

export default function HomePage() {
  const { cognitiveProfile, progressionSnapshot, healthStatus } = useOasis();
  const [watchMap, setWatchMap] = useState<Record<string, { completed: boolean }>>({});

  useEffect(() => {
    setWatchMap(getWatchMap());
  }, []);

  // Progress from oasis runtime (not localStorage)
  const completedCount = useMemo(
    () => progressionSnapshot.totalCompleted,
    [progressionSnapshot.totalCompleted]
  );
  const hasProgress = useMemo(() => completedCount > 0, [completedCount]);

  // Personalized greeting from Memory Keeper cognitive profile
  const displayName = cognitiveProfile.archetype !== "explorer"
    ? cognitiveProfile.archetype.toUpperCase()
    : "EXPLORADOR";
  const isOnline = healthStatus === "optimal" || healthStatus === "degraded";

  const showUpgrade = hasProgress && completedCount >= 3;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      position: "relative",
    }}>
      {/* Scanline overlay */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        body { background: #000000 !important; }
      `}} />

      {/* HUD overlays */}
      <UtcClock />
      <FooterHud />

      {/* Section 1: Header */}
      <Header username={displayName} />

      {/* Section 2: Greeting */}
      <Greeting username={displayName} archetype={displayName} />

      {/* Section 3: Progression Bar */}
      <ProgressionBar completed={completedCount} total={12} />

      {/* Section 4: Agent Cards Grid */}
      <AgentCardsGrid agents={agentsShowcase} watchMap={watchMap} />

      {/* Section 5: Quick Actions */}
      <QuickActions />

      {/* Section 6: Upgrade Prompt (conditional) */}
      {showUpgrade && <UpgradePrompt />}

      {/* Keep existing cinematic particles (above the fold) */}
      <div style={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}>
        <Suspense fallback={null}>
          <CinematicParticles />
        </Suspense>
      </div>
    </div>
  );
}
