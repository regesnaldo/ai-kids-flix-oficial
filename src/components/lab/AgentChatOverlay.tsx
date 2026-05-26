'use client'

import { useRef, useEffect } from 'react'
import { useAgentChat } from './useAgentChat'
import { AGENTS, AGENT_ORDER, type AgentId } from '@/canon/agents/canon'

const AGENT_TABS = AGENT_ORDER.map((id) => ({
  id,
  label: AGENTS[id].identity.name,
  color: AGENTS[id].identity.color,
}))

export default function AgentChatOverlay() {
  const { messages, isChatLoading, activeAgent, sendMessage, switchAgent } = useAgentChat()
  const inputRef = useRef<HTMLInputElement>(null!)
  const bottomRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = inputRef.current.value.trim()
    if (!value || isChatLoading) return
    inputRef.current.value = ''
    sendMessage(value)
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: '16px',
        top: '80px',
        bottom: '80px',
        width: '380px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 20, 0.85)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        {AGENT_TABS.map((a) => (
          <button
            key={a.id}
            onClick={() => switchAgent(a.id)}
            style={{
              flex: 1,
              padding: '12px 8px',
              fontSize: '10px',
              fontFamily: 'var(--font-orbitron), monospace',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: activeAgent === a.id ? `${a.color}15` : 'transparent',
              color: activeAgent === a.id ? a.color : 'rgba(255,255,255,0.3)',
              border: 'none',
              borderBottom: activeAgent === a.id ? `2px solid ${a.color}` : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.15)',
              fontSize: '11px',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            Selecione um agente e faça uma pergunta
          </div>
        )}

        {messages.map((msg) => {
          const agentColor = AGENT_TABS.find((a) => a.id === msg.agentId)?.color || '#00f5ff'
          const isUser = msg.role === 'user'

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                lineHeight: '1.5',
                background: isUser
                  ? 'rgba(255,255,255,0.06)'
                  : `${agentColor}10`,
                border: `1px solid ${isUser ? 'rgba(255,255,255,0.06)' : `${agentColor}20`}`,
                color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.85)',
              }}
            >
              {!isUser && (
                <div
                  style={{
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: agentColor,
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-orbitron), monospace',
                  }}
                >
                  {msg.agentId}
                </div>
              )}
              {msg.content}
            </div>
          )
        })}

        {isChatLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '8px 12px',
              borderRadius: '8px',
              background: `${AGENT_TABS.find((a) => a.id === activeAgent)?.color}10` || 'rgba(0,245,255,0.05)',
              border: '1px solid rgba(255,255,255,0.04)',
              fontSize: '20px',
              lineHeight: '1',
              color: AGENT_TABS.find((a) => a.id === activeAgent)?.color || '#00f5ff',
            }}
          >
            <span style={{ animation: 'lab-chat-dot 1.2s infinite' }}>.</span>
            <span style={{ animation: 'lab-chat-dot 1.2s infinite 0.2s' }}>.</span>
            <span style={{ animation: 'lab-chat-dot 1.2s infinite 0.4s' }}>.</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Pergunte ao agente..."
          disabled={isChatLoading}
          style={{
            flex: 1,
            padding: '12px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
          }}
        />
        <button
          type="submit"
          disabled={isChatLoading}
          style={{
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            color: isChatLoading
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(255,255,255,0.5)',
            cursor: isChatLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          ⏎
        </button>
      </form>

      <style jsx global>{`
        @keyframes lab-chat-dot {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
