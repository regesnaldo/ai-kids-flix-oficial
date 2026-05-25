"use client";
import { useState, useRef, useEffect, useCallback, useMemo, memo, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Star, Zap } from "lucide-react";
import NexusEntry from "@/components/home/NexusEntry";
import JourneyCards from "@/components/home/JourneyCards";
import UniversesGrid from "@/components/home/UniversesGrid";
import FinalCTA from "@/components/home/FinalCTA";
import dynamic from "next/dynamic";
import { agentsShowcase } from "@/data/agents-showcase";
import { getAgentImage, AGENT_IMAGE_FALLBACK } from "@/lib/getAgentImage";
import { useOasis } from "@/providers/OasisProvider";

const CinematicParticles = dynamic(
  () => import("@/components/home/CinematicParticles"),
  { ssr: false }
);

const HeroBanner = memo(function HeroBanner({ displayName }: { displayName: string }) {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const brt = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      setTimestamp(`SYNC: ${brt} BRT`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '140px',
      background: 'linear-gradient(180deg, #000510 0%, #0a0a1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
    }}>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#00f5ff',
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
        opacity: 0.6,
      }}>
        NEXUS PRIME // TORRE CENTRAL // SETOR ALPHA-7
      </p>
      <h1 style={{
        fontSize: 'clamp(28px, 5vw, 48px)',
        color: '#ffffff',
        letterSpacing: '0.1em',
        fontWeight: 900,
        textAlign: 'center',
        margin: 0,
      }}>
        {displayName}
      </h1>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#00f5ff',
        opacity: 0.4,
        marginTop: '0.5rem',
      }}>
        {timestamp}
      </p>
    </div>
  );
});

/* ─── Section Divider ────────────────────────────────────────────────── */

const SectionDivider = memo(function SectionDivider() {
  return (
    <div className="w-full px-4 md:px-16 py-6" aria-hidden="true">
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.08), transparent)',
      }} />
    </div>
  );
});

const WATCH_KEY = "mente_ai_watch_progress_v1";
const PROFILE_KEY = "mente_ai_profile_v1";

function getWatchMap(): Record<string, { watchedPct: number; completed: boolean }> {
  try { return JSON.parse(globalThis.localStorage?.getItem(WATCH_KEY) || "{}"); } catch { return {}; }
}

function getProfile(): { archetype?: string; emotionalScore?: number } {
  try { return JSON.parse(globalThis.localStorage?.getItem(PROFILE_KEY) || "{}"); } catch { return {}; }
}

/* ─── Horizontal Scroll ──────────────────────────────────────────────── */

const HorizontalScroll = memo(function HorizontalScroll({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = useCallback((dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 440, behavior: "smooth" });
  }, []);

  const handleMouseEnter = useCallback(() => setShowArrows(true), []);
  const handleMouseLeave = useCallback(() => setShowArrows(false), []);

  return (
    <div className="w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {title && (
      <div className="flex items-center gap-4 mb-4 px-4 md:px-16">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <span className="text-sm text-gray-500 hidden md:inline">{subtitle}</span>}
      </div>
      )}
      <div className="relative">
        {showArrows && (
          <>
            <button onClick={() => scroll(-1)} className="absolute left-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-r-lg transition"><ChevronLeft size={24} color="#fff" /></button>
            <button onClick={() => scroll(1)} className="absolute right-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-l-lg transition"><ChevronRight size={24} color="#fff" /></button>
          </>
        )}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto px-4 md:px-16 pb-4 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", flexWrap: "nowrap" }}>
          {children}
        </div>
      </div>
    </div>
  );
});

/* ─── Agent Card (premium poster) ────────────────────────────────────── */

