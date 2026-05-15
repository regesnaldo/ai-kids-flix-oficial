"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight, Star, Clock, Zap } from "lucide-react";
import { SuaJornada } from "@/components/SuaJornada";
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

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= dx / 5000;
          p.vy -= dy / 5000;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

function TypewriterText({ texts, className }: { texts: string[]; className?: string }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setChar((c) => {
        const next = c + dir;
        if (next > texts[idx].length || next < 0) {
          if (dir === 1) { setTimeout(() => setDir(-1), 2000); return c; }
          else { setDir(1); setIdx((i) => (i + 1) % texts.length); return 0; }
        }
        return next;
      });
    }, 60);
    return () => clearInterval(t);
  }, [idx, dir, texts]);

  return <span className={className}>{texts[idx].slice(0, char)}<span className="animate-pulse">|</span></span>;
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
        <div className="relative rounded-md overflow-hidden" style={{ background: "#1A1A1A", aspectRatio: "2/3", boxShadow: hovered ? `0 8px 32px ${agent.categoryColor}44` : "0 2px 8px rgba(0,0,0,0.3)" }}>
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
    <div className="min-h-screen" style={{ background: "#0a0a1a" }}>
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
          {hasProgress && <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> {totalXp} XP</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-purple-400" /> {profile.archetype || "Explorador"}</span>
          </div>}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-[85vh] min-h-[500px] max-h-[750px] overflow-hidden">
        <ParticleCanvas />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0a1a 0%, #0a0a1a60 50%, transparent 100%), linear-gradient(to top, #0a0a1a 0%, transparent 50%)" }} />

        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-gray-400 tracking-wider">MENTE.AI ORIGINAL</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">100 EPISÓDIOS</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">NEXUS</h1>

            <p className="text-base md:text-lg text-gray-300 mb-2 max-w-lg leading-relaxed">
              <TypewriterText texts={[
                "Onde mentes são formadas, não formatadas.",
                "12 agentes. 50 temporadas. Uma jornada.",
                "Cada decisão molda seu destino no metaverso.",
                "A IA não é o futuro. É o presente que você constrói."
              ]} className="text-gray-300" />
            </p>

            <div className="flex items-center gap-4 mt-8">
              <Link href="/aulas" className="flex items-center gap-2 px-8 py-3 rounded font-bold text-sm bg-white text-black hover:bg-white/90 transition shadow-lg shadow-white/10">
                <Play size={20} fill="#000" /> Assistir
              </Link>
              <Link href="/agentes" className="flex items-center gap-2 px-6 py-3 rounded font-medium text-sm bg-white/10 hover:bg-white/20 transition text-white">
                <Info size={18} /> Conhecer agentes
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-6 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Star size={14} /> 12 Agentes</span>
              <span className="flex items-center gap-1"><Zap size={14} /> 100 Episódios</span>
              <span className="flex items-center gap-1"><Clock size={14} /> 5 Fases</span>
            </div>
          </div>
        </div>
      </div>

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