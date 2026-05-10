import { useState } from "react";
import { Zap } from "lucide-react";

interface NexusPanelProps {
  onSendMessage: (message: string) => void;
  response: string;
  loading: boolean;
}

const quickActions = [
  { label: "Recomendar conteúdo", message: "Recomende um conteúdo interessante para mim aprender sobre IA." },
  { label: "Explicar conceito", message: "Explique um conceito de IA de forma simples." },
  { label: "Ajudar com desafio", message: "Me ajude a resolver um desafio relacionado a aprendizado de IA." },
];

export default function NexusPanel({ onSendMessage, response, loading }: NexusPanelProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <div
      style={{
        width: "360px",
        height: "100vh",
        background: "rgba(10, 10, 26, 0.95)",
        borderLeft: "1px solid rgba(139, 92, 246, 0.2)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/images/agentes/nexus.png" alt="NEXUS" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
          <div>
            <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>NEXUS</div>
            <div style={{ color: "#10B981", fontSize: "12px", fontWeight: 500 }}>● ONLINE</div>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "15px",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Seu mentor de IA está aqui para guiar você por experiências de aprendizado personalizadas e responder suas dúvidas.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(action.message)}
              disabled={loading}
              style={{
                padding: "10px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
                cursor: loading ? "not-allowed" : "pointer",
                textAlign: "left",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "14px",
            minHeight: "180px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>NEXUS está pensando...</div>
          ) : response ? (
            <div style={{ color: "#fff", lineHeight: 1.6, fontSize: "14px" }}>{response}</div>
          ) : (
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                textAlign: "center",
                paddingTop: "30px",
              }}
            >
              Pergunte algo ao NEXUS...
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "14px",
              opacity: loading ? 0.5 : 1,
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "10px 14px",
              background: loading ? "rgba(139, 92, 246, 0.5)" : "#8B5CF6",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <Zap size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
