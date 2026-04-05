/**
 * useChatHistory.ts - Hook para persistência do histórico de chat
 *
 * CORREÇÃO #08 (original): persistência via localStorage com limite de 20 msgs.
 * CORREÇÃO HYDRATION:
 *   - id da mensagem inicial é estável (`init_${agentId}`) — não usa Date.now()
 *   - localStorage só é acessado em useEffect (cliente), NUNCA no inicializador
 *     do useState (que roda no servidor durante SSR) → elimina hydration mismatch.
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp?: number;
}

export interface UseChatHistoryOptions {
  maxMessages?: number;
  storageKeyPrefix?: string;
}

// ─── Mensagem inicial estável (mesmo id no server e no client) ───────────────

function buildInitialMessage(agentId: string, content: string): ChatMessage {
  return {
    id: `init_${agentId}`,   // estável: não depende de Date.now()
    role: 'assistant',
    content,
    timestamp: 0,            // 0 em vez de Date.now() para evitar diffs SSR/CSR
  };
}

// ─── Hook principal ──────────────────────────────────────────────────────────

export function useChatHistory(
  agentId: string,
  initialMessage: string,
  options: UseChatHistoryOptions = {}
) {
  const {
    maxMessages = 20,
    storageKeyPrefix = 'mente-ai-chat',
  } = options;

  const storageKey = useMemo(
    () => `${storageKeyPrefix}-${agentId}`,
    [agentId, storageKeyPrefix],
  );

  // ── Estado inicial: SEMPRE começa com a mensagem do assistente ───────────
  // Nunca toca em localStorage aqui — o servidor também executa este código.
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    buildInitialMessage(agentId, initialMessage),
  ]);

  const [error, setError] = useState<string | null>(null);

  // ── Carrega localStorage UMA vez, após a hidratação ──────────────────────
  // useEffect só roda no cliente, portanto não há risco de mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const restored = (parsed as any[])
        .filter(
          (m) =>
            m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string',
        )
        .slice(-maxMessages)
        .map((m) => ({
          id: String(m.id || `msg_${Date.now()}`),
          role: m.role as ChatRole,
          content: String(m.content),
          timestamp: typeof m.timestamp === 'number' ? m.timestamp : undefined,
        }));

      if (restored.length > 0) {
        setMessages(restored);
      }
    } catch (e) {
      console.warn('[useChatHistory] Erro ao carregar histórico:', e);
    }
  // Rodar apenas na montagem (storageKey não muda durante vida do componente)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // ── Persiste no localStorage sempre que messages mudar ───────────────────
  // (também roda apenas no cliente — useEffect)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
      setError(null);
    } catch (e) {
      console.error('[useChatHistory] Erro ao salvar histórico:', e);
      setError('Não foi possível salvar o histórico');

      // localStorage cheio → mantém apenas as últimas 10 mensagens
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        const trimmed = messages.slice(-10);
        localStorage.setItem(storageKey, JSON.stringify(trimmed));
        setMessages(trimmed);
      }
    }
  }, [messages, storageKey]);

  // ── Adiciona nova mensagem ────────────────────────────────────────────────
  const addMessage = useCallback(
    (role: ChatRole, content: string): ChatMessage => {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        role,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage].slice(-maxMessages));
      return newMessage;
    },
    [maxMessages],
  );

  // ── Limpa o histórico ────────────────────────────────────────────────────
  const clearHistory = useCallback(() => {
    setMessages([buildInitialMessage(agentId, initialMessage)]);
    try { localStorage.removeItem(storageKey); } catch { /* ignora */ }
    setError(null);
  }, [agentId, initialMessage, storageKey]);

  // ── Remove uma mensagem específica ────────────────────────────────────────
  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  return {
    messages,
    setMessages,
    addMessage,
    clearHistory,
    removeMessage,
    error,
    storageKey,
  };
}

// ─── Hook auxiliar: múltiplos agentes ─────────────────────────────────────────

export function useMultiAgentChatHistory(options: UseChatHistoryOptions = {}) {
  const { maxMessages = 20, storageKeyPrefix = 'mente-ai-chat' } = options;
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);

  const chatHistory = useChatHistory(
    currentAgentId ?? 'default',
    'Olá! Como posso ajudar?',
    { maxMessages, storageKeyPrefix },
  );

  const switchAgent = useCallback((agentId: string) => {
    setCurrentAgentId(agentId);
  }, []);

  return { ...chatHistory, currentAgentId, switchAgent };
}

export default useChatHistory;
