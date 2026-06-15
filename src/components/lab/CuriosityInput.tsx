"use client";

import React, { useState, useCallback } from "react";
import type { Agent } from "@/types/agent";

const SUGGESTIONS: Record<string, string[]> = {
  nexus: ["Como funciona um algoritmo?", "O que é inteligência?"],
  cipher: ["O que é uma rede neural?", "Como treinar um modelo?"],
  kaos: ["IA pode ser criativa?", "Riscos da inteligência artificial"],
  aurora: ["O que são transformers?", "Como funciona o ChatGPT?"],
  volt: ["O que é Python?", "Machine learning vs deep learning"],
  ethos: ["Privacidade na era da IA", "IA e o futuro do trabalho"],
};

interface CuriosityInputProps {
  activeAgent: Agent | undefined;
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function CuriosityInput({ activeAgent, onSend, isLoading }: CuriosityInputProps) {
  const [input, setInput] = useState("");

  const agentColor = activeAgent?.color ?? "#7C3AED";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;
      onSend(trimmed);
      setInput("");
    },
    [input, isLoading, onSend],
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      onSend(text);
    },
    [onSend],
  );

  const suggestions = activeAgent ? SUGGESTIONS[activeAgent.id] ?? [] : [];

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="lab-curiosity-input" className="sr-only">
          Digite sua curiosidade sobre IA
        </label>
        <input
          id="lab-curiosity-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua curiosidade sobre inteligência artificial..."
          disabled={isLoading}
          className="w-full bg-mente-surface border border-slate-600 rounded-2xl px-5 py-4 pr-14 text-mente-text placeholder:text-mente-muted/60 focus:outline-none focus:ring-2 focus:ring-mente-primary/50 focus:border-mente-primary/50 transition-all duration-200 disabled:opacity-50"
          style={{
            borderColor: input.trim() ? `${agentColor}44` : undefined,
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Enviar pergunta"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mente-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: `${agentColor}18`,
            color: agentColor,
          }}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => handleSuggestion(text)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-mente-primary/50 disabled:opacity-40"
              style={{
                backgroundColor: `${agentColor}0d`,
                color: agentColor,
                borderColor: `${agentColor}22`,
              }}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
