'use client'

/**
 * HeroHUD — HUD transparente inferior.
 *
 * COGNITIVE RUNTIME
 * STATUS: ACTIVE
 * UPTIME: contador em tempo real
 * ACTIVE AGENTS: 3/12
 * SYSTEM LOAD: % que oscila
 * LATENCY: ms que oscila
 * RUNTIME HEALTH: OPTIMAL
 *
 * Todos os dados parecem vir do sistema em tempo real.
 */

import { useState, useEffect } from 'react'
import { SYSTEM_ONLINE_COUNT, SYSTEM_TOTAL_AGENTS } from '@/canon/agents/presence'

interface HUDMetric {
  label: string
  getValue: () => string
  color: string
}

export default function HeroHUD() {
  const [uptime, setUptime] = useState('00:00:00')
  const [systemLoad, setSystemLoad] = useState('12%')
  const [latency, setLatency] = useState('24ms')
  const [health, setHealth] = useState('OPTIMAL')

  useEffect(() => {
    const startTime = Date.now()

    const tick = () => {
      // Uptime
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
      const s = String(elapsed % 60).padStart(2, '0')
      setUptime(`${h}:${m}:${s}`)

      // System load — oscila entre 8% e 23%
      const load = 12 + Math.sin(Date.now() / 3000) * 5 + Math.random() * 3
      setSystemLoad(`${load.toFixed(0)}%`)

      // Latency — oscila entre 18 e 32ms
      const lat = 24 + Math.sin(Date.now() / 2000) * 4 + Math.random() * 2
      setLatency(`${lat.toFixed(0)}ms`)

      // Health — sempre OPTIMAL (ou DEGRADED raramente)
      setHealth(Math.random() > 0.97 ? 'DEGRADED' : 'OPTIMAL')
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const metrics: HUDMetric[] = [
    { label: 'STATUS', getValue: () => 'ACTIVE', color: '#00f0ff' },
    { label: 'UPTIME', getValue: () => uptime, color: '#ffffff' },
    { label: 'ACTIVE AGENTS', getValue: () => `${SYSTEM_ONLINE_COUNT}/${SYSTEM_TOTAL_AGENTS}`, color: '#FFD700' },
    { label: 'SYSTEM LOAD', getValue: () => systemLoad, color: '#00f0ff' },
    { label: 'LATENCY', getValue: () => latency, color: '#ffffff' },
    { label: 'RUNTIME HEALTH', getValue: () => health, color: health === 'OPTIMAL' ? '#00f0ff' : '#f59e0b' },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
      style={{
        background: 'linear-gradient(to top, rgba(5,5,7,0.85) 0%, transparent 100%)',
      }}
    >
      {/* ── Header label ── */}
      <div className="px-6 md:px-12 pt-3 pb-1">
        <span
          className="text-[0.55rem] md:text-[0.6rem] tracking-[0.4em] uppercase text-cyan-300/50"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Cognitive Runtime
        </span>
      </div>

      {/* ── Metrics grid ── */}
      <div className="px-6 md:px-12 pb-5 flex flex-wrap gap-4 md:gap-8">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-0.5">
            <span
              className="text-[0.5rem] md:text-[0.55rem] tracking-[0.3em] uppercase text-white/30"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {m.label}
            </span>
            <span
              className="text-xs md:text-sm font-bold tracking-wider"
              style={{
                color: m.color,
                fontFamily: 'var(--font-space-grotesk)',
                textShadow: `0 0 10px ${m.color}40`,
              }}
            >
              {m.getValue()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
