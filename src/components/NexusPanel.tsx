import { useState } from "react";
import Image from "next/image";
import { Zap } from "lucide-react";
import { getAgentImage, AGENT_IMAGE_FALLBACK } from "@/lib/getAgentImage";

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
    <div className="w-[360px] h-screen bg-[#0a0a1a] border-l border-[#8B5CF6]/20 fixed right-0 top-0 z-10 flex flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src={getAgentImage("nexus")} alt="NEXUS" width={40} height={40} className="rounded-full"
          onError={(e) => { e.currentTarget.src = AGENT_IMAGE_FALLBACK }} />
          <div>
            <div className="text-white text-base font-semibold">NEXUS</div>
            <div className="text-emerald-500 text-xs font-medium">● ONLINE</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
        <div className="text-white/85 text-[15px] leading-relaxed font-normal">
          Seu mentor de IA está aqui para guiar você por experiências de aprendizado personalizadas e responder suas dúvidas.
        </div>

        <div className="flex flex-col gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(action.message)}
              disabled={loading}
              className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-[13px] text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-white/10"
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg p-3.5 min-h-[180px] overflow-y-auto">
          {loading ? (
            <div className="text-white/70 italic">NEXUS está pensando...</div>
          ) : response ? (
            <div className="text-white leading-relaxed text-sm">{response}</div>
          ) : (
            <div className="text-white/50 italic text-center pt-8">
              Pergunte algo ao NEXUS...
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-white/10">
        <div className="flex gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta..."
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 rounded-md border border-white/20 bg-white/5 text-white text-sm disabled:opacity-50 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-2.5 bg-purple-500 disabled:bg-purple-500/50 rounded-md text-white disabled:cursor-not-allowed transition-colors hover:bg-purple-400"
          >
            <Zap size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
