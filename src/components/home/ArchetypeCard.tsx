"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface ArchetypeData {
  archetype: string;
  emotionalScore: number;
  intellectualScore: number;
  moralScore: number;
}

const ARCHETYPE_COLORS: Record<string, { color: string; glow: string; label: string }> = {
  analytical: { color: "#3b82f6", glow: "rgba(59,130,246,0.3)", label: "Analítico" },
  rebel: { color: "#ef4444", glow: "rgba(239,68,68,0.3)", label: "Rebelde" },
  paralyzed: { color: "#f59e0b", glow: "rgba(245,158,11,0.3)", label: "Hesitante" },
  empathetic: { color: "#22c55e", glow: "rgba(34,197,94,0.3)", label: "Empático" },
  strategic: { color: "#a78bfa", glow: "rgba(167,139,250,0.3)", label: "Estrategista" },
  creative: { color: "#e879f9", glow: "rgba(232,121,249,0.3)", label: "Criativo" },
  explorer: { color: "#00f0ff", glow: "rgba(0,240,255,0.3)", label: "Explorador" },
};

export function ArchetypeCard() {
  const [data, setData] = useState<ArchetypeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/xp/award", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setData(null);
          return;
        }
        setData({
          archetype: d.archetypeLabel || "explorer",
          emotionalScore: d.emotionalDim || 0.5,
          intellectualScore: d.intellectualDim || 0.5,
          moralScore: d.moralDim || 0.5,
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ marginBottom: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>Analisando seu perfil...</p>
      </section>
    );
  }

  const arch = data ? ARCHETYPE_COLORS[data.archetype] || ARCHETYPE_COLORS.explorer : null;

  return (
    <section style={{ marginBottom: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <Sparkles size={20} style={{ color: arch?.color || "#00f0ff" }} />
        <h2 style={{ fontFamily: "monospace", fontSize: "14px", color: "#ccc", letterSpacing: "0.08em", margin: 0 }}>
          SEU ARQUÉTIPO ATUAL
        </h2>
      </div>

      {arch && data ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: `${arch.color}20`,
              border: `2px solid ${arch.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 24px ${arch.glow}`,
            }}>
              <span style={{ fontSize: "1.25rem" }}>🧠</span>
            </div>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: arch.color, margin: "0 0 2px", textShadow: `0 0 8px ${arch.glow}` }}>
                {arch.label}
              </p>
              <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#888", margin: 0 }}>
                Continue jogando para refinar seu perfil
              </p>
            </div>
          </div>

          {/* Dimensões */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {([
              { label: "Emocional", value: data.emotionalScore, color: "#f472b6" },
              { label: "Intelectual", value: data.intellectualScore, color: "#60a5fa" },
              { label: "Moral", value: data.moralScore, color: "#4ade80" },
            ]).map((dim) => (
              <div key={dim.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#888" }}>{dim.label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: dim.color }}>{(dim.value * 100).toFixed(0)}%</span>
                </div>
                <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                  <div style={{ width: `${Math.min(dim.value * 100, 100)}%`, height: "100%", background: dim.color, borderRadius: 2, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>
          Continue jogando para revelar seu perfil cognitivo. Complete episódios e faça escolhas para que o sistema entenda sua forma de pensar.
        </p>
      )}
    </section>
  );
}
