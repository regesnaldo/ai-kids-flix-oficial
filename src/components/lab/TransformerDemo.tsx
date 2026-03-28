"use client";
import { useState, useRef, useCallback } from "react";

interface Alternative { token: string; probability: number; }
interface TokenStep { token: string; probability: number; alternatives: Alternative[]; tokenIndex: number; }

const EXAMPLES = ["A inteligência artificial é", "No futuro, os robôs vão", "O aprendizado de máquina funciona"];

export default function TransformerDemo() {
  const [prompt, setPrompt] = useState("");
  const [tokens, setTokens] = useState<TokenStep[]>([]);
  const [revealed, setRevealed] = useState<TokenStep[]>([]);
  const [current, setCurrent] = useState<TokenStep | null>(null);
  const [fullText, setFullText] = useState("");
  const [builtText, setBuiltText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [audioState, setAudioState] = useState<"idle"|"loading"|"playing">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(async (text?: string) => {
    const p = text ?? prompt;
    if (!p.trim()) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(true); setTokens([]); setRevealed([]); setCurrent(null);
    setBuiltText(""); setDone(false); setFullText("");

    try {
      const res = await fetch("/api/lab/transformer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, maxTokens: 20 }),
      });
      const data = await res.json();
      if (!data.tokens?.length) { setLoading(false); return; }
      setFullText(data.fullText);
      setTokens(data.tokens);
      setLoading(false);

      let i = 0;
      intervalRef.current = setInterval(() => {
        if (i >= data.tokens.length) {
          clearInterval(intervalRef.current!);
          setCurrent(null); setDone(true); return;
        }
        const t = data.tokens[i];
        setCurrent(t);
        setRevealed(prev => [...prev, t]);
        setBuiltText(prev => prev + (i === 0 ? "" : " ") + t.token);
        i++;
      }, 600);
    } catch { setLoading(false); }
  }, [prompt]);

  async function playAudio() {
    setAudioState("loading");
    try {
      const text = "Esta demo mostra como um modelo de linguagem gera texto. A cada passo, o modelo calcula a probabilidade de cada palavra possível e escolhe uma delas. As barras mostram essa probabilidade em tempo real.";
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setAudioState("playing");
      audio.play();
      audio.onended = () => { setAudioState("idle"); URL.revokeObjectURL(url); };
    } catch { setAudioState("idle"); }
  }

  return (
    <div style={{ color: "#E2D9F3", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "#C4B5FD" }}>⚡ Transformers em Ação</h3>
        <button onClick={playAudio} disabled={audioState === "loading"}
          style={{ background: audioState === "playing" ? "#6D28D9" : "#7C3AED", border: "none", borderRadius: 8, padding: "5px 12px", color: "#fff", cursor: "pointer", fontSize: 12 }}>
          {audioState === "loading" ? "⏳" : audioState === "playing" ? "🔊 Tocando..." : "🔊 Ouvir"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => { setPrompt(ex); generate(ex); }}
            style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 20, padding: "4px 12px", color: "#C4B5FD", cursor: "pointer", fontSize: 12 }}>
            {ex}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Digite um prompt em português..."
          onKeyDown={e => e.key === "Enter" && generate()}
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 8, padding: "8px 12px", color: "#E2D9F3", fontSize: 14 }} />
        <button onClick={() => generate()} disabled={loading || !prompt.trim()}
          style={{ background: "#7C3AED", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", cursor: "pointer", fontSize: 14, opacity: loading || !prompt.trim() ? 0.6 : 1 }}>
          {loading ? "⏳" : "Gerar"}
        </button>
      </div>

      {builtText && (
        <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, padding: 16, marginBottom: 20, minHeight: 48 }}>
          <span style={{ color: "#E2D9F3", fontSize: 15, lineHeight: 1.8 }}>{builtText}</span>
          {!done && <span style={{ animation: "pulse 1s infinite", color: "#7C3AED" }}>▋</span>}
          {done && <span style={{ marginLeft: 8, background: "#059669", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>concluído</span>}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 20 }}>Gerando com Claude Haiku...</div>
      )}

      {current && (
        <div style={{ background: "rgba(15,10,30,0.9)", border: "1px solid #7C3AED", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 32, fontWeight: 700, background: "#7C3AED", color: "#fff", padding: "8px 20px", borderRadius: 10 }}>
              {current.token}
            </span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#C4B5FD", fontWeight: 600 }}>{current.token}</span>
              <span style={{ fontSize: 13, color: "#C4B5FD" }}>{Math.round(current.probability * 100)}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 10 }}>
              <div style={{ background: "linear-gradient(90deg,#7C3AED,#3B82F6)", height: 10, borderRadius: 4, width: `${current.probability * 100}%`, transition: "width 0.4s" }} />
            </div>
          </div>
          {current.alternatives.map(alt => (
            <div key={alt.token} style={{ marginBottom: 8, opacity: 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{alt.token}</span>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{Math.round(alt.probability * 100)}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 6 }}>
                <div style={{ background: "#4B5563", height: 6, borderRadius: 4, width: `${alt.probability * 100}%`, transition: "width 0.4s" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!current && !loading && tokens.length === 0 && (
        <div style={{ textAlign: "center", color: "#6B7280", padding: 30, border: "1px dashed rgba(124,58,237,0.3)", borderRadius: 12 }}>
          Digite um prompt acima e clique em Gerar
        </div>
      )}
    </div>
  );
}
