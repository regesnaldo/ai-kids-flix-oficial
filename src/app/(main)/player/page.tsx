"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface InteractiveQuestion {
  question: string;
  options: string[];
}

function PlayerContent() {
  const searchParams = useSearchParams();
  const seriesTitle = searchParams.get("series") || "MENTE.AI";
  const episodeTitle = searchParams.get("episode") || "Episodio 1";
  const [questions, setQuestions] = useState<InteractiveQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  async function generateQuestions() {
    setLoading(true);
    setSelected({});
    try {
      const res = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesTitle, episodeTitle, ageGroup: "adult" }),
      });
      const data = await res.json();
      if (Array.isArray(data.content)) {
        setQuestions(data.content);
      } else if (data.question) {
        setQuestions([data]);
      }
    } catch {
      console.error("Erro ao gerar perguntas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { generateQuestions(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <h1 style={{ color: "#00D4FF", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{seriesTitle}</h1>
      <h2 style={{ color: "#aaa", fontSize: "1rem", marginBottom: "2rem" }}>{episodeTitle}</h2>
      <div style={{ width: "100%", maxWidth: "800px", background: "#111", borderRadius: "12px", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", border: "1px solid #222" }}>
        <span style={{ color: "#444" }}>▶ Player de vídeo em breve</span>
      </div>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h3 style={{ color: "#F59E0B", marginBottom: "1.5rem" }}>🧠 Momento de Reflexão</h3>
        {loading && <p style={{ color: "#555" }}>Gerando perguntas...</p>}
        {questions.map((q, qi) => (
          <div key={qi} style={{ background: "#111", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem", border: "1px solid #1a1a3a" }}>
            <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>{q.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setSelected(s => ({ ...s, [qi]: opt }))}
                  style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: selected[qi] === opt ? "2px solid #00D4FF" : "1px solid #333", background: selected[qi] === opt ? "#0a2a3a" : "#1a1a2a", color: "white", cursor: "pointer", textAlign: "left" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        {questions.length > 0 && !loading && (
          <button onClick={generateQuestions} style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "#000", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}>
            Novas Perguntas
          </button>
        )}
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div style={{ color: "white", padding: "2rem" }}>Carregando...</div>}>
      <PlayerContent />
    </Suspense>
  );
}
