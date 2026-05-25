"use client";

import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Users, Zap, RefreshCw } from "lucide-react";

interface FraudEntry {
  id: string;
  userId: number;
  reason: string;
  riskScore: number;
  flaggedAt: string;
}

interface DashboardData {
  fraudAlerts: FraudEntry[];
  totalUsers: number;
  xpToday: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <main className="min-h-screen p-6 md:p-10" style={{ background: "var(--dark-bg)" }}>
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-1/3 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.02]" style={{ background: "var(--accent-cyan)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3" style={{ fontFamily: "var(--font-display)" }}>
              <Shield size={28} style={{ color: "var(--accent-cyan)" }} />
              Painel Admin
            </h1>
            <p className="text-white/30 text-sm mt-1.5">Anti-fraud · XP · Gamificação</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 border"
            style={{
              background: "var(--dark-card)",
              borderColor: "rgba(255,255,255,0.06)",
              color: "var(--accent-cyan)",
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={<Users size={20} />}
            label="Total de Usuários"
            value={data?.totalUsers ?? "-"}
            color="var(--accent-cyan)"
          />
          <StatCard
            icon={<Zap size={20} />}
            label="XP Distribuído Hoje"
            value={data?.xpToday ?? "-"}
            color="#10B981"
          />
          <StatCard
            icon={<Shield size={20} />}
            label="Ativos Agora"
            value={data?.activeUsers ?? "-"}
            color="#3B82F6"
          />
        </div>

        {/* Fraud Alerts */}
        <div
          className="rounded-xl border p-6"
          style={{
            background: "var(--dark-card)",
            borderColor: "rgba(255,255,255,0.05)",
            boxShadow: "0 4px 20px rgba(0,245,255,0.02)",
          }}
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5" style={{ fontFamily: "var(--font-display)" }}>
            <AlertTriangle size={18} style={{ color: "#EF4444" }} />
            Alertas de Fraude
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg shimmer" style={{ background: "var(--dark-card)" }} />
              ))}
            </div>
          ) : (data?.fraudAlerts?.length ?? 0) === 0 ? (
            <div className="text-center py-8">
              <Shield size={32} className="mx-auto mb-3 opacity-20" style={{ color: "var(--accent-cyan)" }} />
              <p className="text-white/20 text-sm">Nenhum alerta de fraude ativo.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.fraudAlerts?.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg border"
                  style={{
                    background: "rgba(239,68,68,0.03)",
                    borderColor: "rgba(239,68,68,0.08)",
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold">Usuário #{alert.userId}</p>
                    <p className="text-white/35 text-xs truncate">{alert.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: alert.riskScore > 70 ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.12)",
                        color: alert.riskScore > 70 ? "#EF4444" : "#F59E0B",
                      }}
                    >
                      Risco {alert.riskScore}
                    </span>
                    <span className="text-white/15 text-[10px]">
                      {new Date(alert.flaggedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{
        background: "var(--dark-card)",
        borderColor: "rgba(255,255,255,0.05)",
        boxShadow: "0 4px 16px rgba(0,245,255,0.02)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}12`, color }}
        >
          {icon}
        </div>
        <span className="text-white/35 text-sm">{label}</span>
      </div>
      <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
    </div>
  );
}
