"use client";
import { useState, useEffect, useCallback } from "react";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Props {
  agentId: string;
  agentName: string;
}

export default function AgentNotes({ agentId, agentName }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [audioState, setAudioState] = useState<"idle"|"loading"|"playing">("idle");

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/notes?agentId=${agentId}`);
      const data = await res.json();
      setNotes(data.notes ?? []);
    } catch {}
    setLoading(false);
  }, [agentId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  async function saveNote() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, content }),
      });
      const data = await res.json();
      if (data.note) {
        setNotes(prev => [...prev, data.note]);
        setContent("");
        fetch("/api/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "NOTA_CRIADA" }),
        }).catch(() => {});
      }
    } catch {}
    setSaving(false);
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  async function playAudio() {
    setAudioState("loading");
    try {
      const text = `Bem-vindo ao painel de anotações do agente ${agentName}. Aqui você pode salvar seus insights e reflexões de cada conversa. Use as notas para registrar o que aprendeu, dúvidas que surgiram, ou conexões que fez com outros conceitos. Suas anotações são pessoais e ficam salvas para você revisar quando quiser.`;
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
    <div style={{ background: "rgba(15,10,30,0.85)", border: "1px solid #7C3AED", borderRadius: 12, padding: 24, marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📓</span>
          <h3 style={{ color: "#E2D9F3", margin: 0, fontSize: 16, fontWeight: 600 }}>
            Minhas Anotações — {agentName}
          </h3>
        </div>
        <button onClick={playAudio} disabled={audioState === "loading"}
          style={{ background: audioState === "playing" ? "#6D28D9" : "#7C3AED", border: "none", borderRadius: 8, padding: "6px 14px", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          {audioState === "loading" ? "⏳ Carregando..." : audioState === "playing" ? "🔊 Tocando..." : "🔊 Ouvir"}
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#9CA3AF", fontSize: 14 }}>Carregando notas...</div>
      ) : notes.length === 0 ? (
        <div style={{ color: "#6B7280", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
          Nenhuma anotação ainda. Comece registrando seus insights!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {notes.map(note => (
            <div key={note.id} style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <p style={{ color: "#D1D5DB", fontSize: 14, margin: 0, lineHeight: 1.6, flex: 1 }}>{note.content}</p>
                <button onClick={() => deleteNote(note.id)}
                  style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 16, padding: 0, flexShrink: 0 }}>🗑️</button>
              </div>
              <span style={{ color: "#6B7280", fontSize: 12, marginTop: 6, display: "block" }}>
                {new Date(note.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      )}

      <div>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder="Escreva seu insight aqui..."
          maxLength={2000}
          style={{ width: "100%", minHeight: 90, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 8, padding: 12, color: "#E2D9F3", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
          onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) saveNote(); }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ color: content.length > 1800 ? "#EF4444" : "#6B7280", fontSize: 12 }}>{content.length}/2000</span>
          <button onClick={saveNote} disabled={saving || !content.trim()}
            style={{ background: "#7C3AED", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontSize: 14, opacity: saving || !content.trim() ? 0.6 : 1 }}>
            {saving ? "Salvando..." : "Salvar Nota"}
          </button>
        </div>
      </div>
    </div>
  );
}
