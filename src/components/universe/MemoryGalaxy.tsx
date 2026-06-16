'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getAgentColor } from '@/canon/agents/presence'
import { playAgentTone, playUnlockTone, playBlockedTone } from '@/lib/audio/agentTones'

const AGENTS = [
  { id: 'nexus', name: 'NEXUS', color: getAgentColor('nexus'), size: 56, status: 'active', x: 50, y: 50, floatX: 0, floatY: 0 },
  { id: 'volt', name: 'VOLT', color: getAgentColor('volt'), size: 36, status: 'active', x: 30, y: 25, floatX: 12, floatY: 8 },
  { id: 'aurora', name: 'AURORA', color: getAgentColor('aurora'), size: 36, status: 'active', x: 70, y: 22, floatX: -10, floatY: 14 },
  { id: 'kaos', name: 'KAOS', color: getAgentColor('kaos'), size: 32, status: 'locked', x: 82, y: 42, floatX: 8, floatY: -12 },
  { id: 'cipher', name: 'CIPHER', color: getAgentColor('cipher'), size: 32, status: 'locked', x: 75, y: 72, floatX: -14, floatY: 6 },
  { id: 'ethos', name: 'ETHOS', color: getAgentColor('ethos'), size: 32, status: 'locked', x: 50, y: 82, floatX: 10, floatY: -10 },
  { id: 'janus', name: 'JANUS', color: getAgentColor('janus'), size: 30, status: 'locked', x: 25, y: 75, floatX: -8, floatY: 12 },
  { id: 'lyra', name: 'LYRA', color: getAgentColor('lyra'), size: 30, status: 'locked', x: 15, y: 50, floatX: 14, floatY: -6 },
  { id: 'prism', name: 'PRISM', color: getAgentColor('prism'), size: 30, status: 'locked', x: 22, y: 28, floatX: -12, floatY: -10 },
  { id: 'stratos', name: 'STRATOS', color: getAgentColor('stratos'), size: 28, status: 'locked', x: 60, y: 15, floatX: 6, floatY: 14 },
  { id: 'terra', name: 'TERRA', color: getAgentColor('terra'), size: 28, status: 'locked', x: 85, y: 60, floatX: -10, floatY: -8 },
  { id: 'axiom', name: 'AXIOM', color: getAgentColor('axiom'), size: 28, status: 'locked', x: 38, y: 88, floatX: 12, floatY: 10 },
]

const LINKS = [
  ['nexus','volt'], ['nexus','aurora'], ['nexus','kaos'], ['nexus','cipher'], ['nexus','ethos'],
  ['volt','aurora'], ['volt','stratos'], ['aurora','lyra'], ['aurora','prism'],
  ['kaos','cipher'], ['kaos','janus'], ['ethos','janus'], ['ethos','terra'],
  ['janus','prism'], ['lyra','terra'], ['stratos','axiom'], ['cipher','axiom'],
]

const STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: (i * 73.13) % 100,
  y: (i * 47.57) % 100,
  size: (i % 3) * 0.5 + 0.5,
}))

type Agent = typeof AGENTS[0]

