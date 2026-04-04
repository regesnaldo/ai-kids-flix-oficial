"use client";

/**
 * MENTE.AI — Hook: Stream de XP em Tempo Real
 * src/hooks/useXPStream.ts
 *
 * Conecta ao SSE endpoint GET /api/xp/events e mantém o estado
 * de XP do usuário sincronizado em tempo real.
 *
 * Usa EventSource nativo do browser — reconexão automática built-in.
 * Seguro para montar em múltiplos componentes (event source compartilhado via ref).
 *
 * Uso:
 *   const { xpTotal, xpSemana, streakDias, badges, conectado } = useXPStream();
 */

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface XPStreamState {
  xpTotal: number;
  xpSemana: number;
  streakDias: number;
  badgesDesbloqueadas: string[];
  /** true enquanto o SSE está conectado */
  conectado: boolean;
  /** Chamada quando um novo evento de XP chega (ex: para disparar animação) */
  ultimoEvento: XPUpdateEvento | null;
}

export interface XPUpdateEvento {
  xpTotal: number;
  xpSemana: number;
  streakDias: number;
  badgesDesbloqueadas: string[];
  timestamp: string;
  /** Latência em ms entre o evento e a renderização (para monitoramento) */
  latenciaMs?: number;
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const ESTADO_INICIAL: XPStreamState = {
  xpTotal: 0,
  xpSemana: 0,
  streakDias: 0,
  badgesDesbloqueadas: [],
  conectado: false,
  ultimoEvento: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useXPStream(): XPStreamState & { reconectar: () => void } {
  const [estado, setEstado] = useState<XPStreamState>(ESTADO_INICIAL);
  const esRef = useRef<EventSource | null>(null);
  const montagemRef = useRef(true);

  const conectar = useCallback(() => {
    // Fecha conexão anterior se existir
    esRef.current?.close();

    const es = new EventSource("/api/xp/events");
    esRef.current = es;

    es.addEventListener("xp_update", (e: MessageEvent) => {
      if (!montagemRef.current) return;
      try {
        const dados = JSON.parse(e.data) as XPUpdateEvento;
        const latenciaMs = performance.now();
        setEstado((prev) => ({
          ...prev,
          xpTotal: dados.xpTotal,
          xpSemana: dados.xpSemana,
          streakDias: dados.streakDias,
          badgesDesbloqueadas: dados.badgesDesbloqueadas,
          conectado: true,
          ultimoEvento: { ...dados, latenciaMs },
        }));
      } catch {
        // JSON malformado — ignora
      }
    });

    es.addEventListener("open", () => {
      if (montagemRef.current) setEstado((prev) => ({ ...prev, conectado: true }));
    });

    es.addEventListener("error", () => {
      if (montagemRef.current) setEstado((prev) => ({ ...prev, conectado: false }));
      // EventSource reconecta automaticamente — não precisamos fazer nada
    });
  }, []);

  useEffect(() => {
    montagemRef.current = true;
    conectar();

    return () => {
      montagemRef.current = false;
      esRef.current?.close();
      esRef.current = null;
    };
  }, [conectar]);

  return { ...estado, reconectar: conectar };
}
