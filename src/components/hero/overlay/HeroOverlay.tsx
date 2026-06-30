'use client'

/**
 * HeroOverlay — Conteúdo textual do Hero sobre o Canvas 3D.
 *
 * Centro: Título NEXUS + descrição
 * Agentes ativos: badges laterais com nome + cor
 * CTA: ENTRAR NO UNIVERSO
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HERO_AGENTS } from '../hero-agents'

export default function HeroOverlay() {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center">
      {/* ── Center title ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
        className="text-center px-6"
      >
        <span
          className="block text-[0.6rem] md:text-[0.7rem] tracking-[0.5em] uppercase text-cyan-300/60 mb-4"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Cognitive Operating System
        </span>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.15em] text-white mb-3"
          style={{
            fontFamily: 'var(--font-orbitron)',
            textShadow: '0 0 40px rgba(0,240,255,0.3), 0 0 80px rgba(0,240,255,0.1)',
          }}
        >
          NEXUS
        </h1>
        <p
          className="text-sm md:text-base text-white/50 max-w-md mx-auto leading-relaxed tracking-wide"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Você está entrando em um sistema operacional cognitivo.
          {' '}
          Cada agente possui presença, personalidade e função.
        </p>
      </motion.div>

      {/* ── Agent badges ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="flex gap-4 md:gap-6 mt-8"
      >
        {HERO_AGENTS.map((agent) => (
          <div key={agent.id} className="flex flex-col items-center gap-1">
            <div
              className="w-2 h-2 rounded-full mb-1"
              style={{
                backgroundColor: agent.color,
                boxShadow: `0 0 8px ${agent.color}, 0 0 16px ${agent.color}80`,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              className="text-[0.6rem] md:text-xs tracking-[0.2em] uppercase font-bold"
              style={{
                color: agent.color,
                fontFamily: 'var(--font-space-grotesk)',
                textShadow: `0 0 10px ${agent.color}40`,
              }}
            >
              {agent.name}
            </span>
            <span
              className="hidden md:block text-[0.5rem] tracking-[0.15em] uppercase text-white/30"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              {agent.role}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="mt-10 pointer-events-auto"
      >
        <Link href="/universo/nexus">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 text-sm tracking-[0.25em] uppercase font-bold text-white border border-cyan-400/30 rounded-sm transition-colors duration-300 hover:bg-cyan-400/10"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              boxShadow: '0 0 20px rgba(0,240,255,0.15), inset 0 0 20px rgba(0,240,255,0.05)',
            }}
          >
            Entrar no Universo
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}
