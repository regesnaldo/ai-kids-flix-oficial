"use client";
import { agents } from "@/data/agents";
import { useEffect, useState, useRef } from "react";

const BASE_AGENTS = [
  { id: "nexus", name: "NEXUS", role: "O Conector", color: "#3B82F6", desc: "Conecta ideias, pessoas e dados. NEXUS é o agente central que orquestra todos os outros.", tag: "AGENTE PRINCIPAL" },
  { id: "volt", name: "VOLT", role: "A Energia", color: "#F59E0B", desc: "Energia pura e motivação. VOLT transforma dúvidas em ação.", tag: "ENERGIA" },
  { id: "janus", name: "JANUS", role: "O Humorista", color: "#EC4899", desc: "Humor inteligente que ensina.", tag: "HUMOR" },
  { id: "stratos", name: "STRATOS", role: "O Estrategista", color: "#10B981", desc: "Estratégia e visão de futuro.", tag: "ESTRATÉGIA" },
  { id: "kaos", name: "KAOS", role: "O Caos Criativo", color: "#E50914", desc: "Criatividade nasce do inesperado.", tag: "CRIATIVIDADE" },
  { id: "ethos", name: "ETHOS", role: "O Filósofo", color: "#8B5CF6", desc: "Reflexões sobre existência e ética.", tag: "FILOSOFIA" }
];

const AGENTS = [
  ...BASE_AGENTS,
  ...agents.map(a => ({
    id: a.name.toLowerCase(),
    name: a.name,
    role: "Especialista em " + a.tag,
    color: "#8B5CF6", // Cor padrão para os novos
    desc: a.description,
    tag: a.tag.toUpperCase()
  }))
];

const CATEGORIES = [
  { title: "Populares no MENTE.AI", items: AGENTS.slice(0, 6).map(a => a.name) },
  { title: "Novos Episodios", items: AGENTS.slice(6, 12).map(a => a.name) },
  { title: "Continue Assistindo", items: AGENTS.slice(0, 4).map(a => a.name) },
  { title: "Recomendados para Voce", items: AGENTS.slice(8, 12).map(a => a.name) },
];

function getAgent(name: string) { return AGENTS.find((a) => a.name === name) || AGENTS[0]; }

const DEFAULT_COLOR = '#E50914';
const defaultAgent = { id: '', name: '', role: '', desc: '', tag: '', color: DEFAULT_COLOR };

