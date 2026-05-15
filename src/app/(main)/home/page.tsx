"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight, Star, Clock, Zap, Sparkles } from "lucide-react";
import { agentsShowcase } from "@/data/agents-showcase";

const WATCH_STORAGE_KEY = "mente_ai_watch_progress_v1";

function getWatchMap(): Record<string, { watchedPct: number; completed: boolean }> {
  try {
    const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getAgentImage(agentId: string): string {
  return `/images/agentes/${agentId.toLowerCase()}.png`;
}

function HorizontalScroll({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 400, behavior: "smooth" });
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 cursor-pointer"
      style={{ width: 180 }}
    >
      <Link href={`/agentes/${agent.id}`}>
        <div
          className="relative rounded-md overflow-hidden"
          style={{ background: "#1A1A1A", aspectRatio: "2/3", boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.3)" }}
        >
          <img src={getAgentImage(agent.id)} alt={agent.name} className="h-full w-full object-cover" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/80">
                <Play size={16} fill="#fff" color="#fff" />
              </div>
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
  { id: "fundamentos", title: "Fundamentos de IA", description: "Conceitos essenciais que formam a base de toda IA moderna.", level: "Iniciante", color: "#8B5CF6", episodes: 12 },
  { id: "criatividade", title: "Criatividade Radical", description: "Desbloqueie seu potencial criativo com agentes especializados.", level: "Intermediário", color: "#F59E0B", episodes: 10 },
  { id: "etica", title: "IA Ética", description: "Desafios éticos e responsabilidades do desenvolvimento de IA.", level: "Avançado", color: "#10B981", episodes: 8 },
  { id: "estrategia", title: "Estratégia", description: "Pensamento estratégico aplicado a sistemas de IA.", level: "Avançado", color: "#E50914", episodes: 10 },
];

function JourneyCard({ j }: { j: typeof journeys[0] }) {
  return (
    <Link href={`/aulas`}>
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        className="flex-shrink-0 rounded-md overflow-hidden cursor-pointer"
        style={{ width: 280, background: "#1A1A1A" }}
      >
        <div className="h-32 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${j.color}40, #1A1A1A)` }}>
          <Sparkles size={40} style={{ color: j.color }} />
        </div>
        <div className="p-4">
          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: j.color + "30", color: j.color }}>{j.level}</span>
          <h3 className="text-white font-bold mt-2">{j.title}</h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{j.description}</p>
          <p className="text-gray-500 text-xs mt-2">{j.episodes} episódios</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  const [watchMap, setWatchMap] = useState<Record<string, { completed: boolean }>>({});

  useEffect(() => {
    setWatchMap(getWatchMap());
  }, []);

  const completedCount = Object.values(watchMap).filter((w) => w.completed).length;
  const hasProgress = completedCount > 0;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: "linear-gradient(to bottom, #0a0a1a, transparent)" }}
      >
        <div className="flex items-center justify-between w-full" style={{ pointerEvents: "auto" }}>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">MENTE</span><span className="text-red-500">.AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-white font-semibold">Início</Link>
            <Link href="/aulas" className="text-gray-400 hover:text-white transition">Séries</Link>
            <Link href="/agentes" className="text-gray-400 hover:text-white transition">Agentes</Link>
            <Link href="/explorar" className="text-gray-400 hover:text-white transition">Explorar</Link>
          </div>
        </div>
        {hasProgress && (
          <div className="text-sm text-gray-400">
            {completedCount} episódios concluídos
          </div>
        )}
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative h-[80vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/agentes/nexus.png"
            alt="NEXUS"
            className="h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }}
          />
        </div>

        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(to right, #0a0a1a 0%, #0a0a1a40 50%, transparent 100%),
            linear-gradient(to top, #0a0a1a 0%, transparent 50%),
            linear-gradient(to bottom, #0a0a1a 80%, transparent 100%)
          `,
        }} />

        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-gray-400 tracking-wider">MENTE.AI ORIGINAL</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                NOVA TEMPORADA
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              NEXUS
            </h1>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-lg leading-relaxed">
              Onde mentes são formadas, não formatadas. NEXUS conecta você ao conhecimento
              infinito dos agentes de IA. Cada um uma perspectiva única no universo do aprendizado.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/aulas"
                className="flex items-center gap-2 px-8 py-3 rounded font-bold text-sm bg-white text-black hover:bg-white/90 transition"
              >
                <Play size={20} fill="#000" />
                Assistir
              </Link>

              <Link
                href="/agentes"
                className="flex items-center gap-2 px-6 py-3 rounded font-medium text-sm bg-white/10 hover:bg-white/20 transition text-white"
              >
                <Info size={18} />
                Saiba mais
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-6 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Star size={14} /> 12 Agentes</span>
              <span className="flex items-center gap-1"><Zap size={14} /> 50 Temporadas</span>
              <span className="flex items-center gap-1"><Clock size={14} /> 5 Fases</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-16">
        {/* Continue Watching */}
        {hasProgress && (
          <HorizontalScroll title="Continuar Assistindo" subtitle="Continue de onde parou">
            <div className="flex-shrink-0 w-72 rounded-md overflow-hidden" style={{ background: "#1A1A1A" }}>
              <div className="h-40 flex items-center justify-center bg-white/5">
                <Play size={32} className="text-gray-400" />
              </div>
              <div className="p-4">
                <h4 className="text-white font-semibold text-sm">Continue sua jornada</h4>
                <p className="text-gray-400 text-xs mt-1">{completedCount} episódios concluídos</p>
                <Link href="/aulas" className="inline-block mt-3 text-xs font-bold text-white bg-white/10 px-4 py-2 rounded hover:bg-white/20 transition">
                  Continuar
                </Link>
              </div>
            </div>
          </HorizontalScroll>
        )}

        {/* Agent Council */}
        <HorizontalScroll title="O Conselho de Mentores" subtitle="Os 12 arquétipos do MENTE.AI">
          {agentsShowcase.slice(0, 12).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </HorizontalScroll>

        {/* Journey Pathways */}
        <HorizontalScroll title="Jornadas de Aprendizado" subtitle="Caminhos para sua evolução">
          {journeys.map((j) => (
            <JourneyCard key={j.id} j={j} />
          ))}
        </HorizontalScroll>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 md:mx-16 mt-12 p-12 rounded-xl text-center"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para transformar sua mente?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Conhecimento infinito de 12 agentes canônicos. Comece grátis.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/aulas"
              className="px-8 py-3 rounded font-bold text-sm bg-white text-black hover:bg-white/90 transition"
            >
              Comece Grátis
            </Link>
            <Link
              href="/planos"
              className="px-8 py-3 rounded font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition"
            >
              Ver Planos
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}