export default function MemoryGalaxy() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)
  const [toast, setToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const activeCount = AGENTS.filter(a => a.status === 'active').length
  const activeLinks = LINKS.filter(([s, t]) =>
    AGENTS.find(a => a.id === s)?.status === 'active' &&
    AGENTS.find(a => a.id === t)?.status === 'active'
  ).length

  function handleClick(agent: Agent) {
    if (agent.status === 'active') {
      playUnlockTone(agent.id)
      router.push('/universo/' + agent.id)
    } else {
      playBlockedTone()
      setToast(true)
      setTimeout(() => setToast(false), 2500)
    }
  }

  if (!mounted) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #0a0a1a 100%)', overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {STARS.map(star => (
          <circle key={star.id} cx={star.x + '%'} cy={star.y + '%'} r={star.size} fill="white" opacity={0.4} />
        ))}
        {LINKS.map(([sourceId, targetId], i) => {
          const source = AGENTS.find(a => a.id === sourceId)!
          const target = AGENTS.find(a => a.id === targetId)!
          const isActive = source.status === 'active' && target.status === 'active'
          return (
            <line key={i}
              x1={source.x + '%'} y1={source.y + '%'}
              x2={target.x + '%'} y2={target.y + '%'}
              stroke={isActive ? source.color : 'rgba(255,255,255,0.06)'}
              strokeWidth={isActive ? 1.5 : 0.8}
              opacity={isActive ? 0.35 : 1}
            />
          )
        })}
      </svg>

      {AGENTS.map(agent => {
        const isHovered = hovered === agent.id
        const isActive = agent.status === 'active'
        return (
          <div key={agent.id}
            onClick={() => handleClick(agent)}
            onMouseEnter={() => {
              setHovered(agent.id)
              playAgentTone(agent.id)
            }}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: agent.x + '%',
              top: agent.y + '%',
              transform: 'translate(-50%, -50%) scale(' + (isHovered ? 1.25 : 1) + ')',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              zIndex: isHovered ? 10 : 1,
              animation: `float-${agent.id} ${6 + (AGENTS.indexOf(agent) % 4)}s ease-in-out infinite alternate`,
            }}
          >
            <div style={{
              width: agent.size,
              height: agent.size,
              borderRadius: '50%',
              background: isActive
                ? 'radial-gradient(circle at 35% 35%, white, ' + agent.color + ')'
                : 'radial-gradient(circle at 35% 35%, ' + agent.color + '88, ' + agent.color + '33)',
              boxShadow: isActive
                ? '0 0 ' + agent.size + 'px ' + agent.color + ', 0 0 ' + (agent.size*2) + 'px ' + agent.color + '44'
                : '0 0 8px ' + agent.color + '44',
              opacity: isActive ? 1 : 0.45,
            }} />
            {!isActive && (
              <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 10 }}>🔒</div>
            )}
            <span style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: isActive ? agent.color : 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
              textShadow: isActive ? '0 0 8px ' + agent.color : 'none',
            }}>
              {agent.name}
            </span>
            {isHovered && (
              <div style={{
                position: 'absolute', top: -36,
                background: 'rgba(10,10,26,0.95)',
                border: '1px solid ' + agent.color + '44',
                borderRadius: 6, padding: '4px 10px',
                fontSize: 11, color: agent.color,
                fontFamily: 'monospace', whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}>
                {agent.name} — {isActive ? 'ATIVO' : 'BLOQUEADO'}
              </div>
            )}
          </div>
        )
      })}

      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 8, padding: '10px 24px', color: '#ef4444',
          fontFamily: 'monospace', fontSize: 13, zIndex: 100,
        }}>
          Agente bloqueado. Continue sua jornada.
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(10,10,26,0.8)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '8px 24px', fontFamily: 'monospace',
        fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em',
        whiteSpace: 'nowrap', zIndex: 50,
      }}>
        {'TERRITORIOS: ' + activeCount + '/12 | SINAIS ATIVOS: ' + activeLinks + ' | CAMADA: SUPERFICIE'}
      </div>

      <style>{`
@keyframes float-nexus  { from { translate: 0px 0px; }   to { translate: 0px 0px; } }
@keyframes float-volt   { from { translate: 0px 0px; }   to { translate: 12px 8px; } }
@keyframes float-aurora { from { translate: 0px 0px; }   to { translate: -10px 14px; } }
@keyframes float-kaos   { from { translate: 0px 0px; }   to { translate: 8px -12px; } }
@keyframes float-cipher { from { translate: 0px 0px; }   to { translate: -14px 6px; } }
@keyframes float-ethos  { from { translate: 0px 0px; }   to { translate: 10px -10px; } }
@keyframes float-janus  { from { translate: 0px 0px; }   to { translate: -8px 12px; } }
@keyframes float-lyra   { from { translate: 0px 0px; }   to { translate: 14px -6px; } }
@keyframes float-prism  { from { translate: 0px 0px; }   to { translate: -12px -10px; } }
@keyframes float-stratos{ from { translate: 0px 0px; }   to { translate: 6px 14px; } }
@keyframes float-terra  { from { translate: 0px 0px; }   to { translate: -10px -8px; } }
@keyframes float-axiom  { from { translate: 0px 0px; }   to { translate: 12px 10px; } }
      `}</style>
    </div>
  )
}
