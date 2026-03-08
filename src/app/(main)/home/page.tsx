 
"use client";
import { useEffect, useRef, useState } from "react";

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const NODE_COUNT = 80;
    const CONNECTION_DIST = 150;
    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > canvas!.width) a.vx *= -1;
        if (a.y < 0 || a.y > canvas!.height) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = 1 - dist / CONNECTION_DIST;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;
            ctx!.lineWidth = 1;
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(59, 130, 246, 0.7)";
        ctx!.fill();
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
  );
}

const badges = [
  { label: "MOVIDO POR IA", title: "Motor de decisão LangChain ativo" },
  { label: "IA ADAPTATIVA", title: "A plataforma aprende com você e ajusta o conteúdo" },
  { label: "CONTEÚDO FILTRADO", title: "Selecionado para formar pensadores, não seguidores" },
];

function useBadges() {
  const [data, setData] = useState(badges);
  useEffect(() => {
    fetch("/api/badges")
      .then(r => r.json())
      .then(d => setData([
        { label: d.langchain.label, title: d.langchain.description },
        { label: d.adaptive.total > 0 ? d.adaptive.label + " (" + d.adaptive.total + ")" : d.adaptive.label, title: d.adaptive.description },
        { label: d.filtered.label, title: d.filtered.description },
      ]))
      .catch(() => {});
  }, []);
  return data;
}

export default function Home() {
  const badges = useBadges();
  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <NeuralBackground />
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "2rem", textAlign: "center",
      }}>
        <h1 style={{ fontSize: "clamp(5rem, 16vw, 12rem)", fontWeight: 900, letterSpacing: "-0.02em", margin: 0, lineHeight: 1 }}>
          <span style={{ color: "#ffffff" }}>MENTE</span>
          <span style={{ color: "#E50914" }}>.AI</span>
        </h1>

        <p style={{ color: "#00d4ff", fontSize: "clamp(1.4rem, 3.5vw, 2rem)", maxWidth: "600px", marginTop: "1rem", marginBottom: "1rem", lineHeight: 1.6, fontWeight: 500 }}>
          Onde mentes são formadas, não formatadas...!
        </p>

        <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", maxWidth: "900px", marginTop: 0, marginBottom: "2rem", lineHeight: 2, fontStyle: "italic" }}>
          <span style={{ color: "#F59E0B", fontWeight: 700 }}>Enquanto o mundo fabrica seguidores, nós formamos líderes.</span><br />
          <span style={{ color: "#F59E0B", fontWeight: 700 }}>Ferramentas obedecem. Pensadores nunca param de perguntar por quê.</span><br />
          <span style={{ color: "#F59E0B", fontWeight: 700 }}>Escolha seu lado antes que o sistema escolha por você.</span>
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}>
          {badges.map((badge) => (
            <span key={badge.label} title={badge.title} style={{
              padding: "0.6rem 1.4rem", borderRadius: "9999px",
              border: "1px solid rgba(59,130,246,0.4)",
              backgroundColor: "rgba(59,130,246,0.1)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem", fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
              cursor: "default",
            }}>{badge.label}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => window.location.href = "/player"}
            style={{ padding: "1rem 2.8rem", fontSize: "1.15rem", fontWeight: 700, borderRadius: "8px", border: "none", backgroundColor: "#ffffff", color: "#0a0e27", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            Começar a Pensar
          </button>
          <button style={{ padding: "1rem 2.8rem", fontSize: "1.15rem", fontWeight: 700, borderRadius: "8px", border: "2px solid rgba(255,255,255,0.3)", backgroundColor: "transparent", color: "#ffffff", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}>
            Saiba Mais
          </button>
        </div>
      </div>
    </main>
  );
}