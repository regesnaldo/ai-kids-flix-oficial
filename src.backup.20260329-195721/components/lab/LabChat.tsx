"use client";
import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";

interface Message { role: "user" | "assistant"; content: string; }

const AGENTS: Record<string, { name: string; color: string; emoji: string; system: string }> = {
  nexus: { name: "NEXUS", color: "#3B82F6", emoji: "🔮", system: "Você é NEXUS, o agente conector do MENTE.AI. Explique conceitos de Transformers e atenção em IA de forma clara e visual. Seja conciso, use analogias simples. Responda sempre em português do Brasil." },
  volt:  { name: "VOLT",  color: "#F59E0B", emoji: "⚡", system: "Você é VOLT, o agente energético do MENTE.AI. Explique redes neurais com entusiasmo e energia. Use metáforas do cotidiano. Responda sempre em português do Brasil." },
  aurora:{ name: "AURORA",color: "#34D399", emoji: "🌟", system: "Você é AURORA, o agente criativo do MENTE.AI. Explique geração criativa de IA, embeddings e espaços vetoriais com leveza e criatividade. Responda sempre em português do Brasil." },
  ethos: { name: "ETHOS", color: "#8B5CF6", emoji: "🧠", system: "Você é ETHOS, o agente filósofo do MENTE.AI. Debata ética em IA, vieses algorítmicos e responsabilidade com profundidade e pensamento crítico. Responda sempre em português do Brasil." },
};

export default function LabChat({ agentId }: { agentId: string }) {
  const agent = AGENTS[agentId] ?? AGENTS.nexus;
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Olá! Sou ${agent.name}. Como posso ajudar você a entender este experimento?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { play } = useAudio();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agentId,
          messages: [...messages, { role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.message ?? data.response ?? data.content ?? "Não entendi, pode reformular?";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      play(reply.slice(0, 300));
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Erro ao conectar. Tente novamente." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "rgba(0,0,0,0.4)", borderRadius: "12px", border: `1px solid ${agent.color}30`, overflow: "hidden" }}>
      {/* header */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${agent.color}20`, display: "flex", alignItems: "center", gap: "8px", background: `${agent.color}10` }}>
        <span style={{ fontSize: "1.2rem" }}>{agent.emoji}</span>
        <span style={{ color: agent.color, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>{agent.name}</span>
        <span style={{ marginLeft: "auto", width: "7px", height: "7px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", scrollbarWidth: "none" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%", padding: "8px 12px", borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: msg.role === "user" ? `${agent.color}25` : "rgba(255,255,255,0.05)",
              border: `1px solid ${msg.role === "user" ? agent.color + "40" : "rgba(255,255,255,0.08)"}`,
              color: "rgba(255,255,255,0.85)", fontSize: "0.78rem", lineHeight: 1.6
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "4px", padding: "8px 12px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: agent.color, opacity: 0.6, animation: `bounce 1s infinite ${i * 0.2}s` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${agent.color}15`, display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Pergunte ao agente..."
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${agent.color}25`, borderRadius: "8px", padding: "8px 12px", color: "#fff", fontSize: "0.78rem", outline: "none" }}
        />
        <button onClick={send} disabled={loading || !input.trim()}
          style={{ padding: "8px 14px", borderRadius: "8px", background: loading ? "rgba(255,255,255,0.05)" : agent.color, border: "none", color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", opacity: loading || !input.trim() ? 0.5 : 1, transition: "all 0.2s" }}>
          →
        </button>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}



