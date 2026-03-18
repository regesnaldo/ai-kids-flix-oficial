"use client";
import { useEffect, useState, useRef } from "react";

// Tipo unificado para agentes com suporte a cor
export type AgentWithColor = {
  id?: string;
  name: string;
  role?: string;
  color: string;           // obrigatório para o HeroBanner
  desc?: string;
  description?: string;    // suporte a ambas as convenções
  tag: string;
  image?: string;
  rating?: number;
  year?: number;
};

const BASE_AGENTS = [
  { id: "nexus", name: "NEXUS", role: "O Conector", color: "#3B82F6", desc: "Conecta ideias, pessoas e dados. NEXUS e o agente central que orquestra todos os outros.", tag: "AGENTE PRINCIPAL" },
  { id: "volt", name: "VOLT", role: "A Energia", color: "#F59E0B", desc: "Energia pura e motivacao. VOLT transforma duvidas em acao.", tag: "ENERGIA" },
  { id: "janus", name: "JANUS", role: "O Humorista", color: "#EC4899", desc: "Humor inteligente que ensina.", tag: "HUMOR" },
  { id: "stratos", name: "STRATOS", role: "O Estrategista", color: "#10B981", desc: "Estrategia e visao de futuro.", tag: "ESTRATEGIA" },
  { id: "kaos", name: "KAOS", role: "O Caos Criativo", color: "#E50914", desc: "Criatividade nasce do inesperado.", tag: "CRIATIVIDADE" },
  { id: "ethos", name: "ETHOS", role: "O Filosofo", color: "#8B5CF6", desc: "Reflexoes sobre existencia e etica.", tag: "FILOSOFIA" }
];

const CATEGORIES = [
  { title: "Populares no MENTE.AI", items: ["NEXUS", "VOLT", "JANUS", "STRATOS", "KAOS", "ETHOS"] },
  { title: "Novos Episodios", items: ["VOLT", "ETHOS", "NEXUS", "KAOS", "JANUS", "STRATOS"] },
  { title: "Continue Assistindo", items: ["JANUS", "STRATOS", "VOLT", "NEXUS", "ETHOS", "KAOS"] },
  { title: "Recomendados para Voce", items: ["KAOS", "NEXUS", "ETHOS", "VOLT", "STRATOS", "JANUS"] },
];

const AGENTS: AgentWithColor[] = BASE_AGENTS;

function getAgent(name: string): AgentWithColor {
  return AGENTS.find((a) => a.name === name) || AGENTS[0];
}

function HeroBanner({ agent, onPlay }: { agent: AgentWithColor; onPlay: () => void }) {
  const agentColor = agent.color || "#6366f1";
  return (
    <div style={{ position: "relative", width: "100%", height: "85vh", minHeight: "500px", background: `linear-gradient(135deg, ${agentColor}22 0%, #0a0a1a 40%, #0a0a1a 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "15%", right: "5%", width: "350px", height: "350px", borderRadius: "50%", background: `radial-gradient(circle, ${agentColor}30 0%, transparent 70%)`, filter: "blur(60px)", animation: "heroPulse 4s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${agentColor}15 0%, transparent 70%)`, filter: "blur(40px)", animation: "heroPulse 6s ease-in-out infinite reverse" }} />
      <div style={{ position: "absolute", top: "50%", right: "10%", transform: "translateY(-50%)", width: "280px", height: "280px", borderRadius: "24px", background: `linear-gradient(135deg, ${agentColor}, ${agentColor}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem", fontWeight: 900, color: "#fff", boxShadow: `0 0 80px ${agentColor}40, 0 0 160px ${agentColor}20`, border: `2px solid ${agentColor}44` }}>{agent.name[0]}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(transparent, #0a0a1a)" }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4%", maxWidth: "600px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ padding: "0.3rem 0.8rem", borderRadius: "4px", backgroundColor: agentColor, color: "#fff", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em" }}>{agent.tag}</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{agent.role}</span>
        </div>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 900, color: "#fff", margin: "0 0 1rem", lineHeight: 1, letterSpacing: "-0.02em", textShadow: `0 0 40px ${agentColor}40` }}>{agent.name}</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 2rem", maxWidth: "500px" }}>{agent.desc}</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onPlay} style={{ padding: "0.8rem 2rem", borderRadius: "6px", border: "none", backgroundColor: "#fff", color: "#0a0a1a", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}><span>&#9654;</span> Assistir</button>
          <button style={{ padding: "0.8rem 2rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}><span>&#9432;</span> Mais informacoes</button>
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
    <div style={{ marginBottom: "2.5rem", position: "relative" }}>
      <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.75rem", padding: "0 4%" }}>{title}</h3>
      <div style={{ position: "relative" }}>
        <button onClick={() => scroll(-1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "40px", zIndex: 2, background: "linear-gradient(90deg, #0a0a1a, transparent)", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&lt;</button>
        <div ref={scrollRef} style={{ display: "flex", gap: "0.75rem", overflowX: "auto", padding: "0 4%", scrollbarWidth: "none" }}>
          {items.map((name, i) => {
            const agent = getAgent(name);
            const cardColor = agent.color || "#6366f1";
            const imageSrc = `/images/agentes/${agent.name.toLowerCase()}.png`;
            return (
              <div
                key={i}
                onClick={() => (window.location.href = "/player?series=" + agent.name)}
                style={{
                  minWidth: "300px",
                  aspectRatio: "16 / 9",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${cardColor}33, ${cardColor}11)`,
                  border: `1px solid ${cardColor}22`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = `0 8px 30px ${cardColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* imagem 16:9 com object-cover */}
                <img
                  src={imageSrc}
                  alt={agent.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    // fallback para placeholder se a imagem específica não existir
                    if (!e.currentTarget.src.endsWith("/images/placeholder.svg")) {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }
                  }}
                />
                {/* overlay de gradiente e textos */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    padding: "0.75rem 1rem",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span style={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>
                    {agent.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.7)",
                      marginTop: "0.15rem",
                    }}
                  >
                    {agent.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => scroll(1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40px", zIndex: 2, background: "linear-gradient(270deg, #0a0a1a, transparent)", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&gt;</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [heroAgent, setHeroAgent] = useState(AGENTS[0]);
  useEffect(() => { const t = setInterval(() => { setHeroAgent((p) => { const i = AGENTS.indexOf(p); return AGENTS[(i + 1) % AGENTS.length]; }); }, 10000); return () => clearInterval(t); }, []);
  return (
    <main style={{ backgroundColor: "#0a0a1a", minHeight: "100vh", color: "#fff" }}>
      <HeroBanner agent={heroAgent} onPlay={() => window.location.href = "/player?series=" + heroAgent.name} />
      <div style={{ marginTop: "-4rem", position: "relative", zIndex: 2 }}>
        {CATEGORIES.map((cat) => (<Carousel key={cat.title} title={cat.title} items={cat.items} />))}
      </div>
    </main>
  );
}