function HeroBanner({ agent, onPlay }: { agent: typeof defaultAgent; onPlay: () => void }) {
  const agentColor = agent?.color || DEFAULT_COLOR;
  return (
    <div style={{ position: "relative", width: "100%", height: "85vh", minHeight: "500px", background: `linear-gradient(135deg, ${agentColor}20 0%, ${agentColor}10 30%, #0a0a1a 60%, #0a0a1a 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "15%", right: "5%", width: "350px", height: "350px", borderRadius: "50%", background: `radial-gradient(circle, ${agentColor}30 0%, transparent 70%)`, filter: "blur(60px)", animation: "heroPulse 4s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${agentColor}15 0%, transparent 70%)`, filter: "blur(40px)", animation: "heroPulse 6s ease-in-out infinite reverse" }} />
      <div style={{ position: "absolute", top: "50%", right: "10%", transform: "translateY(-50%)", width: "280px", height: "280px", borderRadius: "24px", background: `linear-gradient(135deg, ${agentColor}, ${agentColor}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem", fontWeight: 900, color: "#fff", boxShadow: `0 0 80px ${agentColor}40, 0 0 160px ${agentColor}20`, border: `2px solid ${agentColor}44` }}>{agent.name[0]}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(transparent, #0a0a1a)" }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4%", maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {/* TAG */}
          <span style={{ display: "inline-flex", width: "fit-content", padding: "6px 16px", borderRadius: "4px", backgroundColor: agentColor, color: "#fff", fontSize: "1.125rem", fontWeight: 800, textTransform: "uppercase" }}>{agent.tag}</span>
          {/* TITULO */}
          <h1 style={{ fontSize: "5.5rem", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1, letterSpacing: "-0.02em", textShadow: `0 0 40px ${agentColor}40` }}>{agent.name}</h1>
          {/* SUBTITULO */}
          <span style={{ color: "#aaa", fontSize: "2rem", fontWeight: 500 }}>{agent.role}</span>
          {/* DESCRICAO */}
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.5rem", lineHeight: 1.6, margin: "0 0 1.5rem 0", maxWidth: "600px" }}>{agent.desc}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onPlay} style={{ padding: "0.8rem 2rem", borderRadius: "6px", border: "none", backgroundColor: "#fff", color: "#0a0a1a", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}><span>&#9654;</span> Assistir</button>
          <button style={{ padding: "0.8rem 2rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}><span>&#9432;</span> Mais Informações</button>
        </div>
      </div>
      <style>{`@keyframes heroPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
    </div>
  );
}

function Carousel({ title, items }: { title: string; items: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  function scroll(dir: number) { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" }); }
  return (
    <div style={{ marginBottom: "2.5rem", position: "relative", boxSizing: "border-box" }}>
      <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.75rem", padding: "0 4%" }}>{title}</h3>
      <div style={{ position: "relative", boxSizing: "border-box" }}>
        <button onClick={() => scroll(-1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "40px", zIndex: 2, background: "linear-gradient(90deg, #0a0a1a, transparent)", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&lt;</button>
        <div ref={scrollRef} style={{ display: "flex", gap: "24px", width: "100%", overflowX: "auto", padding: "0 4%", paddingRight: "4%", scrollbarWidth: "none", boxSizing: "border-box" }}>
          {items.map((name, i) => {
            const agent = getAgent(name) as any;
            const agentColor = agent?.color || DEFAULT_COLOR;
            return (
              <div key={agent.id + i} onClick={() => window.location.href = "/player?series=" + agent.name} style={{ minWidth: "320px", aspectRatio: "16/9", borderRadius: "8px", background: `linear-gradient(135deg, ${agentColor}33, ${agentColor}11)`, border: `1px solid ${agentColor}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s ease-in-out", position: "relative", overflow: "hidden", flexShrink: 0 }} onMouseEnter={(e) => { const t = e.currentTarget; t.style.transform = "scale(1.05)"; t.style.border = `1px solid ${agentColor}66`; t.style.boxShadow = `0 0 20px ${agentColor}66`; }} onMouseLeave={(e) => { const t = e.currentTarget; t.style.transform = "scale(1)"; t.style.border = `1px solid ${agentColor}33`; t.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: `linear-gradient(90deg, ${agentColor}, transparent)` }} />
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", textShadow: `0 0 6px ${agentColor}80` }}>{agent.name}</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>{agent.role}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => scroll(1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40px", zIndex: 2, background: "linear-gradient(270deg, #0a0a1a, transparent)", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&gt;</button>
      </div>
    </div>
  );
}

const populares = agents;

export default function Home() {
  const [heroAgent, setHeroAgent] = useState(AGENTS[0]);
  useEffect(() => { const t = setInterval(() => { setHeroAgent((p) => { const i = AGENTS.indexOf(p); return AGENTS[(i + 1) % AGENTS.length]; }); }, 10000); return () => clearInterval(t); }, []);
  return (
    <main style={{ backgroundColor: "#0a0a1a", width: "100%", minHeight: "100vh", color: "#fff", margin: 0, padding: 0, boxSizing: "border-box", overflow: "hidden" }}>
      <HeroBanner agent={heroAgent as any} onPlay={() => window.location.href = "/player?series=" + heroAgent.name} />
      <div style={{ marginTop: "-4rem", position: "relative", zIndex: 2 }}>
        {CATEGORIES.map((cat) => (<Carousel key={cat.title} title={cat.title} items={cat.items} />))} // Carousel keys come from title

      </div>
    </main>
  );
}











