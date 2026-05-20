'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { VisualStoryPlayer, type VisualStory } from '@/components/visuals/VisualStoryPlayer'
import { useVisualStory } from '@/hooks/useVisualStory'

type Message = {
  role: 'user' | 'agent'
  content: string
  /** When NEXUS detects visual story intent */
  type?: 'visual_story'
  topic?: string
  frames?: number
}

type AgentId = 'nexus' | 'volt' | 'aurora'

const AGENT_NAMES: Record<AgentId, string> = {
  nexus: 'NEXUS',
  volt: 'VOLT',
  aurora: 'AURORA',
}

const EXPERIMENTS = [
  { id: 1, icon: '🧬', title: 'Evolução da IA', desc: 'Jornada visual pela história', prompt: 'mostre-me a evolução da inteligência artificial em 5 cenas' },
  { id: 2, icon: '🧠', title: 'Rede Neural', desc: 'Como neurônios artificiais aprendem', prompt: 'explique como funciona uma rede neural em 5 cenas' },
  { id: 3, icon: '⚖️', title: 'IA e Ética', desc: 'O que é certo e errado para uma IA?', prompt: 'existe ética na inteligência artificial? me faça pensar' },
  { id: 4, icon: '🔮', title: 'Futuro da IA', desc: '5 previsões para os próximos anos', prompt: 'como será a inteligência artificial no futuro? me mostre em cenas' },
]

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const geometry = useRef<THREE.BufferGeometry | null>(null)

  if (!geometry.current) {
    const positions = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.random() * 20
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r
      positions[i * 3 + 2] = Math.cos(phi) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.current = geo
  }

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.0005
  })

  return (
    <points ref={ref} geometry={geometry.current}>
      <pointsMaterial color="#ffffff" size={0.05} opacity={0.6} transparent sizeAttenuation />
    </points>
  )
}

function WorldScene() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color('#000005')
    scene.fog = new THREE.Fog('#000005', 10, 50)
  }, [scene])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x += 0.001
      const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.025
      meshRef.current.scale.setScalar(s)
    }
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight color="#00f5ff" intensity={2} position={[0, 5, 0]} />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#00f5ff" wireframe opacity={0.6} transparent />
      </mesh>

      <Particles />
    </>
  )
}

function ArrivalFlash() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const id = setTimeout(() => {
      if (el) el.style.opacity = '0'
    }, 50)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#ffffff',
        opacity: 1,
        transition: 'opacity 300ms ease',
        pointerEvents: 'none',
      }}
    />
  )
}

function ChatMessage({ msg, onOpenVisualStory }: { msg: Message; onOpenVisualStory?: (topic: string, frames: number) => void }) {
  const isUser = msg.role === 'user'
  const isVisualStory = msg.type === 'visual_story'
  const isAgent = msg.role === 'agent'

  const handleTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(msg.content)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.95
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '8px',
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '8px 12px',
        borderRadius: '4px',
        background: isUser ? 'rgba(0,245,255,0.1)' : 'transparent',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
        {isAgent && !isVisualStory && (
          <button
            onClick={handleTTS}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '8px',
              padding: '5px 12px',
              background: 'rgba(0,245,255,0.08)',
              border: '1px solid rgba(0,245,255,0.25)',
              borderRadius: '3px',
              color: 'rgba(0,245,255,0.7)',
              fontFamily: 'monospace',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00f5ff'
              e.currentTarget.style.background = 'rgba(0,245,255,0.2)'
              e.currentTarget.style.borderColor = 'rgba(0,245,255,0.6)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(0,245,255,0.7)'
              e.currentTarget.style.background = 'rgba(0,245,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(0,245,255,0.25)'
            }}
            title="Ouvir mensagem"
          >
            🎧 Ouvir
          </button>
        )}
        {isVisualStory && msg.topic && (
          <button
            onClick={() => onOpenVisualStory?.(msg.topic!, msg.frames || 5)}
            style={{
              display: 'block',
              marginTop: '10px',
              padding: '10px 18px',
              background: 'rgba(0,245,255,0.15)',
              border: '1px solid rgba(0,245,255,0.5)',
              borderRadius: '4px',
              color: '#00f5ff',
              fontFamily: 'monospace',
              fontSize: '12px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              transition: 'all 200ms ease',
              boxShadow: '0 0 12px rgba(0,245,255,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,245,255,0.3)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,245,255,0.15)'
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0,245,255,0.2)'
            }}
          >
            🎬 Iniciar Visual Story
          </button>
        )}
      </div>
    </div>
  )
}

