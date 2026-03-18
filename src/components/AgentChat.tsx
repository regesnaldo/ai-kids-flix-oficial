'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface AgentChatProps {
  agentId: string;
  agentName: string;
  agentApproach: string;
}

function newId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function AgentChat({ agentId, agentName, agentApproach }: AgentChatProps) {
  const storageKey = useMemo(() => `mente-ai-chat-${agentId}`, [agentId]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: newId(),
      role: 'assistant',
      content: `Olá! Eu sou ${agentName}. ${agentApproach}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const restored = parsed
        .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-50)
        .map((m: any) => ({ id: String(m.id || newId()), role: m.role as ChatRole, content: String(m.content) }));
      if (restored.length > 0) {
        setMessages(restored);
      }
    } catch {
      return;
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isSending) return;

    setError(null);
    setIsSending(true);
    setInput('');

    const userMessage: ChatMessage = { id: newId(), role: 'user', content: text };
    const optimistic = [...messages, userMessage];
    setMessages(optimistic);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          messages: optimistic.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : 'Falha ao enviar mensagem';
        setError(msg);
        setMessages((prev) => prev);
        return;
      }

      const assistantText = typeof data?.message === 'string' ? data.message : '';
      if (!assistantText.trim()) {
        setError('Resposta vazia do servidor');
        return;
      }

      setMessages((prev) => [...prev, { id: newId(), role: 'assistant', content: assistantText }]);
    } catch (e) {
      setError('Erro de rede ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  }

  function resetChat() {
    const initial: ChatMessage[] = [
      { id: newId(), role: 'assistant', content: `Olá! Eu sou ${agentName}. ${agentApproach}` },
    ];
    setMessages(initial);
    localStorage.removeItem(storageKey);
    setError(null);
    setInput('');
  }

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white truncate">Chat com {agentName}</h2>
          <p className="text-sm text-white/60 truncate">{agentApproach}</p>
        </div>
        <button
          type="button"
          onClick={resetChat}
          className="shrink-0 px-4 py-2 rounded-xl bg-white/10 text-white/90 hover:bg-white/15 transition"
          aria-label="Reiniciar conversa"
        >
          Reiniciar
        </button>
      </div>

      <div
        className="h-[360px] sm:h-[420px] overflow-y-auto px-4 sm:px-6 py-5 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Mensagens do chat"
      >
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[92%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-black/30 text-white/90 border border-white/10'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex justify-start">
            <div className="max-w-[92%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-black/30 text-white/70 border border-white/10">
              Digitando…
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="px-4 sm:px-6 py-4 border-t border-white/10">
        {error && (
          <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Digite sua mensagem…"
            className="flex-1 min-h-[52px] max-h-32 resize-none rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition"
            aria-label="Digite sua mensagem"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={isSending || !input.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
            aria-label="Enviar mensagem"
          >
            Enviar
          </button>
        </div>

        <p className="mt-3 text-xs text-white/50">
          Enter envia • Shift+Enter quebra linha
        </p>
      </div>
    </section>
  );
}

