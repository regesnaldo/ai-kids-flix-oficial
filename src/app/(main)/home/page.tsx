"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Star, Zap } from "lucide-react";
import { SuaJornada } from "@/components/SuaJornada";
import NexusEntry from "@/components/home/NexusEntry";
import { agentsShowcase } from "@/data/agents-showcase";
import { allAgents } from "@/data/all-agents";

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
    <div className="mb-10" onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
      <div className="flex items-center gap-4 mb-4 px-4 md:px-16">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <span className="text-sm text-gray-500 hidden md:inline">{subtitle}</span>}
      </div>
      <div className="relative">
        {showArrows && (
          <>
            <button onClick={() => scroll(-1)} className="absolute left-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-r-lg transition"><ChevronLeft size={24} color="#fff" /></button>
            <button onClick={() => scroll(1)} className="absolute right-2 top-0 bottom-0 w-10 flex items-center justify-center z-10 bg-black/50 hover:bg-black/80 rounded-l-lg transition"><ChevronRight size={24} color="#fff" /></button>
          </>
        )}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-4 md:px-16 pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
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

const journeys = [
  { id: "fundamentos", title: "Fundamentos de IA", description: "Conceitos essenciais da IA moderna.", level: "Iniciante", color: "#8B5CF6", episodes: 20 },
  { id: "criatividade", title: "Criatividade Radical", description: "Crie com agentes especializados.", level: "Intermediário", color: "#F59E0B", episodes: 20 },
  { id: "etica", title: "IA Ética", description: "Desafios éticos da IA.", level: "Avançado", color: "#10B981", episodes: 20 },
  { id: "estrategia", title: "Estratégia", description: "Pensamento estratégico com IA.", level: "Avançado", color: "#E50914", episodes: 20 },
  { id: "futuro", title: "Futuro da IA", description: "AGI, singularidade e além.", level: "Expert", color: "#3B82F6", episodes: 20 },
];

function JourneyCard({ j }: { j: typeof journeys[0] }) {
  return (
    <Link href="/aulas">
      <motion.div whileHover={{ scale: 1.03, y: -4 }} className="flex-shrink-0 rounded-md overflow-hidden cursor-pointer" style={{ width: 260, background: "#1A1A1A" }}>
        <div className="h-20" style={{ background: `linear-gradient(135deg, ${j.color}30, #1A1A1A)` }} />
        <div className="p-4">
          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: j.color + "30", color: j.color }}>{j.level}</span>
          <h3 className="text-white font-bold mt-2 text-sm">{j.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{j.description}</p>
          <p className="text-gray-500 text-xs mt-2">{j.episodes} episódios</p>
        </div>
      </motion.div>
    </Link>
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
          background: repeating-linear-gradient(
            0deg,
            rgba(0,245,255,0.03) 0px,
            rgba(0,245,255,0.03) 2px,
            transparent 2px,
            transparent 4px
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
        <HorizontalScroll title="O Conselho de Mentores" subtitle="Os 12 arquétipos do MENTE.AI">
          {agentsShowcase.slice(0, 12).map((agent) => <AgentCard key={agent.id} agent={agent} />)}
        </HorizontalScroll>

        {/* Journey Pathways */}
        <HorizontalScroll title="Jornadas de Aprendizado" subtitle="Caminhos para sua evolução">
          {journeys.map((j) => <JourneyCard key={j.id} j={j} />)}
        </HorizontalScroll>

        {/* Universe Grid 4x3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 md:mx-16 mb-10 p-8 rounded-xl"
          style={{ background: "#0F0F1A" }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">12 Universos</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm text-center">Explore todos os universos 3D dos agentes canônicos.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {allAgents.map((a) => (
              <Link key={a.id} href={`/universo/${a.id}`}
                className="p-5 rounded-lg cursor-pointer transition-all duration-200 group"
                style={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = "scale(1.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}>
                <div className="text-white font-bold text-sm group-hover:brightness-110">{a.name}</div>
                <div className="text-gray-500 text-xs mt-1">{a.role}</div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 md:mx-16 mt-8 p-12 rounded-xl text-center"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))", border: "1px solid rgba(139,92,246,0.3)" }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para transformar sua mente?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Conhecimento infinito de 12 agentes canônicos. 100 episódios disponíveis.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/aulas" className="px-8 py-3 rounded font-bold text-sm bg-white text-black hover:bg-white/90 transition">Comece Grátis</Link>
            <Link href="/planos" className="px-8 py-3 rounded font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition">Ver Planos</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
