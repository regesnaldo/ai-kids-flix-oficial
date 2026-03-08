"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface InteractiveQuestion {
  question: string;
  options: string[];
}

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const seriesTitle = searchParams.get("series") || "MENTE.AI";
  const episodeTitle = searchParams.get("episode") || "Episodio 1";
  const [question, setQuestion] = useState<InteractiveQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateQuestion() {
    setLoading(true);
    setSelected(null);
    try {
      const res = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesTitle, episodeTitle, ageGroup: "adult" }),
      });
      const data = await res.json();
      setQuestion(data);
    } catch {
      console.error("Erro ao gerar pergunta");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generateQuestion();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a1a",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem",
    }}>
      <h1 style={{ color: "#00D4FF", fontSize: "1.5rem", marginBottom: "0.5rem" }}>{seriesTitle}</h1>
      <h2 style={{ color: "#aaa", fontSize: "1rem", marginBottom: "2rem" }}>{episodeTitle}</h2>

      <div style={{
        width: "100%",
        maxWidth: "800px",
        background: "#111",
        borderRadius: "12px",
        aspectRatio: "16/9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "2rem",
        border: "1px solid #222",
      }}>
        <span style={{ color: "#444", fontSize: "1rem" }}>▶ Player de vídeo em breve</span>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "800px",
        background: "#111",
        borderRadius: "12px",
        padding: "2rem",
        border: "1px solid #1a1a3a",
      }}>
        <h3 style={{ color: "#F59E0B", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
          🧠 Momento de Reflexão
        </h3>

        {loading && <p style={{ color: "#555" }}>Gerando pergunta...</p>}

        {question && !loading && (
          <>
            <p style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>{question.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(opt)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: selected === opt ? "2px solid #00D4FF" : "1px solid #333",
                    background: selected === opt ? "#0a2a3a" : "#1a1a2a",
                    color: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selected && (
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                <button
                  onClick={generateQuestion}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#F59E0B",
                    color: "#000",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Nova Pergunta
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
