'use client'

import { useMemo } from 'react'
import Link from 'next/link'

const AGENTS = [
  { id: 'nexus', name: 'NEXUS', faction: 'INTELIGÊNCIA', color: '#00FFFF' },
  { id: 'volt', name: 'VOLT', faction: 'ENERGIA', color: '#FFD700' },
  { id: 'aurora', name: 'AURORA', faction: 'INOVAÇÃO', color: '#FF69B4' },
  { id: 'ethos', name: 'ETHOS', faction: 'ÉTICA', color: '#00FF88' },
  { id: 'kaos', name: 'KAOS', faction: 'CAOS', color: '#FF4500' },
  { id: 'cipher', name: 'CIPHER', faction: 'CRIPTOGRAFIA', color: '#9400D3' },
  { id: 'lyra', name: 'LYRA', faction: 'CRIATIVIDADE', color: '#FF1493' },
  { id: 'axiom', name: 'AXIOM', faction: 'ANÁLISE', color: '#00BFFF' },
  { id: 'stratos', name: 'STRATOS', faction: 'ESTRATÉGIA', color: '#7CFC00' },
  { id: 'terra', name: 'TERRA', faction: 'EMPATIA', color: '#8B4513' },
  { id: 'prism', name: 'PRISM', faction: 'FILOSOFIA', color: '#EE82EE' },
  { id: 'janus', name: 'JANUS', faction: 'CONEXÃO', color: '#FFA500' },
]

interface JourneyMapProps {
  completedCount: number
  emotionalScore?: number
  intellectualScore?: number
  moralScore?: number
}

export default function JourneyMap({
  completedCount = 0,
  emotionalScore = 0,
  intellectualScore = 0,
  moralScore = 0,
}: JourneyMapProps) {
  const nextAgent = AGENTS[completedCount] ?? AGENTS[0]
  const progressPct = Math.round((completedCount / 12) * 100)

  const dimensions = useMemo(() => [
    { label: 'EMOCIONAL', value: emotionalScore, color: '#FF69B4' },
    { label: 'INTELECTUAL', value: intellectualScore, color: '#00BFFF' },
    { label: 'MORAL', value: moralScore, color: '#00FF88' },
  ], [emotionalScore, intellectualScore, moralScore])

  return (
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(0,255,255,0.15)',
      borderRadius: '4px',
      padding: '24px',
      marginBottom: '2rem',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00FF88', margin: '0 0 0.25rem', letterSpacing: '0.1em' }}>
          {/* TRILHA PERCORRIDA */}
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#0088FF', margin: 0 }}>
          {completedCount}/12 UNIVERSOS VISITADOS — {progressPct}% DA JORNADA
        </p>
      </div>

      {/* Planet Trail */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
        {AGENTS.map((agent, i) => {
          const visited = i < completedCount
          const isNext = i === completedCount
          return (
            <Link key={agent.id} href={`/universo/${agent.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                border: `2px solid ${visited ? agent.color : isNext ? 'rgba(0,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                backgroundColor: visited ? `${agent.color}22` : isNext ? 'rgba(0,255,255,0.05)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: visited ? `0 0 8px ${agent.color}44` : isNext ? '0 0 12px rgba(0,255,255,0.3)' : 'none',
              }}
                title={agent.name}
              >
                <span style={{
                  fontFamily: 'monospace', fontSize: '8px',
                  color: visited ? agent.color : isNext ? '#00FFFF' : 'rgba(255,255,255,0.2)',
                  letterSpacing: '0',
                }}>
                  {agent.name.slice(0, 2)}
                </span>
                {visited && (
                  <div style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: '#00FF88',
                    border: '1px solid #000',
                  }} />
                )}
                {isNext && (
                  <div style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    backgroundColor: '#00FFFF',
                    border: '1px solid #000',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Next Stop */}
      <div style={{
        padding: '12px 16px',
        border: `1px solid ${nextAgent.color}44`,
        borderRadius: '4px',
        backgroundColor: `${nextAgent.color}08`,
        marginBottom: '1.5rem',
      }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#00FF88', margin: '0 0 0.25rem' }}>
          PRÓXIMA PARADA RECOMENDADA
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: '13px', color: nextAgent.color, margin: '0 0 0.5rem', letterSpacing: '0.1em' }}>
          {nextAgent.name} — {nextAgent.faction}
        </p>
        <Link href={`/universo/${nextAgent.id}`} style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'transparent',
            border: `1px solid ${nextAgent.color}66`,
            color: nextAgent.color,
            fontFamily: 'monospace', fontSize: '10px',
            padding: '6px 16px', cursor: 'pointer',
            letterSpacing: '0.1em',
            transition: 'all 0.2s ease',
          }}>
            ENTRAR →
          </button>
        </Link>
      </div>

      {/* 3 Dimensions */}
      <div>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#00FF88', margin: '0 0 0.75rem', letterSpacing: '0.1em' }}>
          {/* PERFIL COGNITIVO INVISÍVEL */}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {dimensions.map(dim => (
            <div key={dim.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: dim.color, letterSpacing: '0.05em' }}>
                  {dim.label}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
                  {dim.value}%
                </span>
              </div>
              <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '1px' }}>
                <div style={{
                  width: `${dim.value}%`, height: '100%',
                  backgroundColor: dim.color,
                  borderRadius: '1px',
                  boxShadow: `0 0 4px ${dim.color}88`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
