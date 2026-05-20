'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play, RotateCcw, ImageOff } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface StoryScene {
  id: number
  scene_title: string
  visual_description: string
  narration: string
  mood: string
  imageUrl: string
}

export interface VisualStory {
  title: string
  language: string
  total_frames: number
  scenes: StoryScene[]
}

interface VisualStoryPlayerProps {
  story: VisualStory
  onClose: () => void
  onReplay: () => void
}

// ─── Mood colors ────────────────────────────────────────────────────────────

const MOOD_COLORS: Record<string, string> = {
  wonder: 'text-neon-cyan border-neon-cyan/50',
  tension: 'text-red-400 border-red-500/50',
  calm: 'text-neon-green border-green-500/50',
  power: 'text-neon-orange border-orange-500/50',
  mystery: 'text-neon-purple border-purple-500/50',
  hope: 'text-yellow-400 border-yellow-500/50',
  awe: 'text-neon-pink border-pink-500/50',
  curiosity: 'text-neon-blue border-blue-500/50',
}

const MOOD_BG: Record<string, string> = {
  wonder: 'from-cyan-950/60 to-transparent',
  tension: 'from-red-950/60 to-transparent',
  calm: 'from-green-950/60 to-transparent',
  power: 'from-orange-950/60 to-transparent',
  mystery: 'from-purple-950/60 to-transparent',
  hope: 'from-yellow-950/60 to-transparent',
  awe: 'from-pink-950/60 to-transparent',
  curiosity: 'from-blue-950/60 to-transparent',
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ImageWithFallback({ src, alt, onLoad }: { src: string; alt: string; onLoad?: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-cyber-panel border border-cyber-border">
      {!loaded && !errored && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
        </div>
      )}
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
          <ImageOff className="w-10 h-10" />
          <span className="text-xs font-mono">imagem em criação...</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => { setLoaded(true); onLoad?.() }}
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === current
              ? 'w-8 bg-neon-cyan shadow-glow-cyan'
              : i < current
                ? 'w-3 bg-neon-cyan/50'
                : 'w-3 bg-cyber-border'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function VisualStoryPlayer({ story, onClose, onReplay }: VisualStoryPlayerProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0) // -1 = back, 1 = forward
  const [imageReady, setImageReady] = useState(false)

  const scene = story.scenes[current]
  const isFirst = current === 0
  const isLast = current === story.scenes.length - 1
  const moodColor = MOOD_COLORS[scene?.mood] || 'text-neon-cyan border-neon-cyan/50'
  const moodBg = MOOD_BG[scene?.mood] || 'from-cyan-950/60 to-transparent'

  const goNext = useCallback(() => {
    if (isLast) return
    setDirection(1)
    setImageReady(false)
    setCurrent(prev => prev + 1)
  }, [isLast])

  const goPrev = useCallback(() => {
    if (isFirst) return
    setDirection(-1)
    setImageReady(false)
    setCurrent(prev => prev - 1)
  }, [isFirst])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black/90 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-3xl bg-gradient-to-b from-cyber-dark to-cyber-black border border-cyber-border rounded-modal overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel/50">
          <div>
            <h2 className="text-lg font-display text-white tracking-wide">
              {story.title}
            </h2>
            <span className={`text-xs font-mono ${moodColor.split(' ')[0]}`}>
              frame {current + 1} de {story.total_frames} · {scene?.mood}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onReplay}
              className="p-2 rounded-lg hover:bg-cyber-surface transition-colors text-gray-400 hover:text-neon-cyan"
              title="Recomeçar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cyber-surface transition-colors text-gray-400 hover:text-neon-pink"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Progress dots */}
          <ProgressDots total={story.scenes.length} current={current} />

          {/* Image area */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`rounded-lg overflow-hidden bg-gradient-to-b ${moodBg}`}
            >
              <ImageWithFallback
                src={scene?.imageUrl}
                alt={scene?.scene_title}
                onLoad={() => setImageReady(true)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Scene title */}
          <AnimatePresence mode="wait">
            <motion.h3
              key={`title-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-display text-white text-center"
            >
              {scene?.scene_title}
            </motion.h3>
          </AnimatePresence>

          {/* Narration */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`narration-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-sm text-gray-300 leading-relaxed font-mono text-center max-w-lg mx-auto"
            >
              {scene?.narration}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-border bg-cyber-panel/30">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-mono text-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              text-gray-400 hover:text-neon-cyan hover:bg-cyber-surface"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {isLast ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReplay}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40
                text-neon-cyan font-mono text-sm transition-all hover:bg-neon-cyan/30 shadow-glow-cyan"
            >
              <Play className="w-4 h-4" />
              Rever jornada
            </motion.button>
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-mono text-sm
                text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-glow-cyan"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
