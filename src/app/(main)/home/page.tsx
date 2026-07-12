"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useOasis } from "@/providers/OasisProvider";
import { useSession } from "@/providers/SessionProvider";
import { createEmotionStyleElement, getPaletteFromEmotionalState, emotionPaletteToStyle } from "@/design-system/colorEngine";
import JourneyHub from "@/components/journey/JourneyHub";
import HomeErrorBoundary from "@/components/home/HomeErrorBoundary";
import NarrativeSuggestionCard from "@/components/universe/NarrativeSuggestionCard";
import { PresenceIndicator } from "@/components/PresenceIndicator";
import { presenceToBeacon } from "@/lib/navigation-hints/beacon-factory";
import { useNavigationStore } from "@/store/useNavigationStore";
import type { NarrativeSuggestion } from "@/engine/adaptive-router";
import { ArchetypeCard } from "@/components/home/ArchetypeCard";
import { getAgentColor } from "@/canon/agents/presence";
import CognitiveHero from "@/components/hero/CognitiveHero";

const AGENTS = [
  { id: "nexus", name: "NEXUS", role: "O Conector", faction: "INTELIGÊNCIA", color: getAgentColor("nexus"), image: "/images/agents/nexus.jpg" },
  { id: "volt", name: "VOLT", role: "O Energético", faction: "ENERGIA", color: getAgentColor("volt"), image: "/images/agents/volt.jpg" },
  { id: "aurora", name: "AURORA", role: "A Sintetizadora", faction: "INOVAÇÃO", color: getAgentColor("aurora"), image: "/images/agents/aurora.jpg" },
  { id: "kaos", name: "KAOS", role: "O Explorador", faction: "CAOS", color: getAgentColor("kaos"), image: "/images/agents/kaos.jpg" },
  { id: "cipher", name: "CIPHER", role: "O Analista", faction: "CRIPTOGRAFIA", color: getAgentColor("cipher"), image: "/images/agents/cipher.jpg" },
  { id: "ethos", name: "ETHOS", role: "O Filósofo", faction: "ÉTICA", color: getAgentColor("ethos"), image: "/images/agents/ethos.jpg" },
  { id: "lyra", name: "LYRA", role: "A Artista", faction: "CRIATIVIDADE", color: getAgentColor("lyra"), image: "/images/agents/lyra.jpg" },
  { id: "axiom", name: "AXIOM", role: "O Cientista", faction: "CIÊNCIA", color: getAgentColor("axiom"), image: "/images/agents/axiom.jpg" },
  { id: "stratos", name: "STRATOS", role: "O Estrategista", faction: "ESTRATÉGIA", color: getAgentColor("stratos"), image: "/images/agents/stratos.jpg" },
  { id: "terra", name: "TERRA", role: "A Guardiã", faction: "NATUREZA", color: getAgentColor("terra"), image: "/images/agents/terra.jpg" },
  { id: "prism", name: "PRISM", role: "O Revelador", faction: "FILOSOFIA", color: getAgentColor("prism"), image: "/images/agents/prism.jpg" },
  { id: "janus", name: "JANUS", role: "O Humorista", faction: "DUALIDADE", color: getAgentColor("janus"), image: "/images/agents/janus.jpg" },
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

function AvatarDropdown({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{
          width: "36px", height: "36px", borderRadius: "50%",
          border: "1.5px solid rgba(0,255,255,0.5)",
          background: "rgba(0,255,255,0.1)",
          color: "#00FFFF", fontFamily: "monospace", fontSize: "14px",
          fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: open ? "0 0 16px rgba(0,255,255,0.4)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "rgba(0,255,255,0.9)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(0,255,255,0.5)"
        }}
        aria-label="Menu do usuário"
      >
        {initials}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "44px", right: 0,
          minWidth: "180px", background: "rgba(0,0,0,0.95)",
          border: "1px solid rgba(0,255,255,0.2)", borderRadius: "6px",
          zIndex: 300, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 16px rgba(0,255,255,0.1)",
          animation: "fadeIn 0.15s ease",
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid rgba(0,255,255,0.1)",
            fontFamily: "monospace", fontSize: "12px", color: "#00FFFF",
          }}>
            {username}
          </div>
          <a href="/perfil" style={{
            display: "block", padding: "10px 16px", color: "#CCC",
            fontFamily: "monospace", fontSize: "12px", textDecoration: "none",
            transition: "background 0.15s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            PERFIL
          </a>
          <button onClick={onLogout} style={{
            width: "100%", textAlign: "left", padding: "10px 16px",
            background: "transparent", border: "none",
            color: "#FF6B6B", fontFamily: "monospace", fontSize: "12px",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            SAIR
          </button>
        </div>
      )}
    </div>
  )
}

