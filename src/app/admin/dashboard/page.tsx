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
    <main className="min-h-screen p-8" style={{ background: "var(--cyber-black)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Shield size={28} style={{ color: "var(--neon-cyan)" }} />
              Painel Admin
            </h1>
            <p className="text-gray-500 text-sm mt-1">Anti-fraud · XP · Gamificação</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition border border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Users size={20} />} label="Usuários" value={data?.totalUsers ?? "-"} color="#3B82F6" />
          <StatCard icon={<Zap size={20} />} label="XP Hoje" value={data?.xpToday ?? "-"} color="#10B981" />
          <StatCard icon={<Shield size={20} />} label="Ativos Agora" value={data?.activeUsers ?? "-"} color="var(--neon-cyan)" />
        </div>

        {/* Fraud Alerts */}
        <div className="rounded-xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <AlertTriangle size={18} style={{ color: "#EF4444" }} />
            Alertas de Fraude
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded shimmer" style={{ background: "#1a1a2e" }} />
              ))}
            </div>
          ) : (data?.fraudAlerts?.length ?? 0) === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum alerta ativo.</p>
          ) : (
            <div className="space-y-2">
              {data?.fraudAlerts?.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5" style={{ background: "rgba(239,68,68,0.05)" }}>
                  <div>
                    <p className="text-white text-sm font-medium">Usuário #{alert.userId}</p>
                    <p className="text-gray-400 text-xs">{alert.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{
                      background: alert.riskScore > 70 ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                      color: alert.riskScore > 70 ? "#EF4444" : "#F59E0B",
                    }}>
                      Risco {alert.riskScore}
                    </span>
                    <span className="text-gray-600 text-[10px]">{new Date(alert.flaggedAt).toLocaleDateString("pt-BR")}</span>
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
    <div className="p-5 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>{icon}</div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}
