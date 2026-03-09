 "use client";
import { useEffect, useState } from "react";

interface DashboardData {
  user: { name: string; email: string; plan: string; planStatus: string; memberSince: string };
  stats: { episodesCompleted: number; decisionsMade: number; favorites: number };
  recentProgress: { episodeId: number; seasonNumber: number; episodeNumber: number; progressSeconds: number; totalSeconds: number; isCompleted: boolean }[];
}

const planColors: Record<string, string> = {
  FREE: "#6B7280",
  BASIC: "#3B82F6",
  PREMIUM: "#F59E0B",
  FAMILY: "#10B981",
};

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem",
      border: "1px solid rgba(255,255,255,0.1)", flex: "1", minWidth: "200px", textAlign: "center",
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{value}</div>
      <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (r.status === 401) { window.location.href = "/login"; return null; }
        return r.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => setError("Erro ao carregar dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#fff", fontSize: "1.2rem" }}>Carregando...</div>
    </main>
  );

  if (error || !data) return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#E50914", fontSize: "1.2rem" }}>{error || "Erro desconhecido"}</div>
    </main>
  );

  const { user, stats, recentProgress } = data;
  const planColor = planColors[user.plan] || "#6B7280";
  const memberDate = new Date(user.memberSince).toLocaleDateString("pt-BR");

  return (
    <main style={{ backgroundColor: "#0a0e27", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem",
          border: "1px solid rgba(255,255,255,0.1)", marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap",
        }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${planColor}, #0a0e27)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", fontWeight: 800, color: "#fff",
          }}>
            {user.name ? user.name[0].toUpperCase() : "?"}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>
              Olá, {user.name || "Explorador"}!
            </h1>
            <p style={{ margin: "0.25rem 0 0", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
              {user.email} · Membro desde {memberDate}
            </p>
          </div>
          <div style={{
            padding: "0.5rem 1.2rem", borderRadius: "9999px",
            backgroundColor: planColor, color: "#fff",
            fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em",
          }}>
            PLANO {user.plan}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <StatCard label="Episódios completos" value={stats.episodesCompleted} icon="🎬" />
          <StatCard label="Decisões tomadas" value={stats.decisionsMade} icon="🧠" />
          <StatCard label="Favoritos" value={stats.favorites} icon="⭐" />
        </div>

        {/* Progresso recente */}
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem",
          border: "1px solid rgba(255,255,255,0.1)", marginBottom: "2rem",
        }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.2rem", fontWeight: 700 }}>Progresso Recente</h2>
          {recentProgress.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Nenhum episódio assistido ainda. Comece sua jornada!</p>
          ) : (
            recentProgress.map((p, i) => {
              const pct = p.totalSeconds > 0 ? Math.round((p.progressSeconds / p.totalSeconds) * 100) : 0;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.75rem 0", borderBottom: i < recentProgress.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                  <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", minWidth: "120px" }}>
                    T{p.seasonNumber} E{p.episodeNumber}
                  </div>
                  <div style={{ flex: 1, height: "8px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.1)" }}>
                    <div style={{
                      height: "100%", borderRadius: "4px", width: `${pct}%`,
                      backgroundColor: p.isCompleted ? "#10B981" : "#3B82F6",
                    }} />
                  </div>
                  <div style={{ fontSize: "0.85rem", color: p.isCompleted ? "#10B981" : "rgba(255,255,255,0.5)", minWidth: "50px", textAlign: "right" }}>
                    {p.isCompleted ? "✓" : `${pct}%`}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Ações rápidas */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => window.location.href = "/player"} style={{
            flex: 1, minWidth: "200px", padding: "1rem", fontSize: "1rem", fontWeight: 700,
            borderRadius: "12px", border: "none", backgroundColor: "#3B82F6", color: "#fff", cursor: "pointer",
          }}>
            ▶ Continuar Assistindo
          </button>
          <button onClick={() => window.location.href = "/planos"} style={{
            flex: 1, minWidth: "200px", padding: "1rem", fontSize: "1rem", fontWeight: 700,
            borderRadius: "12px", border: "2px solid rgba(255,255,255,0.2)", backgroundColor: "transparent", color: "#fff", cursor: "pointer",
          }}>
            Gerenciar Plano
          </button>
        </div>

      </div>
    </main>
  );
}