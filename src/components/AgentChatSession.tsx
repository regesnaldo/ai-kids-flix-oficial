"use client";

import { useState, useEffect } from "react";
import { useAgentSession, useAgentSessionCleanup } from "@/hooks/useAgentSession";

interface AgentChatSessionProps {
  agentId: string;
  userId?: number;
  agentName?: string;
  agentColor?: string;
}

export function AgentChatSession({
  agentId,
  userId: propUserId,
  agentName = "Agente",
  agentColor = "#185FA5",
}: AgentChatSessionProps) {
  const { sessionId, events, status, connect, sendMessage, reset } = useAgentSession();
  const [input, setInput] = useState("");
  const [localUserId, setLocalUserId] = useState<number | undefined>(propUserId);
  const [authLoading, setAuthLoading] = useState(!propUserId);

  useAgentSessionCleanup();

  useEffect(() => {
    if (propUserId) {
      setLocalUserId(propUserId);
      setAuthLoading(false);
      return;
    }
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user?.id) {
          setLocalUserId(data.user.id);
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, [propUserId]);

  const userId = localUserId;

  const startSession = async () => {
    if (!userId) return;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, userId, title: `Chat com ${agentName}` }),
    });

    if (!res.ok) {
      console.error("Failed to create session");
      return;
    }

    const { session } = await res.json();
    connect(session.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "active" || !userId) return;

    await sendMessage(agentId, input, userId);
    setInput("");
  };

  const isProcessing = status === "active" || status === "connecting";

  if (authLoading) {
    return <div className="agent-chat-loading">Autenticando...</div>;
  }

  if (!userId) {
    return <div className="agent-chat-unauthenticated">Faça login para conversar com {agentName}.</div>;
  }

  return (
    <div className="agent-chat" style={{ borderColor: agentColor }}>
      <div className="chat-header" style={{ background: agentColor }}>
        <h3>{agentName}</h3>
        <span className={`status-badge ${status}`}>
          {status === "active" ? "●" : status === "connecting" ? "◐" : "○"} {status}
        </span>
      </div>

      {!sessionId ? (
        <div className="session-start">
          <button onClick={startSession} className="btn-primary">
            Iniciar Conversa
          </button>
        </div>
      ) : (
        <button onClick={reset} className="btn-secondary">
          Encerrar Session
        </button>
      )}

      <div className="events-stream">
        {events.map((event, i) => (
          <div key={i} className={`event ${event.type.replace(/\./g, "-")}`}>
            {event.type === "user.message" && (
              <div className="user-bubble">
                <strong>Você:</strong> {event.content.text}
              </div>
            )}
            {event.type === "agent.thinking" && (
              <div className="thinking-indicator">
                💭 {event.content.text}
              </div>
            )}
            {event.type === "agent.message" && (
              <div className="agent-bubble" style={{ borderLeftColor: agentColor }}>
                <strong>{agentName}:</strong> {event.content.text}
              </div>
            )}
            {event.type === "agent.tool_use" && (
              <div className="tool-badge">
                🔧 Usando ferramenta: {event.content.tool}
              </div>
            )}
            {event.type === "session.status_idle" && (
              <div className="done-badge">
                ✅ Agente finalizou
              </div>
            )}
            {event.type === "stream.connected" && (
              <div className="system-msg">Conectado ao stream</div>
            )}
            {event.type === "stream.error" && (
              <div className="error-msg">Erro: {event.content.error}</div>
            )}
          </div>
        ))}

        {isProcessing && events.length > 0 && events[events.length - 1].type !== "session.status_idle" && (
          <div className="pulse-indicator">
            <span className="pulse-dot" style={{ background: agentColor }}></span>
            Processando...
          </div>
        )}
      </div>

      {sessionId && (
        <form onSubmit={handleSubmit} className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={!isProcessing}
          />
          <button type="submit" disabled={!input.trim() || !isProcessing}>
            Enviar
          </button>
        </form>
      )}
    </div>
  );
}
