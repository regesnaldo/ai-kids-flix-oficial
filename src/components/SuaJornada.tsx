"use client"
import { useEffect, useState } from "react"

interface JornadaProps {
  episodios: number
  totalEpisodios: number
  xp: number
  arquetipo: string
  progresso: number
}

const ARQUETIPO_CORES: Record<string, string> = {
  Explorador:  "#00D9FF",
  Analitico:   "#3498DB",
  Criativo:    "#E91E63",
  Empatico:    "#27AE60",
  Estrategico: "#1ABC9C",
  Rebelde:     "#E74C3C",
  default:     "#00D9FF",
}

export function SuaJornada({ episodios, totalEpisodios, xp, arquetipo, progresso }: JornadaProps) {
  const cor = ARQUETIPO_CORES[arquetipo] || ARQUETIPO_CORES.default
  const [xpAnimado, setXpAnimado] = useState(0)
  const [pulso, setPulso] = useState(false)

  useEffect(() => {
    let start = 0
    const step = Math.ceil(xp / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= xp) { setXpAnimado(xp); clearInterval(timer) }
      else setXpAnimado(start)
    }, 30)
    return () => clearInterval(timer)
  }, [xp])

  useEffect(() => {
    const timer = setInterval(() => setPulso(p => !p), 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(135deg, #0A0A1A 0%, #0F0F2A 50%, #0A0A1A 100%)",
      border: `1px solid ${cor}44`,
      borderRadius: "12px",
      padding: "28px 32px",
      margin: "24px 48px",
      overflow: "hidden",
      boxShadow: `0 0 30px ${cor}22, inset 0 0 60px rgba(0,0,0,0.5)`,
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,217,255,0.02) 2px, rgba(0,217,255,0.02) 4px)",
        zIndex: 0,
      }} />

      <div style={{ position: "absolute", top: 12, left: 12, width: 20, height: 20, borderTop: `2px solid ${cor}`, borderLeft: `2px solid ${cor}` }} />
      <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderTop: `2px solid ${cor}`, borderRight: `2px solid ${cor}` }} />
      <div style={{ position: "absolute", bottom: 12, left: 12, width: 20, height: 20, borderBottom: `2px solid ${cor}`, borderLeft: `2px solid ${cor}` }} />
      <div style={{ position: "absolute", bottom: 12, right: 12, width: 20, height: 20, borderBottom: `2px solid ${cor}`, borderRight: `2px solid ${cor}` }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cor, boxShadow: `0 0 8px ${cor}, 0 0 16px ${cor}`, animation: "pulse 1.5s infinite" }} />
          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: cor, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {/* SUA JORNADA — SISTEMA ATIVO */}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 2fr", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.15em", marginBottom: 8 }}>EPISODIOS</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: "2rem", fontWeight: 700, color: "#E2E8F0", fontFamily: "monospace" }}>{episodios}</span>
              <span style={{ fontSize: "0.9rem", color: "#475569", fontFamily: "monospace" }}>/{totalEpisodios}</span>
            </div>
          </div>

          <div style={{ background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#92400E", letterSpacing: "0.15em", marginBottom: 8 }}>XP TOTAL</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#FFD700", fontFamily: "monospace", textShadow: "0 0 20px rgba(255,215,0,0.5)" }}>
              {xpAnimado.toLocaleString()}
            </div>
          </div>

          <div style={{ background: `${cor}0D`, border: `1px solid ${cor}33`, borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.15em", marginBottom: 8 }}>ARQUETIPO</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: cor, textShadow: `0 0 20px ${cor}88`, fontFamily: "monospace" }}>
              {arquetipo.toUpperCase()}
            </div>
            <div style={{ marginTop: 6, display: "inline-block", background: `${cor}22`, border: `1px solid ${cor}44`, borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", color: cor, fontFamily: "monospace", letterSpacing: "0.1em" }}>
              IDENTIFICADO
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#475569", letterSpacing: "0.15em" }}>PROGRESSO GLOBAL</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: cor, fontWeight: 700 }}>{progresso}%</span>
            </div>

            <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${progresso}%`, background: `linear-gradient(90deg, ${cor}88, ${cor})`, borderRadius: 3, boxShadow: pulso ? `0 0 12px ${cor}` : `0 0 4px ${cor}`, transition: "box-shadow 0.9s ease, width 1s ease" }} />
            </div>

            {[0.3, 0.6, 0.45, 0.8, 0.2].map((w, i) => (
              <div key={i} style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden", marginBottom: 3 }}>
                <div style={{ height: "100%", width: `${Math.round(w * 100)}%`, background: `${cor}33`, borderRadius: 1 }} />
              </div>
            ))}

            <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: "0.6rem", color: "#334155", letterSpacing: "0.1em" }}>
              FASE 1 DE 5 — {totalEpisodios - episodios} MODULOS RESTANTES
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}