export default function LabPage() {
  const router = useRouter()
  const [activeAgent, setActiveAgent] = useState<AgentId>('nexus')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const visualStory = useVisualStory()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: activeAgent,
          message: text,
          history: messages.map(m => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'agent',
        content: data.response || '[...silêncio]',
        type: data.type || undefined,
        topic: data.topic || undefined,
        frames: data.frames || undefined,
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'agent', content: '[conexão perdida]' }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, activeAgent])

  const handleOpenVisualStory = useCallback((topic: string, frames: number) => {
    visualStory.requestStory(topic, frames)
  }, [visualStory])

  const triggerExperiment = useCallback((prompt: string) => {
    setActiveAgent('nexus')
    setMessages([])
    setInput('')
    // Simulate user sending the message
    const userMsg: Message = { role: 'user', content: prompt }
    setMessages([userMsg])
    setIsLoading(true)
    fetch('/api/agents/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 'nexus', message: prompt, history: [] }),
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, {
          role: 'agent',
          content: data.response || '[...silêncio]',
          type: data.type || undefined,
          topic: data.topic || undefined,
          frames: data.frames || undefined,
        }])
      })
      .catch(() => {
        setMessages(prev => [...prev, { role: 'agent', content: '[conexão perdida]' }])
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000000', overflow: 'hidden' }}>
      <ArrivalFlash />

      <Canvas gl={{ antialias: true }} style={{ width: '100%', height: '100%', display: 'block' }}>
        <WorldScene />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00f5ff', opacity: 0.7, margin: 0 }}>
            NEXUS PRIME // MUNDO: LABORATÓRIO
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00f5ff', opacity: 0.7, margin: '4px 0 0' }}>
            AGENTE: {AGENT_NAMES[activeAgent]} // STATUS: ONLINE
          </p>
        </div>

        <button
          onClick={() => { setActiveAgent('nexus'); setMessages([]) }}
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#ffffff',
            opacity: 0.5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            animation: 'labPulse 2s ease-in-out infinite',
            transition: 'opacity 200ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}
        >
          SELECIONE UM EXPERIMENTO
        </button>

        {/* Experiments grid */}
        <div style={{
          position: 'absolute',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 50,
        }}>
          {EXPERIMENTS.map((exp) => (
            <button
              key={exp.id}
              onClick={() => triggerExperiment(exp.prompt)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 16px',
                background: 'rgba(0,245,255,0.06)',
                border: '1px solid rgba(0,245,255,0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                width: '140px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,245,255,0.15)'
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.5)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0,245,255,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,245,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              disabled={isLoading}
            >
              <span style={{ fontSize: '20px' }}>{exp.icon}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#00f5ff', textAlign: 'center' }}>
                {exp.title}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.3 }}>
                {exp.desc}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/universo/nexus')}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#00f5ff',
            opacity: 0.7,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 200ms ease',
            zIndex: 101,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
        >
          ← VOLTAR AO NEXUS
        </button>
      </div>

      {/* Chat Panel */}
      <div style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        width: '360px',
        height: '480px',
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(0,245,255,0.3)',
        borderRadius: '4px',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(0,245,255,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#00f5ff' }}>
              {AGENT_NAMES[activeAgent]}
            </span>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px rgba(74,222,128,0.6)',
              animation: 'chatPulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
              CONSCIÊNCIA ATIVA
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['nexus', 'volt', 'aurora'] as AgentId[]).map((id) => (
              <button
                key={id}
                onClick={() => { setActiveAgent(id); setMessages([]) }}
                style={{
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  border: `1px solid #00f5ff`,
                  borderRadius: '2px',
                  background: activeAgent === id ? '#00f5ff' : 'transparent',
                  color: activeAgent === id ? '#000000' : '#00f5ff',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {AGENT_NAMES[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.length === 0 && !isLoading && (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {AGENT_NAMES[activeAgent]} está aqui.<br />
              Pergunte algo.
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} onOpenVisualStory={handleOpenVisualStory} />
          ))}
          {isLoading && (
            <div style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#00f5ff',
              opacity: 0.5,
              animation: 'chatPulse 1s ease-in-out infinite',
            }}>
              ...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid rgba(0,245,255,0.2)',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Enviar mensagem ao agente..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'monospace',
              fontSize: '12px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderLeft: '1px solid rgba(0,245,255,0.2)',
              color: input.trim() && !isLoading ? '#00f5ff' : 'rgba(0,245,255,0.3)',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              fontFamily: 'monospace',
              fontSize: '12px',
              transition: 'color 150ms ease',
            }}
          >
            {'>'}
          </button>
        </div>
      </div>

      {/* Visual Story Player */}
      {visualStory.isPlaying && visualStory.story && (
        <VisualStoryPlayer
          story={visualStory.story}
          onClose={visualStory.closePlayer}
          onReplay={visualStory.replay}
        />
      )}

      <style jsx>{`
        @keyframes labPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes chatPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  )
}
