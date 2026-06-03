"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types/chat";
import { sendMessage, createUserMessage } from "@/services/chat.service";

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg = createUserMessage(content, agentId);
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const agentMsg = await sendMessage(content, agentId);
        setMessages((prev) => [...prev, agentMsg]);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Erro ao processar resposta";
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [agentId, isLoading],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clearMessages };
}
