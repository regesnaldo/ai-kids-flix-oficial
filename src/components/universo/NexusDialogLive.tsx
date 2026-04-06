"use client";

import { useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  primeiraEscolha?: string | null;
  onSpeak?: (text: string) => Promise<void> | void;
  isSpeaking?: boolean;
  audioEnabled?: boolean;
  endpoint?: string;
  agentLabel?: string;
  initialAssistantMessage?: string;
  onUserMessage?: (text: string) => void;
  onAssistantMessage?: (text: string) => void;
}

export default function NexusDialogLive({
  primeiraEscolha = null,
  onSpeak,
  isSpeaking = false,
  audioEnabled = true,
  endpoint = "/api/nexus/chat",
  agentLabel = "NEXUS",
  initialAssistantMessage,
  onUserMessage,
  onAssistantMessage,
}: Props) {
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<Msg[]>([
    {
      role: "assistant",
      content: initialAssistantMessage ?? (primeiraEscolha
        ? `NEXUS: Você iniciou com "${primeiraEscolha}". O que ainda falta esclarecer?`
        : "NEXUS: O que você está tentando entender hoje que ainda não conseguiu formular por completo?"),
    },
  ]);

  async function enviar() {
    if (!mensagem.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: mensagem.trim() };
    const next = [...historico, userMsg];
    setHistorico(next);
    onUserMessage?.(userMsg.content);
    setMensagem("");
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: userMsg.content, historico: next }),
      });
      const data = await res.json();
      const resposta = data?.resposta ?? "NEXUS está calibrando uma nova pergunta...";
      setHistorico((prev) => [
        ...prev,
        { role: "assistant", content: resposta },
      ]);
      onAssistantMessage?.(resposta);
      if (audioEnabled && onSpeak && !isSpeaking) {
        await onSpeak(resposta);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-blue-300/20 bg-black/40 p-4">
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {historico.map((m, i) => (
          <div key={`${m.role}-${i}`} className={m.role === "assistant" ? "text-blue-100" : "text-white"}>
            <span className="mr-2 font-mono text-xs text-blue-300/70">{m.role === "assistant" ? agentLabel : "VOCÊ"}</span>
            <span className="text-sm">{m.content}</span>
          </div>
        ))}
        {loading && <p className="font-mono text-xs text-blue-400/70">{agentLabel} está pensando...</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="flex-1 rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white"
          placeholder={loading ? "Aguarde NEXUS terminar..." : "Responda ao NEXUS..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") void enviar();
          }}
        />
        <button
          onClick={() => void enviar()}
          disabled={loading}
          className="rounded-lg border border-blue-300/30 bg-blue-500/20 px-3 py-2 text-sm font-semibold text-blue-100 disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </section>
  );
}

