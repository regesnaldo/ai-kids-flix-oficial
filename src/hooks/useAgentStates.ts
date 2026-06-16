/**
 * ─── useAgentStates ─────────────────────────────────────────────────────────
 * Hook único de leitura do estado real dos 12 agentes.
 * Fonte: /api/presence (contagem por agente, últimos 5 min)
 * Consumido por: MemoryGalaxy, HoverPreview, qualquer futuro componente.
 * Polling a cada 30s — sem SSE, sem complexidade desnecessária.
 * Somente leitura — sem estado próprio além do cache local.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AgentState {
  id: string
  presenceCount: number  // usuários no universo nos últimos 5 min
  isOnline: boolean      // true se presenceCount > 0
}

interface UseAgentStatesReturn {
  states: Record<string, AgentState>
  loading: boolean
  error: boolean
  refresh: () => void
}

const POLL_INTERVAL = 30_000 // 30 segundos

export function useAgentStates(): UseAgentStatesReturn {
  const [states, setStates] = useState<Record<string, AgentState>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchStates = useCallback(async () => {
    try {
      const res = await fetch('/api/presence', {
        credentials: 'include',
        cache: 'no-store',
      })
      if (!res.ok) {
        setError(true)
        return
      }
      const data: Record<string, number> = await res.json()
      const mapped: Record<string, AgentState> = {}
      for (const [id, count] of Object.entries(data)) {
        mapped[id] = {
          id,
          presenceCount: count,
          isOnline: count > 0,
        }
      }
      setStates(mapped)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStates()
    const interval = setInterval(fetchStates, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchStates])

  return { states, loading, error, refresh: fetchStates }
}

/** Helper: retorna presença de um agente específico */
export function getAgentState(
  states: Record<string, AgentState>,
  agentId: string
): AgentState {
  return states[agentId] ?? { id: agentId, presenceCount: 0, isOnline: false }
}
