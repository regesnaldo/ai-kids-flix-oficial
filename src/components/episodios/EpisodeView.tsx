"use client";

import { useState } from "react";
import { Episode } from "@/types/episode";
import { AgentAvatar } from "@/components/agents/AgentAvatar";
import { useChat } from "@/hooks/useChat";

interface EpisodeViewProps {
  episode: Episode;
  t: Record<string, string>;
}

export function EpisodeView({ episode, t }: EpisodeViewProps) {
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat({
    agentId: episode.mainAgent,
    episodeId: episode.slug,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <header className="border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex items-start gap-4">
          <AgentAvatar agentId={episode.mainAgent} size="lg" />
          <div>
            <h1 className="text-2xl font-bold">{episode.title}</h1>
            <p className="text-slate-400 mt-1">{episode.description}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-2 py-1 bg-blue-500/20 rounded text-sm">
                {episode.season}
              </span>
              <span className="px-2 py-1 bg-emerald-500/20 rounded text-sm">
                {episode.xp} {t.xp || "XP"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto p-6">
        <div className="bg-white/5 rounded-xl p-4 min-h-[400px] space-y-4">
          {messages.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              <p className="text-lg mb-2">Bem-vindo ao episódio!</p>
              <p className="text-sm"> converse com {episode.mainAgent} sobre: {episode.theme}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-slate-500 animate-pulse">Pensando...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder || "Digite sua mensagem..."}
            className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition"
          >
            {t.send || "Enviar"}
          </button>
        </form>
      </section>
    </main>
  );
}