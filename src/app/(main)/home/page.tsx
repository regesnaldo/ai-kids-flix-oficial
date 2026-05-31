"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOasis } from "@/providers/OasisProvider";
import { useSession } from "@/providers/SessionProvider";
import { createEmotionStyleElement, getPaletteFromEmotionalState, emotionPaletteToStyle } from "@/design-system/colorEngine";

const AGENTS = [
  { id: "nexus", name: "NEXUS", faction: "INTELIGÊNCIA" },
  { id: "volt", name: "VOLT", faction: "ENERGIA" },
  { id: "aurora", name: "AURORA", faction: "INOVAÇÃO" },
  { id: "ethos", name: "ETHOS", faction: "ÉTICA" },
  { id: "kaos", name: "KAOS", faction: "CAOS" },
  { id: "cipher", name: "CIPHER", faction: "CRIPTOGRAFIA" },
  { id: "lyra", name: "LYRA", faction: "CRIATIVIDADE" },
  { id: "axiom", name: "AXIOM", faction: "ANÁLISE" },
  { id: "stratos", name: "STRATOS", faction: "ESTRATÉGIA" },
  { id: "terra", name: "TERRA", faction: "EMPATIA" },
  { id: "prism", name: "PRISM", faction: "FILOSOFIA" },
  { id: "janus", name: "JANUS", faction: "CONEXÃO" },
];

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
      position: "fixed", top: "80px", right: "24px",
      zIndex: 9999, color: "#0088FF", fontFamily: "monospace",
      fontSize: "10px", letterSpacing: "0.05em",
      opacity: 0.7, pointerEvents: "none",
    }}>
      {clock}
    </div>
  );
}

