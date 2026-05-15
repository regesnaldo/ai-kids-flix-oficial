'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { UniverseTransition } from './UniverseTransition';

interface AgentChatProps {
  agentId: string;
  agentName: string;
  agentApproach: string;
  accentColor?: string;
  immersive?: boolean;
  heroInput?: string;
  onHeroInputChange?: (value: string) => void;
  heroSendSignal?: number;
}

export default function AgentChat({
  agentId,
  agentName,
  agentApproach,
  accentColor = '#3B82F6',
  immersive = false,
  heroInput,
  onHeroInputChange,
  heroSendSignal,
}: AgentChatProps) {
  const initialMessage = `Olá! Eu sou ${agentName}. ${agentApproach}`;
  const { messages, setMessages, addMessage, clearHistory } = useChatHistory(
    agentId,
    initialMessage,
    { maxMessages: 20 }
  );

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transition, setTransition] = useState<{ from: string; to: string; reason: string } | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const speakingRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    if (!onHeroInputChange || heroSendSignal === 0) return;
    void sendMessage();
  }, [heroSendSignal, sendMessage]);

  const streamingMessageRef = useRef<string | null>(null);

  const handleStreamChunk = useCallback((chunk: string) => {
    const currentText = streamingMessageRef.current || '';
    const newText = currentText + chunk;
    streamingMessageRef.current = newText;
    
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        return [...prev.slice(0, -1), { ...lastMsg, content: newText }];
      }
      return prev;
    });
  }, [setMessages]);

  const composerInput = onHeroInputChange ? (heroInput ?? '') : input;
  const setComposerInput = (value: string) => {
    if (onHeroInputChange) onHeroInputChange(value);
    else setInput(value);
  };

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? composerInput).trim();
    if (!text || isSending) return;

    setError(null);
    setIsSending(true);
    setComposerInput('');

    addMessage('user', text);
    streamingMessageRef.current = '';

    const tempMsgId = `stream_${Date.now()}`;
    setMessages(prev => [...prev, { id: tempMsgId, role: 'assistant', content: '', timestamp: Date.now() }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          messages: [...messages, { role: 'user', content: text }].map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!res.ok) {
        const data: any = await res.json().catch(() => ({}));
        const msg = typeof data?.error === 'string' ? data.error : 'Falha ao enviar mensagem';
        setError(msg);
        setMessages(prev => prev.filter(m => m.id !== tempMsgId));
        return;
      }

      if (!res.body) {
        setError('Resposta vazia do servidor');
        setMessages(prev => prev.filter(m => m.id !== tempMsgId));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        handleStreamChunk(chunk);
      }

      streamingMessageRef.current = null;

    } catch (e) {
      setError('Erro de rede ao enviar mensagem');
      setMessages(prev => prev.filter(m => m.id !== tempMsgId));
    } finally {
      setIsSending(false);
    }

    if (streamingMessageRef.current) {
      try {
        const checkRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId,
            messages: [...messages, { role: 'user', content: text }, { role: 'assistant', content: streamingMessageRef.current }].map((m) => ({ role: m.role, content: m.content })),
            stream: false,
          }),
        })
        if (checkRes.ok) {
          const checkData = await checkRes.json()
          if (checkData.transitionTo && checkData.transitionTo !== agentId) {
            setTransition({ from: agentId, to: checkData.transitionTo, reason: checkData.transitionReason || 'Transicao narrativa' })
          }
        }
      } catch { }
    }
  }

  function resetChat() {
    clearHistory();
    setError(null);
    setComposerInput('');
    streamingMessageRef.current = null;
  }

  function toggleSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      speakingRef.current = null;
      setIsSpeaking(false);
      return;
    }

    const latestAssistant = [...messages].reverse().find((m) => m.role === 'assistant' && m.content.trim());
    if (!latestAssistant) return;

    const utterance = new SpeechSynthesisUtterance(latestAssistant.content);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      speakingRef.current = null;
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      speakingRef.current = null;
      setIsSpeaking(false);
    };

    speakingRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className={immersive ? 'w-full py-8 md:py-12' : 'mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden'}>
      <div className={`flex items-center justify-between px-6 py-4 ${immersive ? '' : 'border-b border-white/10'}`}>
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white truncate">Chat com {agentName}</h2>
          <p className="text-sm text-white/60 truncate">{agentApproach}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSpeech}
            className="shrink-0 h-10 w-10 rounded-full text-white/80 hover:text-white transition"
            style={{ backgroundColor: isSpeaking ? `${accentColor}33` : 'rgba(255,255,255,0.08)' }}
            aria-label={isSpeaking ? 'Parar áudio' : 'Ouvir última resposta'}
          >
            {isSpeaking ? <VolumeX size={16} className="mx-auto" /> : <Volume2 size={16} className="mx-auto" />}
          </button>
          <button
            type="button"
            onClick={resetChat}
            className="shrink-0 px-4 py-2 rounded-xl bg-white/10 text-white/90 hover:bg-white/15 transition"
            aria-label="Reiniciar conversa"
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div
        className="h-[380px] sm:h-[440px] overflow-y-auto px-4 sm:px-6 py-5 space-y-4"
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
                    ? 'text-white'
                    : 'text-white/90'
                }`}
                style={isUser ? { backgroundColor: `${accentColor}33` } : { backgroundColor: 'rgba(255,255,255,0.06)' }}
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

      <div className={`px-4 sm:px-6 py-4 ${immersive ? '' : 'border-t border-white/10'}`}>
        {error && (
          <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <textarea
            value={composerInput}
            onChange={(e) => setComposerInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Digite sua mensagem…"
            className="flex-1 min-h-[52px] max-h-32 resize-none rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none transition"
            style={{ boxShadow: 'none' }}
            aria-label="Digite sua mensagem"
          />
          <button
            type="button"
            onClick={() => {
              void sendMessage();
            }}
            disabled={isSending || !composerInput.trim()}
            className="px-5 py-3 rounded-2xl text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{ backgroundColor: accentColor }}
            aria-label="Enviar mensagem"
          >
            Enviar
          </button>
        </div>

        <p className="mt-3 text-xs text-white/50">
          Enter envia • Shift+Enter quebra linha
        </p>
      </div>

      {transition && (
        <UniverseTransition
          fromAgent={transition.from}
          toAgent={transition.to}
          reason={transition.reason}
          onComplete={() => setTransition(null)}
        />
      )}
    </section>
  );
}

