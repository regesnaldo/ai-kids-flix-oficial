'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const KNOWN_PLANETS = [
  'nexus', 'volt', 'aurora', 'ethos', 'kaos', 'cipher',
  'lyra', 'axiom', 'stratos', 'terra', 'prism', 'janus',
]

const PLANET_NAMES: Record<string, string> = {
  nexus: 'NEXUS', volt: 'VOLT', aurora: 'AURORA', ethos: 'ETHOS',
  kaos: 'KAOS', cipher: 'CIPHER', lyra: 'LYRA', axiom: 'AXIOM',
  stratos: 'STRATOS', terra: 'TERRA', prism: 'PRISM', janus: 'JANUS',
  logos: 'LOGOS',
}

export default function UniverseFallbackPage() {
  const params = useParams()
  const planet = (params?.planet as string) || ''
  const planetName = PLANET_NAMES[planet] || planet.toUpperCase()
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // If it's a known planet, redirect to its dedicated page
  useEffect(() => {
    if (KNOWN_PLANETS.includes(planet)) {
      window.location.href = `/universo/${planet}`
    }
  }, [planet])

  // LOGOS — render the oracle overlay
  if (planet === 'logos') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-t-2 border-amber-400 animate-spin" />
          </div>
          <p className="font-mono text-xs text-amber-400/60 tracking-[0.2em] uppercase animate-pulse">
            Redirecionando para o LOGOS...
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-cyber-black flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Nave estelar perdida */}
      <motion.div
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 12 }}
        className="text-6xl mb-6"
      >
        🛸
      </motion.div>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
        Universo Não Encontrado
      </h1>

      <p className="font-mono text-sm text-neon-cyan/60 mb-2">
        O planeta <span className="text-neon-cyan font-bold">{planetName}</span> não está no radar.
      </p>

      <p className="font-mono text-xs text-white/30 max-w-md leading-relaxed mb-8">
        Suas coordenadas não correspondem a nenhum universo conhecido no MENTE.AI.
        O sistema de navegação estelar não conseguiu traçar uma rota.
      </p>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Link
              href="/home"
              className="font-mono text-xs text-neon-cyan tracking-[0.15em] uppercase border border-neon-cyan/30 px-6 py-3 rounded hover:bg-neon-cyan/5 hover:border-neon-cyan/60 transition-all duration-300"
            >
              ↑ Voltar à Central
            </Link>
            <Link
              href="/universo"
              className="font-mono text-[10px] text-white/30 hover:text-white/50 transition-colors tracking-[0.1em]"
            >
              MAPA GALÁCTICO
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-mono text-[8px] text-white/10 mt-12 tracking-[0.2em]">
        ERRO 404 — COORDENADA INVÁLIDA
      </p>
    </motion.div>
  )
}
