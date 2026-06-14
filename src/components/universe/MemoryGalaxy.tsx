'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const AGENTS = [
  { id: 'nexus', name: 'NEXUS', color: '#00f0ff', size: 56, status: 'active', x: 50, y: 50 },
  { id: 'volt', name: 'VOLT', color: '#f97316', size: 36, status: 'active', x: 30, y: 25 },
  { id: 'aurora', name: 'AURORA', color: '#a855f7', size: 36, status: 'active', x: 70, y: 22 },
  { id: 'kaos', name: 'KAOS', color: '#ef4444', size: 32, status: 'locked', x: 82, y: 42 },
  { id: 'cipher', name: 'CIPHER', color: '#10b981', size: 32, status: 'locked', x: 75, y: 72 },
  { id: 'ethos', name: 'ETHOS', color: '#3b82f6', size: 32, status: 'locked', x: 50, y: 82 },
  { id: 'janus', name: 'JANUS', color: '#8b5cf6', size: 30, status: 'locked', x: 25, y: 75 },
  { id: 'lyra', name: 'LYRA', color: '#ec4899', size: 30, status: 'locked', x: 15, y: 50 },
  { id: 'prism', name: 'PRISM', color: '#fbbf24', size: 30, status: 'locked', x: 22, y: 28 },
  { id: 'stratos', name: 'STRATOS', color: '#06b6d4', size: 28, status: 'locked', x: 60, y: 15 },
  { id: 'terra', name: 'TERRA', color: '#84cc16', size: 28, status: 'locked', x: 85, y: 60 },
  { id: 'axiom', name: 'AXIOM', color: '#e2e8f0', size: 28, status: 'locked', x: 38, y: 88 },
]

const LINKS = [
  ['nexus','volt'], ['nexus','aurora'], ['nexus','kaos'], ['nexus','cipher'], ['nexus','ethos'],
  ['volt','aurora'], ['volt','stratos'], ['aurora','lyra'], ['aurora','prism'],
  ['kaos','cipher'], ['kaos','janus'], ['ethos','janus'], ['ethos','terra'],
  ['janus','prism'], ['lyra','terra'], ['stratos','axiom'], ['cipher','axiom'],
]

const STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}))

export default function MemoryGalaxy() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const activeCount = AGENTS.filter(a => a.status === 'active').length
  const activeLinks = LINKS.filter(([s,t]) =>
    AGENTS.find(a=>a.id===s)?.status==='active' &&
    AGENTS.find(a=>a.id===t)?.status==='active'
  ).length

  function handleClick(agent: typeof AGENTS[0]) {
    if (agent.status === 'active') {
      router.push(`/universo/${agent.id}`)
    } else {
      setToast(true)
      setTimeout(() => setToast(false), 2500)
    }
  }

  if (!mounted) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #0a0a1a 100%)', overflow: 'hidden' }}>
      
      {/* Stars */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {STARS.map(star => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            opacity={0.4}
            style={{ animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite alternate` }}
          />
        ))}

        {/* Connection lines */}
        {LINKS.map(([sourceId, targetId], i) => {
          const source = AGENTS.find(a => a.id === sourceId)!
          const target = AGENTS.find(a => a.id === targetId)!
          const isActive = source.status === 'active' && target.status === 'active'
          return (
            <line
              key={i}
              x1={`${source.x}%`}
              y1={`${source.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke={isActive ? source.color : 'rgba(255,255,255,0.06)'}
              strokeWidth={isActive ? 1.5 : 0.8}
              opacity={isActive ? 0.35 : 1}
            />
          )
        })}
      </svg>

      {/* Agent nodes */}
      {AGENTS.map(agent => {
        const isHovered = hovered === agent.id
        const isActive = agent.status === 'active'
        const scale = isHovered ? 1.25 : 1
        return (
          <div
            key={agent.id}
            onClick={() => handleClick(agent)}
            onMouseEnter={() => setHovered(agent.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${agent.x}%`,
              top: `${agent.y}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              zIndex: isHovered ? 10 : 1,
            }}
          >
            {/* Planet sphere */}
            <div style={{
              width: agent.size,
              height: agent.size,
              borderRadius: '50%',
              background: isActive
                ? `radial-gradient(circle at 35% 35%, white, ${agent.color})`
                : `radial-gradient(circle at 35% 35%, ${agent.color}88, ${agent.color}33)`,
              boxShadow: isActive
                ? `0 0 ${agent.size}px ${agent.color}, 0 0 ${agent.size * 2}px ${agent.color}44`
                : `0 0 8px ${agent.color}44`,
              opacity: isActive ? 1 : 0.45,
              animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none',
            }} />

            {/* Lock icon for locked agents */}
            {!isActive && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 10, opacity: 0.6 }}>🔒</div>
            )}

            {/* Label */}
            <span style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: isActive ? agent.color : 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              textShadow: isActive ? `0 0 8px ${agent.color}` : 'none',
            }}>
              {agent.name}
            </span>

            {/* Hover tooltip */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                top: -36,
                background: 'rgba(10,10,26,0.95)',
                border: `1px solid ${agent.color}44`,
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 11,
                color: agent.color,
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>
                {agent.name} — {isActive ? 'ATIVO' : 'BLOQUEADO'}
              </div>
            )}
          </div>
        )
      })}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8, padding: '10px 24px', color: '#ef4444',
          fontFamily: 'monospace', fontSize: 13, zIndex: 100,
        }}>
          🔒 Agente bloqueado. Continue sua jornada.
        </div>
      )}

      {/* HUD */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(10,10,26,0.8)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '8px 24px', fontFamily: 'monospace',
        fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em',
        whiteSpace: 'nowrap', zIndex: 50,
      }}>
        TERRITÓRIOS: {activeCount}/12 | SINAIS ATIVOS: {activeLinks} | CAMADA: SUPERFÍCIE
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px currentColor; }
          50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
        }
        @keyframes twinkle {
          from { opacity: 0.2; }
          to { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
