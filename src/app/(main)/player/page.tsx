"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface InteractiveQuestion { question: string; options: string[]; }

function AudioButton({ text }: { text: string }) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function handleClick() {
    if (loading) return;
    if (playing && audioRef.current) { audioRef.current.pause(); setPlaying(false); return; }
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); setPlaying(true); return; }
    setLoading(true);
    const audio = document.createElement("audio");
    audio.src = "/api/tts?text=" + encodeURIComponent(text);
    audio.addEventListener("canplaythrough", function h() { audio.removeEventListener("canplaythrough", h); setLoading(false); setPlaying(true); audio.play(); });
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("error", () => { setLoading(false); setPlaying(false); });
    audioRef.current = audio;
    audio.load();
  }

  return (
    <button onClick={handleClick} title="Ouvir pergunta" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid rgba(59,130,246,0.3)", background: playing ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.05)", color: loading ? "#555" : playing ? "#3B82F6" : "#888", cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
      {loading ? "..." : playing ? "||" : "\u25B6"}
    </button>
  );
}

function PlayerContent() {
  const searchParams = useSearchParams();
  const seriesTitle = searchParams.get("series") || "MENTE.AI";
  const episodeTitle = searchParams.get("episode") || "Episodio 1";
  const [questions, setQuestions] = useState<InteractiveQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  async function generateQuestions() {
    setLoading(true); setSelected({});
    try {
      const res = await fetch("/api/interaction", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seriesTitle, episodeTitle, ageGroup: "adult", seed: Math.random() }) });
      const data = await res.json();
      if (Array.isArray(data.content)) setQuestions(data.content);
      else if (data.question) setQuestions([data]);
    } catch { console.error("Erro ao gerar perguntas"); }
    finally { setLoading(false); }
  }

  useEffect(() => { generateQuestions(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <h1 style={{ color: "#00D4FF", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{seriesTitle}</h1>
      <h2 style={{ color: "#aaa", fontSize: "1rem", marginBottom: "2rem" }}>{episodeTitle}</h2>
      <div style={{ width: "100%", maxWidth: "800px", background: "#111", borderRadius: "12px", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", border: "1px solid #222" }}>
        <span style={{ color: "#444" }}>Player de video em breve</span>
      </div>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h3 style={{ color: "#F59E0B", marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: 700 }}>Momento de Reflexao</h3>
        {loading && <p style={{ color: "#555" }}>Gerando perguntas...</p>}
        {questions.map((q, qi) => (
          <div key={qi} style={{ background: "linear-gradient(145deg, rgba(15,20,50,0.9), rgba(10,14,39,0.95))", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem", border: "1px solid rgba(59,130,246,0.15)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1rem" }}>
              <AudioButton text={q.question} />
              <p style={{ margin: 0, lineHeight: 1.6, flex: 1 }}>{q.question}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setSelected(s => ({ ...s, [qi]: opt }))} style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: selected[qi] === opt ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.08)", background: selected[qi] === opt ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)", color: "white", cursor: "pointer", textAlign: "left" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        {questions.length > 0 && !loading && (
          <button onClick={generateQuestions} style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#fff", fontWeight: 700, cursor: "pointer", marginTop: "1rem", textTransform: "uppercase", fontSize: "0.8rem" }}>Novas Perguntas</button>
        )}
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (<Suspense fallback={<div style={{ color: "white", padding: "2rem" }}>Carregando...</div>}><PlayerContent /></Suspense>);
}
