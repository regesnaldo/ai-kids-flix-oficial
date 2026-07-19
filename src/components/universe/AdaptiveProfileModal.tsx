'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── MOCK DATA ─────────────────────────────────────────────────────────────

const MOCK_PROFILE = {
  archetype: 'O Estrategista',
  archetypeDescription: 'Você analisa antes de agir. Cada decisão é um movimento calculado no tabuleiro do conhecimento.',
  dimensions: {
    intellectual: 72,
    emotional: 48,
    moral: 63,
  },
  badges: [
    { id: 'b1', icon: '🧩', label: 'Decifrador', description: 'Resolveu 10 enigmas', unlocked: true },
    { id: 'b2', icon: '⚡', label: 'Faísca', description: 'Primeiro insight do dia', unlocked: true },
    { id: 'b3', icon: '🛡️', label: 'Guardião', description: 'Protegeu um aliado', unlocked: true },
    { id: 'b4', icon: '🔮', label: 'Vidente', description: 'Antecipou um padrão', unlocked: false },
    { id: 'b5', icon: '🌱', label: 'Semeador', description: 'Plantou 3 ideias', unlocked: true },
    { id: 'b6', icon: '🌀', label: 'Caos Controlado', description: 'Sobreviveu ao KAOS', unlocked: false },
    { id: 'b7', icon: '💎', label: 'Mente Cristalina', description: '100% de acerto no LOGOS', unlocked: true },
    { id: 'b8', icon: '🌟', label: 'Nexus', description: 'Conectou 5 agentes', unlocked: false },
  ],
}

const DIMENSION_META = {
  intellectual: { label: 'INTELECTUAL', color: 'neon-cyan', cssColor: '#00f0ff', emoji: '🧠' },
  emotional:    { label: 'EMOCIONAL',   color: 'neon-pink', cssColor: '#ec4899', emoji: '💖' },
  moral:        { label: 'MORAL',       color: 'amber',    cssColor: '#f59e0b', emoji: '⚖️' },
} as const

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────

function DimensionBar({
  id,
  value,
  animating,
}: {
  id: keyof typeof DIMENSION_META
  value: number
  animating: boolean
}) {
  const meta = DIMENSION_META[id]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.emoji}</span>
          <span
            className="font-mono text-xs tracking-[0.15em] uppercase"
            style={{ color: meta.cssColor }}
          >
            {meta.label}
          </span>
        </div>
        <span className="font-mono text-xs text-white/40">{value}%</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${meta.cssColor}66, ${meta.cssColor})`,
            boxShadow: `0 0 8px ${meta.cssColor}44`,
          }}
          initial={{ width: '0%' }}
          animate={animating ? { width: `${value}%` } : { width: '0%' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
        {/* Partículas brilhantes na barra */}
        <motion.div
          className="absolute inset-y-0 w-4 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${meta.cssColor}88)`,
            filter: 'blur(4px)',
          }}
          animate={
            animating
              ? { left: ['0%', `${value}%`] }
              : { left: '0%' }
          }
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

function BadgeCard({
  badge,
  index,
}: {
  badge: { id: string; icon: string; label: string; description: string; unlocked: boolean }
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.08, duration: 0.4 }}
      className={`flex-shrink-0 w-32 p-3 rounded-xl border transition-all duration-300 ${
        badge.unlocked
          ? 'border-white/10 bg-white/05 hover:bg-white/10 hover:border-white/20'
          : 'border-white/05 bg-white/02 opacity-40 grayscale'
      }`}
    >
      <div className="text-2xl text-center mb-2">{badge.icon}</div>
      <p
        className={`font-mono text-[10px] text-center leading-tight ${
          badge.unlocked ? 'text-white/80' : 'text-white/30'
        }`}
      >
        {badge.label}
      </p>
      <p className="font-mono text-[8px] text-center text-white/30 mt-1 leading-tight">
        {badge.description}
      </p>
    </motion.div>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

interface AdaptiveProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdaptiveProfileModal({ isOpen, onClose }: AdaptiveProfileModalProps) {
  const [calibrating, setCalibrating] = useState(true)
  const [animReady, setAnimReady] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)
  const badgesContainerRef = useRef<HTMLDivElement | null>(null)

  // Simula calibração ao abrir
  useEffect(() => {
    if (isOpen) {
      setCalibrating(true)
      setAnimReady(false)
      const t1 = setTimeout(() => setCalibrating(false), 1800)
      const t2 = setTimeout(() => setAnimReady(true), 200)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isOpen])

  // Fecha com Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const profile = MOCK_PROFILE
  const dims = profile.dimensions
  const isFormation = dims.intellectual <= 0.5 && dims.emotional <= 0.5 && dims.moral <= 0.5

  const scrollBadges = useCallback((dir: 'left' | 'right') => {
    const el = badgesContainerRef.current
    if (el) {
      const amount = dir === 'left' ? -160 : 160
      el.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="adaptive-profile-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          role="dialog"
          aria-modal="true"
          aria-label="Diário de Bordo — Perfil Adaptativo"
        >
          <motion.div
            key="adaptive-profile-modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow decorativo */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ─── HEADER ────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-white/80 tracking-wider">
                📖 Diário de Bordo
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200 font-mono text-sm"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* ─── CALIBRANDO ─────────────────────────────── */}
            {calibrating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-t-2 border-neon-cyan animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-neon-cyan/10 blur-sm" />
                </div>
                <p className="font-mono text-xs text-neon-cyan/60 tracking-[0.2em] uppercase animate-pulse">
                  Calibrando Sensores...
                </p>
              </motion.div>
            )}

            {/* ─── CONTEÚDO ───────────────────────────────── */}
            {!calibrating && (
              <>
                {/* Hero — Arquétipo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-center mb-8 pb-6 border-b border-white/05"
                >
                  <p className="font-mono text-[10px] text-neon-cyan/50 tracking-[0.25em] uppercase mb-3">
                    Arquétipo Atual
                  </p>
                  <h1
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent mb-2"
                    style={{ textShadow: '0 0 30px rgba(0,240,255,0.15)' }}
                  >
                    {isFormation ? '⚡ Perfil em Formação' : profile.archetype}
                  </h1>
                  <p className="font-serif text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
                    {isFormation
                      ? 'Sua mente ainda está sendo mapeada. Continue explorando para revelar seu arquétipo.'
                      : profile.archetypeDescription}
                  </p>
                </motion.div>

                {/* Dimensões */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-5 mb-8"
                >
                  <p className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase mb-4">
                    {/* 3 Dimensões da Mente */}
                  </p>
                  {(Object.keys(dims) as Array<keyof typeof dims>).map((key) => (
                    <DimensionBar
                      key={key}
                      id={key}
                      value={dims[key]}
                      animating={animReady}
                    />
                  ))}
                </motion.div>

                {/* Badges / Conquistas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-[10px] text-white/30 tracking-[0.2em] uppercase">
                      {/* Conquistas */}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => scrollBadges('left')}
                        className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-all text-xs"
                        aria-label="Anterior"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => scrollBadges('right')}
                        className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/30 hover:text-white hover:border-white/30 transition-all text-xs"
                        aria-label="Próximo"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <div
                    ref={(el) => { badgesContainerRef.current = el }}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {profile.badges.map((badge, i) => (
                      <BadgeCard key={badge.id} badge={badge} index={i} />
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 pt-4 border-t border-white/05 text-center"
                >
                  <p className="font-mono text-[9px] text-white/20 tracking-[0.15em]">
                    PERFIL ADAPTATIVO — DADOS MOCKADOS
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
