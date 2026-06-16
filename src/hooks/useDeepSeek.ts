"use client";

import { useCallback, useState } from "react";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

/**
 * Hook para chamar o endpoint LLM com cache em localStorage.
 *
 * Padrão: antes de chamar a API, verifica localStorage.
 * Depois de receber resposta, salva no cache.
 */
export function useDeepSeek() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Gera a chave de cache padronizada.
   */
  const cacheKey = useCallback(
    (agentId: string, season: number, episode?: number, type?: string) => {
      const parts = ["mente_ai", agentId, `s${season}`];
      if (episode !== undefined) parts.push(`e${episode}`);
      if (type) parts.push(type);
      return parts.join("_");
    },
    []
  );

  /**
   * Lê do cache. Retorna null se não encontrado.
   */
  const getCache = useCallback(<T,>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<T>;
      // Cache válido por 30 dias
      if (Date.now() - entry.timestamp > 30 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }, []);

  /**
   * Salva no cache.
   */
  const setCache = useCallback(<T,>(key: string, data: T) => {
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // localStorage cheio ou indisponível — ignora
    }
  }, []);

  /**
   * Chama a API LLM com cache.
   * Se os dados já estiverem em cache, retorna imediatamente sem chamar a API.
   */
  const generate = useCallback(
    async <T,>(params: {
      agentId: string;
      season: number;
      episode?: number;
      type?: string;
      system: string;
      prompt: string;
      temperature?: number;
      maxTokens?: number;
      jsonMode?: boolean;
    }): Promise<T | null> => {
      const key = cacheKey(
        params.agentId,
        params.season,
        params.episode,
        params.type
      );

      // 1. Tenta cache
      const cached = getCache<T>(key);
      if (cached) return cached;

      // 2. Chama API
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/llm/chat", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system: params.system,
            prompt: params.prompt,
            temperature: params.temperature,
            maxTokens: params.maxTokens,
          }),
        });

        const body = await res.json();

        if (!res.ok || body.error) {
          throw new Error(body.error || `HTTP ${res.status}`);
        }

        let data: T;
        if (params.jsonMode && typeof body.content === "string") {
          try {
            data = JSON.parse(body.content) as T;
          } catch {
            throw new Error("Resposta não é JSON válido");
          }
        } else {
          data = body.content as unknown as T;
        }

        // 3. Salva cache
        setCache(key, data);

        return data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, getCache, setCache]
  );

  return { generate, loading, error };
}
