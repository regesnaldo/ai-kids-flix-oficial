"use client";

import React, { useRef, useEffect } from "react";
import type { ChatMessage } from "@/types/chat";
import type { Agent } from "@/types/agent";

interface ChatPanelProps {
  messages: ChatMessage[];
  activeAgent: Agent | undefined;
  isLoading: boolean;
  error: string | null;
}

function MessageBubble({ message, agentColor }: { message: ChatMessage; agentColor: string }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md"
            : "rounded-bl-md"
        }`}
        style={{
          backgroundColor: isUser ? `${agentColor}18` : "rgba(30,41,59,0.8)",
          border: `1px solid ${isUser ? `${agentColor}33` : "rgba(148,163,184,0.15)"}`,
          color: isUser ? agentColor : "#F8FAFC",
        }}
      >
        {!isUser && message.agentId && (
          <p className="text-xs font-medium mb-1 opacity-70" style={{ color: agentColor }}>
            {message.agentId.toUpperCase()}
          </p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export function ChatPanel({ messages, activeAgent, isLoading, error }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const agentColor = activeAgent?.color ?? "#7C3AED";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-mente-surface border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div
        className="px-5 py-3.5 border-b border-slate-700 flex items-center gap-3"
        style={{
          backgroundColor: `${agentColor}0a`,
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agentColor }} />
        <div>
          <p className="text-sm font-medium text-mente-text">
            {activeAgent?.name ?? "Nenhum agente"}
          </p>
          <p className="text-xs text-mente-muted">
            {activeAgent?.expertise ?? "Selecione um agente"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-[200px] max-h-[400px]">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-10 h-10 mx-auto mb-3 opacity-30"
                style={{ color: agentColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <p className="text-sm text-mente-muted">
                Selecione um agente e faça uma pergunta
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} agentColor={agentColor} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{
                backgroundColor: "rgba(30,41,59,0.8)",
                border: "1px solid rgba(148,163,184,0.15)",
              }}
            >
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: agentColor, animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: agentColor, animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: agentColor, animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-2">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