const AgentCard = memo(function AgentCard({ agent }: { agent: typeof agentsShowcase[0] }) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 cursor-pointer" style={{ width: 200 }}>
      <Link href={`/agentes/${agent.id}`}>
        <div className="relative rounded-lg overflow-hidden" style={{
          background: "#1A1A1A",
          aspectRatio: "2/3",
          boxShadow: hovered
            ? "0 0 24px rgba(0,245,255,0.3), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 2px 12px rgba(0,0,0,0.4)",
          border: hovered ? "1px solid rgba(0,245,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
          transition: "all 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <img src={getAgentImage(agent.id)} alt={agent.name} className="h-full w-full object-cover" loading="lazy" decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }} />
          <div className="absolute inset-0" style={{
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)"
              : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)",
            transition: "background 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
          {/* Subtle ring glow on hover */}
          <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-350"
            style={{
              opacity: hovered ? 1 : 0,
              boxShadow: "inset 0 0 30px rgba(0,245,255,0.08)",
            }} />
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-white/90 bg-black/30 backdrop-blur-sm"
                style={{ boxShadow: "0 0 20px rgba(0,245,255,0.3)" }}>
                <Play size={16} fill="#fff" color="#fff" />
              </div>
            </motion.div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h4 className="text-sm font-semibold text-white leading-tight"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              {agent.name}
            </h4>
            <p className="text-[11px] text-gray-300 mt-0.5">{agent.subtitle}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

/* ─── Page ───────────────────────────────────────────────────────────── */

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
  const totalXp = useMemo(() => completedCount * 55, [completedCount]);
  const hasProgress = useMemo(() => completedCount > 0, [completedCount]);

  // Personalized greeting from Memory Keeper cognitive profile
  const displayName = cognitiveProfile.archetype !== "explorer"
    ? `BEM-VINDO DE VOLTA, ${cognitiveProfile.archetype.toUpperCase()}`
    : "BEM-VINDO AO NEXUS";
  const isOnline = healthStatus === "optimal" || healthStatus === "degraded";

  return (
    <div className="min-h-screen homeContainer" style={{ background: "#0a0a1a" }}>
      <style jsx>{`
        .homeContainer::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(0,245,255,0.03) 0px,
              rgba(0,245,255,0.03) 2px,
              transparent 2px,
              transparent 4px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 59px,
              rgba(0,245,255,0.03) 59px,
              rgba(0,245,255,0.03) 60px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 59px,
              rgba(0,245,255,0.03) 59px,
              rgba(0,245,255,0.03) 60px
            );
        }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: "linear-gradient(to bottom, #0a0a1a, transparent)" }}>
        <div className="flex items-center justify-between w-full" style={{ pointerEvents: "auto" }}>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold"><span className="text-white">MENTE</span><span className="text-red-500">.AI</span></Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-white font-semibold">Início</Link>
              <Link href="/series" className="text-gray-400 hover:text-white transition">Séries</Link>
              <Link href="/agentes" className="text-gray-400 hover:text-white transition">Agentes</Link>
              <Link href="/explorar" className="text-gray-400 hover:text-white transition">Explorar</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2" style={{ color: '#00f5ff', opacity: 0.7, fontSize: '10px', fontFamily: 'monospace' }}>
              <span style={{
                display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
                background: '#4ade80', animation: 'pulse 2s ease-in-out infinite',
                boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
              }} />
              METAVERSE {isOnline ? "ONLINE" : "DEGRADED"}
            </div>
            {hasProgress && <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> {totalXp} XP</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-purple-400" /> {cognitiveProfile.archetype || "Explorador"}</span>
            </div>}
          </div>
        </div>
      </nav>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      {/* HERO: NEXUS cinematic entry */}
      <div style={{ position: "relative" }}>
        <NexusEntry />
        <Suspense fallback={
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.15) 100%)" }} />
          </div>
        }>
          <CinematicParticles />
        </Suspense>
      </div>

      {/* Transition gradient */}
      <div style={{
        height: '60px',
        background: 'linear-gradient(180deg, #000000 0%, #0a0a1a 100%)',
        position: 'relative',
        zIndex: 1,
        marginTop: '-1px',
      }} />

      <HeroBanner displayName={displayName} />

      {/* ── PORTALS SECTION ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #06060f 50%, #0a0a1a 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}>
        <div style={{ marginBottom: '0.5rem', padding: '0 4rem 0 4rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00f5ff', opacity: 0.6, margin: 0 }}>// PORTAIS DISPONÍVEIS</p>
          <div style={{ height: '1px', background: 'rgba(0,245,255,0.2)', marginTop: '0.25rem' }} />
        </div>
        <HorizontalScroll title={''} subtitle={''}>
          {agentsShowcase.slice(0, 12).map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </HorizontalScroll>
      </div>

      <SectionDivider />

      {/* ── JOURNEYS ── */}
      <JourneyCards />

      <SectionDivider />

      {/* ── UNIVERSES ── */}
      <UniversesGrid />

      <div style={{ paddingBottom: '2rem' }} />

      {/* ── CTA ── */}
      <FinalCTA />

      <div style={{ paddingBottom: '2rem' }} />
    </div>
  );
}
