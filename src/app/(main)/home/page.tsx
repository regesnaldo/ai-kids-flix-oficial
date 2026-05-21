"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Star, Zap } from "lucide-react";
import { SuaJornada } from "@/components/SuaJornada";
import NexusEntry from "@/components/home/NexusEntry";
import JourneyCards from "@/components/home/JourneyCards";
import UniversesGrid from "@/components/home/UniversesGrid";
import FinalCTA from "@/components/home/FinalCTA";
import { agentsShowcase } from "@/data/agents-showcase";

function HeroBanner() {
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
      height: '200px',
      background: 'linear-gradient(180deg, #000510 0%, #000000 100%)',
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
        marginBottom: '0.75rem',
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
        BEM-VINDO AO NEXUS
      </h1>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#00f5ff',
        opacity: 0.5,
        marginTop: '0.75rem',
      }}>
        {timestamp}
      </p>
    </div>
  );
}

const WATCH_KEY = "mente_ai_watch_progress_v1";
const PROFILE_KEY = "mente_ai_profile_v1";

function getWatchMap(): Record<string, { watchedPct: number; completed: boolean }> {
  try { return JSON.parse(globalThis.localStorage?.getItem(WATCH_KEY) || "{}"); } catch { return {}; }
}

function getProfile(): { archetype?: string; emotionalScore?: number } {
  try { return JSON.parse(globalThis.localStorage?.getItem(PROFILE_KEY) || "{}"); } catch { return {}; }
}

function getAgentImage(agentId: string): string {
  return `/images/agentes/${agentId.toLowerCase()}.png`;
}

function HorizontalScroll({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <div className="mb-10 w-full" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
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
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-4 md:px-16 pb-4 w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", flexWrap: "nowrap" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: typeof agentsShowcase[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div whileHover={{ scale: 1.05, y: -5 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 cursor-pointer" style={{ width: 180 }}>
      <Link href={`/agentes/${agent.id}`}>
        <div className="relative rounded-md overflow-hidden" style={{
          background: "#1A1A1A",
          aspectRatio: "2/3",
          boxShadow: hovered ? "0 0 20px rgba(0,245,255,0.4)" : "0 2px 8px rgba(0,0,0,0.3)",
          border: hovered ? "1px solid rgba(0,245,255,0.6)" : "1px solid rgba(0,245,255,0.2)",
          transition: "all 300ms ease",
        }}>
          <img src={getAgentImage(agent.id)} alt={agent.name} className="h-full w-full object-cover" loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/80"><Play size={16} fill="#fff" color="#fff" /></div>
            </motion.div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h4 className="text-sm font-bold text-white">{agent.name}</h4>
            <p className="text-xs text-gray-300">{agent.subtitle}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const [watchMap, setWatchMap] = useState<Record<string, { completed: boolean }>>({});
  const [profile, setProfile] = useState<{ archetype?: string; emotionalScore?: number }>({});

  useEffect(() => {
    setWatchMap(getWatchMap());
    setProfile(getProfile());
  }, []);

  const completedCount = Object.values(watchMap).filter((w) => w.completed).length;
  const totalXp = completedCount * 55;
  const hasProgress = completedCount > 0;

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
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: "linear-gradient(to bottom, #0a0a1a, transparent)" }}>
        <div className="flex items-center justify-between w-full" style={{ pointerEvents: "auto" }}>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold"><span className="text-white">MENTE</span><span className="text-red-500">.AI</span></Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-white font-semibold">Início</Link>
              <Link href="/aulas" className="text-gray-400 hover:text-white transition">Séries</Link>
              <Link href="/agentes" className="text-gray-400 hover:text-white transition">Agentes</Link>
              <Link href="/explorar" className="text-gray-400 hover:text-white transition">Explorar</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2" style={{ color: '#00f5ff', opacity: 0.7, fontSize: '10px', fontFamily: 'monospace' }}>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4ade80',
                animation: 'pulse 2s ease-in-out infinite',
                boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
              }} />
              METAVERSE ONLINE
            </div>
            {hasProgress && <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> {totalXp} XP</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-purple-400" /> {profile.archetype || "Explorador"}</span>
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

      <NexusEntry />

      <HeroBanner />

      <div className="pb-16">
        {/* Progress Dashboard */}
        {hasProgress && (
          <SuaJornada
            episodios={completedCount}
            totalEpisodios={100}
            xp={totalXp}
            arquetipo={profile.archetype || "Explorador"}
            progresso={completedCount}
          />
        )}

        {/* Agent Council */}
        <div style={{ marginBottom: '0.5rem', padding: '0 4rem 0 4rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00f5ff', opacity: 0.6, margin: 0 }}>// PORTAIS DISPONÍVEIS</p>
          <div style={{ height: '1px', background: 'rgba(0,245,255,0.2)', marginTop: '0.25rem' }} />
        </div>
        <HorizontalScroll title={''} subtitle={''}>
          {agentsShowcase.slice(0, 12).map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </HorizontalScroll>

        {/* Journey Cards — redesenhadas com imagens blur */}
        <JourneyCards />

        {/* Universe Grid — 12 agentes com foto de fundo */}
        <UniversesGrid />

        {/* Final CTA — cinemático com partículas */}
        <FinalCTA />
      </div>
    </div>
  );
}
