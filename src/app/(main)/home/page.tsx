"use client";
import { useEffect, useState } from "react";

interface DashboardData {
  user: { name: string; email: string; plan: string; planStatus: string; memberSince: string };
  stats: { episodesCompleted: number; decisionsMade: number; favorites: number };
  recentProgress: { episodeId: number; seasonNumber: number; episodeNumber: number; progressSeconds: number; totalSeconds: number; isCompleted: boolean }[];
}

const planColors: Record<string, string> = { FREE: "#6B7280", BASIC: "#3B82F6", PREMIUM: "#F59E0B", FAMILY: "#10B981" };

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "linear-gradient(145deg, rgba(15,20,50,0.9), rgba(10,14,39,0.95))", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(59,130,246,0.15)", flex: "1", minWidth: "200px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{String(value).padStart(3, "0")}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => { if (r.status === 401) { window.location.href = "/login"; return null; } return r.json(); })
      .then((d) => { if (d) setData(d); })
      .catch(() => setError("Erro ao carregar dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (<main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Carregando sistema...</div></main>);
  if (error || !data) return (<main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#E50914", fontSize: "1rem" }}>{error || "Erro desconhecido"}</div></main>);

  const { user, stats, recentProgress } = data;
  const planColor = planColors[user.plan] || "#6B7280";
  const memberDate = new Date(user.memberSince).toLocaleDateString("pt-BR");

  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(145deg, rgba(15,20,50,0.9), rgba(10,14,39,0.95))", borderRadius: "16px", padding: "2rem", border: "1px solid rgba(59,130,246,0.15)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-50%", right: "-10%", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle, ${planColor}10 0%, transparent 70%)` }} />
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg, ${planColor}, ${planColor}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 800, color: "#fff", border: "2px solid rgba(59,130,246,0.3)" }}>{user.name ? user.name[0].toUpperCase() : "?"}</div>
          <div style={{ flex: 1, position: "relative" }}>
            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>{user.name || "Explorador"}</h1>
            <p style={{ margin: "0.3rem 0 0", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{user.email} · Membro desde {memberDate}</p>
          </div>
          <div style={{ padding: "0.4rem 1rem", borderRadius: "6px", background: `linear-gradient(135deg, ${planColor}33, ${planColor}11)`, border: `1px solid ${planColor}44`, color: planColor, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{user.plan}</div>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <StatCard label="Episodios concluidos" value={stats.episodesCompleted} color="#3B82F6" />
          <StatCard label="Decisoes tomadas" value={stats.decisionsMade} color="#8B5CF6" />
          <StatCard label="Favoritos" value={stats.favorites} color="#F59E0B" />
        </div>
        <div style={{ background: "linear-gradient(145deg, rgba(15,20,50,0.9), rgba(10,14,39,0.95))", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(59,130,246,0.15)", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>Progresso Recente</h2>
          {recentProgress.length === 0 ? (
            <div style={{ padding: "2rem 0", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", margin: 0 }}>Nenhum episodio assistido ainda</p>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", margin: "0.5rem 0 0" }}>Comece sua jornada no player</p>
            </div>
          ) : (
            recentProgress.map((p, i) => {
              const pct = p.totalSeconds > 0 ? Math.round((p.progressSeconds / p.totalSeconds) * 100) : 0;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.6rem 0", borderBottom: i < recentProgress.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", minWidth: "80px", fontFamily: "monospace" }}>S{String(p.seasonNumber).padStart(2, "0")}E{String(p.episodeNumber).padStart(2, "0")}</div>
                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <div style={{ height: "100%", borderRadius: "2px", width: `${pct}%`, background: p.isCompleted ? "linear-gradient(90deg, #10B981, #059669)" : "linear-gradient(90deg, #3B82F6, #6366F1)" }} />
                  </div>
                  <div style={{ fontSize: "0.7rem", fontFamily: "monospace", minWidth: "40px", textAlign: "right", color: p.isCompleted ? "#10B981" : "rgba(255,255,255,0.35)" }}>{p.isCompleted ? "100%" : `${pct}%`}</div>
                </div>
              );
            })
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => window.location.href = "/player"} style={{ flex: 1, minWidth: "200px", padding: "0.9rem", fontSize: "0.8rem", fontWeight: 700, borderRadius: "8px", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff" }}>Continuar Assistindo</button>
          <button onClick={() => window.location.href = "/planos"} style={{ flex: 1, minWidth: "200px", padding: "0.9rem", fontSize: "0.8rem", fontWeight: 700, borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)" }}>Gerenciar Plano</button>
        </div>
      </div>
    </main>
  );
}
