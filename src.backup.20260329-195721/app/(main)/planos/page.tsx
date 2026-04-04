 "use client";
import { useState } from "react";

const planos = [
  {
    id: "free",
    nome: "FREE PRÊMIO",
    cor: "#00d4ff",
    destaque: false,
    gratuito: true,
    precos: { semanal: "GRÁTIS", quinzenal: "GRÁTIS", mensal: "GRÁTIS" },
    recursos: [
      "3 episódios gratuitos",
      "1 pergunta interativa por episódio",
      "1 perfil",
      "Controle parental",
      "Sem cartão de crédito",
    ],
  },
  {
    id: "basico",
    nome: "BÁSICO",
    cor: "#3B82F6",
    destaque: false,
    gratuito: false,
    precos: { semanal: "R$ 12,90", quinzenal: "R$ 19,90", mensal: "R$ 29,90" },
    recursos: [
      "10 temporadas completas",
      "3 perguntas interativas por episódio",
      "1 perfil",
      "Controle parental",
      "Suporte por email",
    ],
  },
  {
    id: "premio",
    nome: "PRÊMIO",
    cor: "#F59E0B",
    destaque: true,
    gratuito: false,
    precos: { semanal: "R$ 14,90", quinzenal: "R$ 24,90", mensal: "R$ 39,90" },
    recursos: [
      "50 temporadas completas",
      "Perguntas ilimitadas por episódio",
      "Todos os 12 Agentes IA",
      "3 perfis",
      "Controle parental",
      "Suporte prioritário",
    ],
  },
  {
    id: "familiar",
    nome: "FAMILIAR",
    cor: "#10B981",
    destaque: false,
    gratuito: false,
    precos: { semanal: "R$ 19,90", quinzenal: "R$ 34,90", mensal: "R$ 54,90" },
    recursos: [
      "Tudo do PRÊMIO",
      "Até 6 perfis",
      "Controle parental avançado",
      "Relatórios de progresso",
      "Suporte VIP",
    ],
  },
];

type Periodo = "semanal" | "quinzenal" | "mensal";

export default function Planos() {
  const [periodo, setPeriodo] = useState<Periodo>("mensal");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAssinar(planoId: string, gratuito: boolean) {
    if (gratuito) {
      window.location.href = "/player";
      return;
    }
    setLoading(planoId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano: planoId, periodo }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao iniciar checkout. Tente novamente.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", textAlign: "center" }}>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#ffffff", marginBottom: "1rem" }}>
          Escolha seu <span style={{ color: "#E50914" }}>plano</span>
        </h1>
        <p style={{ color: "#00d4ff", fontSize: "1.2rem", marginBottom: "2.5rem" }}>
          Aprenda sem esforço. Pense com liberdade.
        </p>

        <div style={{ display: "inline-flex", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "6px", marginBottom: "3rem", gap: "4px" }}>
          {(["semanal", "quinzenal", "mensal"] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              style={{
                padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none",
                cursor: "pointer", fontWeight: 700, fontSize: "0.95rem",
                backgroundColor: periodo === p ? "#ffffff" : "transparent",
                color: periodo === p ? "#0a0e27" : "rgba(255,255,255,0.6)",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          alignItems: "start",
        }}>
          {planos.map((plano) => (
            <div key={plano.id} style={{
              backgroundColor: plano.destaque ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.04)",
              border: `2px solid ${plano.destaque ? plano.cor : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px",
              padding: "2rem 1.5rem",
              position: "relative",
              transform: plano.destaque ? "scale(1.03)" : "scale(1)",
            }}>
              {plano.destaque && (
                <div style={{
                  position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "#F59E0B", color: "#000", fontWeight: 700,
                  padding: "4px 16px", borderRadius: "9999px", fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                }}>
                  MAIS POPULAR
                </div>
              )}

              <h2 style={{ color: plano.cor, fontSize: "1.3rem", fontWeight: 900, marginBottom: "0.5rem" }}>
                {plano.nome}
              </h2>

              <div style={{ marginBottom: "0.4rem" }}>
                <span style={{ color: "#ffffff", fontSize: "2rem", fontWeight: 900 }}>
                  {plano.precos[periodo]}
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
                {plano.gratuito ? "para sempre" : "por período " + periodo}
              </p>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem", textAlign: "left" }}>
                {plano.recursos.map((r) => (
                  <li key={r} style={{ color: "rgba(255,255,255,0.8)", marginBottom: "0.65rem", display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.9rem" }}>
                    <span style={{ color: plano.cor, fontWeight: 700, marginTop: "2px" }}>✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAssinar(plano.id, plano.gratuito)}
                disabled={loading === plano.id}
                style={{
                  width: "100%", padding: "0.9rem", fontSize: "0.95rem", fontWeight: 700,
                  borderRadius: "8px", border: "none", cursor: "pointer",
                  backgroundColor: plano.cor, color: "#000000",
                  opacity: loading === plano.id ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}>
                {plano.gratuito ? "Começar Grátis" : loading === plano.id ? "Aguarde..." : "Assinar " + plano.nome}
              </button>
            </div>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "3rem", fontSize: "0.9rem" }}>
          Cancele quando quiser. Sem taxas ocultas.
        </p>
      </div>
    </main>
  );
}