function StatsPanel({ completedCount, xpTotal }: { completedCount: number; xpTotal: number | null }) {

  const items = [
    { label: "MUNDOS", value: `${completedCount}/12`, accent: "#00FFFF", href: "/universo" },
    { label: "MÓDULOS", value: "Em breve", accent: "#00FF88", href: "/series" },
    { label: "DECISÕES", value: "Em breve", accent: "#FFB347", href: "/aulas" },
    { label: "XP", value: xpTotal !== null ? String(xpTotal) : "...", accent: "#C084FC", href: "/blog/como-funciona-o-sistema-de-recompensas" },
  ]

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem",
      marginBottom: "1.5rem",
    }}>
      {items.map(item => (
        <Link key={item.label} href={item.href} style={{
          textDecoration: "none",
          textAlign: "center", padding: "12px 8px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
          transition: "all 0.3s ease",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = item.accent
            e.currentTarget.style.boxShadow = `0 0 12px ${item.accent}22`
            e.currentTarget.style.transform = "scale(1.03)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"
            e.currentTarget.style.boxShadow = "none"
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: "1.4rem", fontWeight: 700, color: item.accent, textShadow: `0 0 8px ${item.accent}44` }}>
            {item.value}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#888", marginTop: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  )
}

function HudBar({ completedCount, nextAgentName }: { completedCount: number; nextAgentName: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1rem",
      marginBottom: "2.5rem",
      padding: "10px 16px",
      background: "rgba(0,255,255,0.03)",
      border: "1px solid rgba(0,255,255,0.1)",
      clipPath: "polygon(12px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 12px)",
      fontFamily: "monospace",
    }}>
      <span style={{ fontSize: "11px", color: "#00FF88", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
        MUNDOS: {completedCount}/12
      </span>
      <div style={{ flex: 1, height: "2px", background: "rgba(0,255,255,0.1)" }}>
        <div style={{
          width: `${(completedCount / 12) * 100}%`,
          height: "100%", background: "#00FFFF",
          transition: "width 0.5s ease",
        }} />
      </div>
      <span style={{ fontSize: "10px", color: "#0088FF", whiteSpace: "nowrap" }}>
        PRÓXIMO: {nextAgentName}
      </span>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter();
  const { cognitiveProfile, progressionSnapshot, healthStatus } = useOasis();
  const { user, isLoading: sessionLoading } = useSession();

  const [narrativeSuggestions, setNarrativeSuggestions] = useState<NarrativeSuggestion[]>([]);
  const [presenceCounts, setPresenceCounts] = useState<Record<string, number>>({});
  const [xpTotal, setXpTotal] = useState<number | null>(null);
  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/narrative/suggest?currentAgent=nexus", { method: "GET", credentials: "include" })
      .then(res => res.json())
      .then(data => setNarrativeSuggestions(data.suggestion ? [data.suggestion] : []))
      .catch(() => setNarrativeSuggestions([]));
  }, [user?.id]);

  // Fetch XP total
  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/xp/award", { credentials: "include" })
      .then(res => res.json())
      .then(data => { if (typeof data.total === "number") setXpTotal(data.total); })
      .catch(() => {});
  }, [user?.id]);

  // Fetch presence counts + dispatch beacons
  useEffect(() => {
    const fetchPresence = () => {
      fetch("/api/presence", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setPresenceCounts(data);
          Object.entries(data as Record<string, number>).forEach(([id, count]) => {
            useNavigationStore.getState().addBeacon(presenceToBeacon(id, count));
          });
        })
        .catch(() => {});
    };
    fetchPresence();
    const int = setInterval(fetchPresence, 30000);
    return () => clearInterval(int);
  }, []);

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
    // Inject cyberpunk keyframes
    if (typeof document !== "undefined" && !document.getElementById("cyberpunk-keyframes")) {
      const style = document.createElement("style")
      style.id = "cyberpunk-keyframes"
      style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } } @keyframes pulse { 0%,100% { box-shadow: 0 0 8px rgba(0,255,255,0.15) } 50% { box-shadow: 0 0 20px rgba(0,255,255,0.35) } } @keyframes scanline { 0% { background-position: 0 0 } 100% { background-position: 0 100% } }`
      document.head.appendChild(style)
    }
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
    <HomeErrorBoundary>
    <div className="emotion-aware" style={{ minHeight: "100vh", color: "#ffffff", ...palette }}>
      <UtcClock />
      <FooterHud />

      {/* HERO — Cognitive Universe 3D */}
      <CognitiveHero showNavbar={false} fullScreen={false} />

      {/* MAIN CONTENT */}
      <main style={{ paddingTop: "140px", paddingBottom: "80px", maxWidth: "1200px", margin: "0 auto", padding: "140px 2rem 80px" }}>

        {/* GREETING */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", margin: 0, textShadow: "0 0 20px rgba(0,255,255,0.15)" }}>
            Bem-vindo, {username}
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: "1rem", color: "#00FFFF", margin: "0.5rem 0 0", textShadow: "0 0 10px rgba(0,255,255,0.2)" }}>
            Seu universo aguarda.
          </p>
        </div>

        {/* AGENTS GRID — Storyboard */}
        <section style={{
          backgroundImage: 'url(/images/storyboard/agents-grid.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '300px',
          position: 'relative',
          marginBottom: '2rem',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: '60px 20px', color: 'white' }}>
            <h2 style={{ fontFamily: 'monospace', color: '#00FFFF', fontSize: '1.5rem', letterSpacing: '4px', marginBottom: '8px' }}>12 UNIVERSOS DE IA</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>Escolha seu agente e comece sua jornada</p>
            <a href="/explorar" style={{ background: 'transparent', border: '1px solid #00FFFF', color: '#00FFFF', padding: '12px 32px', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '2px', cursor: 'pointer', textDecoration: 'none' }}>
              EXPLORAR UNIVERSOS →
            </a>
          </div>
        </section>

        {/* STATS ROW */}
        <StatsPanel completedCount={completedCount} xpTotal={xpTotal} />

        {/* ARCHETYPE CARD */}
        <ArchetypeCard />

        {/* PROGRESSION HUD */}
        <HudBar completedCount={completedCount} nextAgentName={nextAgent.name} />

        {/* JOURNEY HUB — jornada cognitiva completa */}
        <JourneyHub />

        {/* NARRATIVE SUGGESTIONS */}
        {narrativeSuggestions.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            {narrativeSuggestions.map((suggestion, index) => (
              <NarrativeSuggestionCard
                key={`${suggestion.targetAgent}-${index}`}
                suggestion={suggestion}
                index={index}
                variant="homeBanner"
                onSelect={(targetAgent) => router.push(`/universo/${targetAgent}`)}
              />
            ))}
          </section>
        )}

        {/* AGENT CARDS GRID — Metaverso Cinematográfico 3D */}
        <motion.div
          style={{
            perspective: "1000px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { transition: { staggerChildren: 0.05 } },
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          {AGENTS.map((agent, i) => {
            const unlocked = i < completedCount;
            const count = presenceCounts[agent.id] || 0;
            const intensity = count >= 10 ? "urgent" : count >= 3 ? "moderate" : "subtle";

            return (
              <motion.div
                key={agent.id}
                variants={{
                  hidden: { opacity: 0, y: 24, rotateY: -5 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <Link href={`/universo/${agent.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <motion.div
                    style={{
                      height: "240px",
                      backgroundImage: `url(${agent.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                      borderRadius: "12px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      background: unlocked
                        ? `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`
                        : "rgba(255,255,255,0.02)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: `1px solid ${unlocked ? agent.color + "80" : "rgba(255,255,255,0.08)"}`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 8,
                      borderColor: agent.color,
                      boxShadow: `0 0 30px ${agent.color}, 0 0 60px ${agent.color}66, 0 8px 30px rgba(0,0,0,0.5)`,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Imagem de fundo com filtro sci-fi */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `url(${agent.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                      filter: "grayscale(0.4) contrast(1.1) brightness(0.9)",
                      transition: "filter 0.4s ease",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.filter = "grayscale(0) contrast(1.15) brightness(1)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.filter = "grayscale(0.4) contrast(1.1) brightness(0.9)"}
                    />

                    {/* Overlay escuro inferior */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0) 100%)",
                      pointerEvents: "none",
                    }} />

                    {/* Info no canto inferior */}
                    <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
                      <p style={{
                        fontFamily: "var(--font-orbitron), 'Space Grotesk', sans-serif",
                        fontSize: "15px",
                        fontWeight: 800,
                        color: agent.color,
                        letterSpacing: "0.14em",
                        margin: "0 0 4px",
                        textTransform: "uppercase",
                        textShadow: `0 0 10px ${agent.color}, 0 0 20px ${agent.color}55`,
                      }}>
                        {agent.name}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "10px",
                        color: "#fff",
                        margin: "0 0 3px",
                        opacity: 0.85,
                      }}>
                        {agent.role}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "9px",
                        color: "#9ca3af",
                        margin: 0,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}>
                        {agent.faction}
                      </p>
                      <PresenceIndicator agentId={agent.id} count={count} color={agent.color} pulseIntensity={intensity} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

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

        {/* NEXUS PORTAL — Storyboard Cena 3 */}
        <section style={{
          backgroundImage: 'url(/images/storyboard/universe-entry.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          minHeight: '200px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative',
          borderRadius: '12px', overflow: 'hidden', marginTop: '2rem',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <Link href="/universo/nexus" style={{
            position: 'relative', display: "inline-flex", alignItems: "center", gap: "0.75rem",
            padding: "1rem 2.5rem",
            border: "1px solid rgba(0,255,255,0.3)", borderRadius: "8px",
            background: "rgba(0,255,255,0.05)", color: "#00FFFF",
            fontFamily: "monospace", fontSize: "14px",
            letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none",
            transition: "all 0.3s ease",
          }}>
            ✦ ENTRAR NO UNIVERSO NEXUS
          </Link>
        </section>

      </main>
    </div>
    </HomeErrorBoundary>
  );
}
