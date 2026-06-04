// ─── src/components/lab/ConversationArea.tsx ────────────────────────────────

"use client";

import React, { useRef, useEffect } from "react";
import { ArrowRight, X, Play, Pause, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types/chat";
import type { Agent } from "@/types/agent";
import type { LabMode } from "@/types/lab";
import { useTTS } from "@/hooks/useTTS";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface ConversationAreaProps {
  messages: ChatMessage[];
  activeAgent: Agent | undefined;
  isLoading: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onClear: () => void;
  mode: LabMode;
}

/* ─── Message Bubble ─────────────────────────────────────────────────────── */

function Bubble({ msg, agentColor, agentId }: { msg: ChatMessage; agentColor: string; agentId: string }) {
  const isUser = msg.role === "user";
  const { state, play, stop } = useTTS();

  const handleTTS = () => {
    if (state === "playing") {
      stop();
    } else if (msg.content) {
      play(msg.content, agentId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className="relative">
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser ? "rounded-br-md" : "rounded-bl-md"
          }`}
          style={{
            backgroundColor: isUser ? `${agentColor}15` : "rgba(30,41,59,0.9)",
            border: `1px solid ${isUser ? `${agentColor}30` : "rgba(148,163,184,0.12)"}`,
            color: isUser ? agentColor : "#F8FAFC",
          }}
        >
          {!isUser && msg.agentId && (
            <p className="text-xs font-semibold mb-1 opacity-70" style={{ color: agentColor }}>
              {msg.agentId.toUpperCase()}
            </p>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>

        {/* TTS Play button — agent messages only */}
        {!isUser && msg.content && (
          <button
            onClick={handleTTS}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 bg-slate-800 border border-slate-700"
            style={{ color: agentColor }}
            title={state === "playing" ? "Parar áudio" : state === "loading" ? "Carregando áudio..." : "Ouvir resposta"}
            aria-label={state === "playing" ? "Parar áudio" : "Ouvir resposta"}
          >
            {state === "loading" && <Loader2 size={12} className="animate-spin" />}
            {state === "playing" && <Pause size={12} />}
            {state === "idle" && <Play size={12} />}
            {state === "error" && <Play size={12} className="opacity-40" />}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Loading Dots ───────────────────────────────────────────────────────── */

function LoadingBubbles({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-start mb-3"
    >
      <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ backgroundColor: "rgba(30,41,59,0.9)", border: "1px solid rgba(148,163,184,0.12)" }}>
        <div className="flex gap-1.5">
          {[0, 150, 300].map((delay, i) => (
            <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: color, animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export function ConversationArea({ messages, activeAgent, isLoading, error, onSend, onClear, mode }: ConversationAreaProps) {
  const [input, setInput] = React.useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const agentColor = activeAgent?.color ?? "#7C3AED";
  const agentId = activeAgent?.id ?? "nexus";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="w-full">
      {/* Empty state */}
      {!hasMessages && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: `${agentColor}10` }}>
            <svg className="w-8 h-8 opacity-40" style={{ color: agentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">
            Escolha um tópico acima ou digite sua pergunta para começar
          </p>
        </div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800" style={{ backgroundColor: `${agentColor}08` }}>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agentColor }} />
                <span className="text-sm font-medium text-white">{activeAgent?.name ?? "Conversa"}</span>
              </div>
              <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-300 transition" title="Limpar conversa" aria-label="Limpar conversa">
                <X size={16} />
              </button>
            </div>

            {/* Messages scroll */}
            <div className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "50vh" }}>
              {messages.map((msg) => (
                <Bubble key={msg.id} msg={msg} agentColor={agentColor} agentId={agentId} />
              ))}
              {isLoading && <LoadingBubbles color={agentColor} />}
              {error && <p className="text-center text-xs text-red-400 py-2">{error}</p>}
              <div ref={bottomRef} />
            </div>

            {/* Follow-up input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-slate-800">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Continue a conversa..." disabled={isLoading}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500 transition" />
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Enviar mensagem"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{ backgroundColor: input.trim() ? `${agentColor}20` : "rgba(148,163,184,0.05)", color: input.trim() ? agentColor : "#475569" }}>
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