function FooterHud() {
  return (
    <div style={{
      position: "fixed", bottom: "16px", left: "24px",
      zIndex: 9999, color: "#00FF88", fontFamily: "monospace",
      fontSize: "10px", opacity: 0.6, letterSpacing: "0.03em",
      pointerEvents: "none",
    }}>
      NEXUS PRIME // TORRE CENTRAL // SISTEMA OPERACIONAL
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { cognitiveProfile, progressionSnapshot, healthStatus } = useOasis();
  const { user, isLoading: sessionLoading } = useSession();

  const completedCount = useMemo(
    () => progressionSnapshot.totalCompleted ?? 0,
    [progressionSnapshot.totalCompleted]
  );

  const username = !sessionLoading && user?.name
    ? user.name
    : cognitiveProfile.archetype !== "explorer"
      ? cognitiveProfile.archetype.toUpperCase()
      : "PARTICIPANTE";

  const isOnline = healthStatus === "optimal" || healthStatus === "degraded";
  const nextAgent = AGENTS[completedCount] ?? AGENTS[0];
  const showUpgrade = completedCount >= 3 && (!user || user.plan === "FREE");

  function handleLogout() {
    document.cookie = "mente_ai_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  }

  // ── Emotion Palette ────────────────────────────────────────────
  useEffect(() => {
    createEmotionStyleElement()
  }, [])

  const palette = useMemo(() => {
    // Derive emotion from health + progression signals
    if (!isOnline) return emotionPaletteToStyle(getPaletteFromEmotionalState(
      { dominantEmotion: 'fear', intensity: 0.5, targetColor: { r: 128, g: 0, b: 128 }, emotionalMemory: [], lastUpdate: Date.now(), stability: 0 }
    ))
    if (completedCount >= 6) return emotionPaletteToStyle(getPaletteFromEmotionalState(
      { dominantEmotion: 'joy', intensity: 0.7, targetColor: { r: 255, g: 200, b: 50 }, emotionalMemory: [], lastUpdate: Date.now(), stability: 0.8 }
    ))
    if (completedCount >= 3) return emotionPaletteToStyle(getPaletteFromEmotionalState(
      { dominantEmotion: 'curiosity', intensity: 0.6, targetColor: { r: 50, g: 200, b: 200 }, emotionalMemory: [], lastUpdate: Date.now(), stability: 0.6 }
    ))
    if (completedCount >= 1) return emotionPaletteToStyle(getPaletteFromEmotionalState(
      { dominantEmotion: 'surprise', intensity: 0.5, targetColor: { r: 255, g: 140, b: 0 }, emotionalMemory: [], lastUpdate: Date.now(), stability: 0.4 }
    ))
    return emotionPaletteToStyle(getPaletteFromEmotionalState(
      { dominantEmotion: 'neutral', intensity: 0, targetColor: { r: 128, g: 128, b: 128 }, emotionalMemory: [], lastUpdate: Date.now(), stability: 1 }
    ))
  }, [completedCount, isOnline])

  return (
    <div className="emotion-aware" style={{ minHeight: "100vh", color: "#ffffff", ...palette }}>
      <UtcClock />
      <FooterHud />

      {/* HEADER */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "1rem 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
        borderBottom: "1px solid rgba(0,255,255,0.1)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ffffff" }}>MENTE</span>
            <span style={{ color: "#E50914" }}>.AI</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{
            fontFamily: "monospace", fontSize: "10px",
            color: isOnline ? "#00FF88" : "#ff4444",
          }}>
            ● METAVERSE {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
          <button onClick={handleLogout} style={{
            background: "transparent",
            border: "1px solid rgba(0,255,255,0.3)",
            color: "#00FFFF", fontFamily: "monospace",
            fontSize: "11px", padding: "6px 16px",
            cursor: "pointer", letterSpacing: "0.05em",
          }}>
            SAIR
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ paddingTop: "140px", paddingBottom: "80px", maxWidth: "1200px", margin: "0 auto", padding: "140px 2rem 80px" }}>

        {/* GREETING */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
            Bem-vindo, {username}
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: "1rem", color: "#00FFFF", margin: "0.5rem 0 0" }}>
            Seu universo aguarda.
          </p>
        </div>

        {/* PROGRESSION BAR */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#00FF88", margin: "0 0 0.5rem" }}>
            MUNDOS DESBLOQUEADOS: {completedCount}/12
          </p>
          <div style={{ width: "100%", height: "2px", background: "rgba(0,255,255,0.1)", borderRadius: "1px" }}>
            <div style={{
              width: `${(completedCount / 12) * 100}%`,
              height: "100%", background: "#00FFFF",
              borderRadius: "1px", transition: "width 0.5s ease",
            }} />
          </div>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#0088FF", margin: "0.5rem 0 0" }}>
            PRÓXIMO: {nextAgent.name}
          </p>
        </div>

        {/* AGENT CARDS GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}>
          {AGENTS.map((agent, i) => {
            const unlocked = i < completedCount;
            return (
              <Link key={agent.id} href={`/universo/${agent.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: unlocked ? "rgba(0,255,255,0.05)" : "rgba(0,255,255,0.02)",
                  border: `1px solid ${unlocked ? "rgba(0,255,255,0.3)" : "rgba(0,255,255,0.1)"}`,
                  borderRadius: "4px", padding: "20px", cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(0,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,255,0.5)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = unlocked ? "rgba(0,255,255,0.05)" : "rgba(0,255,255,0.02)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = unlocked ? "rgba(0,255,255,0.3)" : "rgba(0,255,255,0.1)";
                  }}
                >
                  <p style={{ fontFamily: "monospace", fontSize: "14px", color: "#00FFFF", letterSpacing: "0.1em", margin: "0 0 0.25rem", textTransform: "uppercase" }}>
                    {agent.name}
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#00FF88", margin: "0 0 0.5rem" }}>
                    {agent.faction}
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: "10px", color: unlocked ? "#00FF88" : "rgba(255,255,255,0.3)", margin: 0 }}>
                    {unlocked ? "ONLINE" : "LOCKED"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {[
            { label: "MAPA GALÁCTICO", href: "/universo" },
            { label: "EXPLORAR", href: "/explorar" },
            { label: "LABORATÓRIO", href: "/lab" },
            { label: "AGENTES", href: "/agentes" },
          ].map(btn => (
            <Link key={btn.href} href={btn.href} style={{ textDecoration: "none" }}>
              <button style={{
                background: "transparent",
                border: "1px solid rgba(0,255,255,0.3)",
                color: "#00FFFF", fontFamily: "monospace",
                fontSize: "11px", padding: "10px 20px",
                cursor: "pointer", letterSpacing: "0.1em",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#00FFFF";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,255,0.3)";
                }}
              >
                {btn.label}
              </button>
            </Link>
          ))}
        </div>

        {/* UPGRADE PROMPT */}
        {showUpgrade && (
          <div style={{ textAlign: "center", padding: "2rem", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "4px" }}>
            <p style={{ fontFamily: "monospace", color: "#00FF88", fontSize: "14px", margin: "0 0 1rem" }}>
              DESBLOQUEIE TODOS OS MUNDOS
            </p>
            <Link href="/planos">
              <button style={{
                background: "transparent",
                border: "1px solid #00FF88",
                color: "#00FF88", fontFamily: "monospace",
                fontSize: "11px", padding: "10px 24px",
                cursor: "pointer", letterSpacing: "0.1em",
              }}>
                UPGRADE
              </button>
            </Link>
          </div>
        )}

        {/* NEXUS PORTAL */}
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
          <Link href="/universo/nexus" style={{
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            padding: "1rem 2.5rem",
            border: "1px solid rgba(0,255,255,0.3)", borderRadius: "8px",
            background: "rgba(0,255,255,0.05)", color: "#00FFFF",
            fontFamily: "monospace", fontSize: "14px",
            letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none",
            transition: "all 0.3s ease",
          }}>
            ✦ ENTRAR NO UNIVERSO NEXUS
          </Link>
        </div>

      </main>
    </div>
  );
}
