'use client'

import { useCallback } from 'react'
import { useLabStore, type ChatMessage } from '@/store/useLabStore'
import { type AgentId } from '@/canon/agents/canon'

const MAX_HISTORY_PER_AGENT = 10

let msgCounter = 0

export function useAgentChat() {
  const messages = useLabStore((s) => s.messages)
  const isChatLoading = useLabStore((s) => s.isChatLoading)
  const activeAgent = useLabStore((s) => s.activeAgent)

  const switchAgent = useCallback((agent: AgentId) => {
    useLabStore.getState().setActiveAgent(agent)
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      const agent = useLabStore.getState().activeAgent

      const userMsg: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: 'user',
        agentId: agent,
        content,
        timestamp: Date.now(),
      }
      useLabStore.getState().addMessage(userMsg)
      useLabStore.getState().setChatLoading(true)
      useLabStore.getState().setSceneMood('thinking')
      useLabStore.getState().pulseChat()

      try {
        const allMessages = useLabStore.getState().messages
        const agentHistory = allMessages
          .filter((m) => m.agentId === agent)
          .slice(-MAX_HISTORY_PER_AGENT * 2)
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch('/api/agents/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: agent,
            message: content,
            history: agentHistory,
          }),
        })

        if (!res.ok) throw new Error('Falha no agente')

        const data = await res.json()

        const assistantMsg: ChatMessage = {
          id: `msg-${++msgCounter}`,
          role: 'assistant',
          agentId: agent,
          content: data.response,
          timestamp: Date.now(),
        }
        useLabStore.getState().addMessage(assistantMsg)
        useLabStore.getState().setSceneMood('speaking')
        useLabStore.getState().pulseChat()

        setTimeout(() => {
          useLabStore.getState().setSceneMood('idle')
        }, 1500)
      } catch {
        const errorMsg: ChatMessage = {
          id: `msg-${++msgCounter}`,
          role: 'assistant',
          agentId: agent,
          content: '❌ Agente temporariamente indisponível. Tente novamente.',
          timestamp: Date.now(),
        }
        useLabStore.getState().addMessage(errorMsg)
        useLabStore.getState().setSceneMood('idle')
      } finally {
        useLabStore.getState().setChatLoading(false)
      }
    },
    []
  )

  return { messages, isChatLoading, activeAgent, sendMessage, switchAgent }
}
