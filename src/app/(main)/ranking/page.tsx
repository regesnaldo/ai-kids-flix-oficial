"use client";
import { useState, useEffect } from "react";

interface RankingItem {
  position: number;
  userId: number;
  name: string;
  xp: number;
  streakDays: number;
  isCurrentUser: boolean;
}

interface CurrentUser {
  position: number;
  xp: number;
  streakDays: number;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [period, setPeriod] = useState<"week"|"all">("week");
  const [loading, setLoading] = useState(true);
  const [audioState, setAudioState] = useState<"idle"|"loading"|"playing">("idle");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/ranking?period=${period}`)
      .then(r => r.json())
      .then(data => {
        setRanking(data.ranking ?? []);
        setCurrentUser(data.currentUser ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  async function playAudio() {
    setAudioState("loading");
    try {
      const text = "Bem-vindo ao Ranking do MENTE.AI. Aqui você vê os participantes com mais XP e maiores sequências de estudo desta semana. Cada anotação salva vale 10 XP, cada experimento concluído vale 25 XP, e o login diário vale 5 XP. Mantenha sua sequência para subir no ranking!";
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setAudioState("playing");
      audio.play();
      audio.onended = () => { setAudioState("idle"); URL.revokeObjectURL(url); };
    } catch { setAudioState("idle"); }
  }

  function getInitial(name: string) {
    return name.charAt(0).toUpperCase();
  }

  function getMedalColor(pos: number) {
    if (pos === 1) return { bg: "#F59E0B", text: "#78350F", medal: "🥇" };
    if (pos === 2) return { bg: "#9CA3AF", text: "#1F2937", medal: "🥈" };
    if (pos === 3) return { bg: "#CD7C2F", text: "#431407", medal: "🥉" };
    return null;
  }

  const colors = ["#7C3AED","#3B82F6","#059669","#DC2626","#D97706","#7C3AED"];

  return (
    <div style={{ minHeight: "100vh", background: "transparent", padding: "32px 24px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🏆</span>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#E2D9F3" }}>
              {period === "week" ? "Ranking Semanal" : "Ranking Geral"}
            </h1>
          </div>
          <p style={{ margin: 0, color: "#9CA3AF", fontSize: 14 }}>
            {period === "week" ? "XP acumulado nesta semana" : "XP total de todos os tempos"}
          </p>
        </div>
        <button onClick={playAudio} disabled={audioState === "loading"}
          style={{ background: audioState === "playing" ? "#6D28D9" : "#7C3AED", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>
          {audioState === "loading" ? "⏳" : audioState === "playing" ? "🔊 Tocando..." : "🔊 Ouvir"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {(["week", "all"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: "8px 20px", borderRadius: 20, border: "1px solid rgba(124,58,237,0.4)", background: period === p ? "#7C3AED" : "rgba(124,58,237,0.1)", color: period === p ? "#fff" : "#C4B5FD", cursor: "pointer", fontSize: 14, fontWeight: period === p ? 600 : 400 }}>
            {p === "week" ? "Esta Semana" : "Todos os Tempos"}
          </button>
        ))}
      </div>

      {currentUser && currentUser.position > 0 && (
        <div style={{ background: "rgba(124,58,237,0.15)", border: "2px solid #7C3AED", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#7C3AED", color: "#fff", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
            #{currentUser.position}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#C4B5FD", fontSize: 13, marginBottom: 2 }}>Sua posição</div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ color: "#E2D9F3", fontSize: 15, fontWeight: 600 }}>⚡ {currentUser.xp} XP</span>
              <span style={{ color: "#F59E0B", fontSize: 15 }}>🔥 {currentUser.streakDays} dias</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, height: 64, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6B7280", padding: 48, border: "1px dashed rgba(124,58,237,0.3)", borderRadius: 12 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p>Nenhum dado ainda. Faça login diário e complete experimentos para aparecer aqui!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ranking.map(item => {
            const medal = getMedalColor(item.position);
            const avatarColor = colors[item.userId % colors.length];
            return (
              <div key={item.userId}
                style={{ background: item.isCurrentUser ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${item.isCurrentUser ? "#7C3AED" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: medal ? medal.bg : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: medal ? 20 : 14, fontWeight: 700, color: medal ? medal.text : "#9CA3AF", flexShrink: 0 }}>
                  {medal ? medal.medal : `#${item.position}`}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0 }}>
                  {getInitial(item.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: item.isCurrentUser ? "#C4B5FD" : "#E2D9F3", fontWeight: item.isCurrentUser ? 600 : 400, fontSize: 15 }}>
                    {item.name} {item.isCurrentUser && <span style={{ fontSize: 11, background: "#7C3AED", color: "#fff", padding: "1px 6px", borderRadius: 8, marginLeft: 4 }}>você</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ color: "#C4B5FD", fontWeight: 600, fontSize: 15 }}>⚡ {item.xp}</span>
                  <span style={{ color: "#F59E0B", fontSize: 14 }}>🔥 {item.streakDays}d</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 32, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: 20 }}>
        <h4 style={{ color: "#C4B5FD", margin: "0 0 12px", fontSize: 14 }}>Como ganhar XP</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["📓 Salvar uma nota", "10 XP"], ["🧪 Completar experimento", "25 XP"], ["🔐 Login diário", "5 XP"], ["👤 Perfil completo", "50 XP"]].map(([label, xp]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "#9CA3AF", fontSize: 13 }}>
              <span>{label}</span><span style={{ color: "#7C3AED", fontWeight: 600 }}>{xp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
