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

const MOOD_GRADIENT: Record<string, string> = {
  wonder: 'from-cyan-900 via-cyan-800 to-indigo-900',
  tension: 'from-red-900 via-orange-800 to-yellow-900',
  calm: 'from-green-900 via-teal-800 to-emerald-900',
  power: 'from-orange-900 via-amber-800 to-yellow-900',
  mystery: 'from-purple-900 via-violet-800 to-fuchsia-900',
  hope: 'from-yellow-900 via-amber-800 to-orange-900',
  awe: 'from-pink-900 via-rose-800 to-fuchsia-900',
  curiosity: 'from-blue-900 via-cyan-800 to-sky-900',
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ImageWithFallback({
  src, alt, sceneTitle, mood, onLoad,
}: {
  src: string; alt: string; sceneTitle?: string; mood?: string; onLoad?: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const gradient = MOOD_GRADIENT[mood || 'wonder'] || MOOD_GRADIENT.wonder

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-cyber-panel border border-cyber-border" style={{ height: '450px' }}>
      {!loaded && !errored && (
        <div className="absolute inset-0 flex flex-col gap-3 p-4">
          <div className="h-4 bg-cyber-border/50 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-cyber-border/50 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-cyber-border/50 rounded animate-pulse w-5/6" />
          <div className="flex-1" />
          <div className="h-40 bg-cyber-surface/50 rounded animate-pulse" />
        </div>
      )}
      {errored ? (
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${gradient}`}>
          <ImageOff className="w-12 h-12 text-white/40" />
          {sceneTitle && (
            <span className="text-white/80 font-display text-lg text-center px-6">{sceneTitle}</span>
          )}
          <span className="text-white/40 text-xs font-mono">ilustração em criação...</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => { setLoaded(true); onLoad?.() }}
          onError={() => setErrored(true)}
          style={{ width: '100%', height: '450px', objectFit: 'cover' }}
          className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
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
  const [direction, setDirection] = useState(0)
  const [imageReady, setImageReady] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [prefetchProgress, setPrefetchProgress] = useState(0)

  // Pre-fetch all images on mount
  useEffect(() => {
    const controllers: AbortController[] = []
    const loaded = new Set<number>()
    setLoadedImages(new Set())
    setPrefetchProgress(0)

    const prefetchImage = (url: string, index: number): Promise<void> => {
      return new Promise((resolve) => {
        const controller = new AbortController()
        controllers.push(controller)
        const timer = setTimeout(() => { controller.abort(); resolve() }, 20000)

        const img = new Image()
        img.onload = () => {
          clearTimeout(timer)
          loaded.add(index)
          setLoadedImages(new Set(loaded))
          setPrefetchProgress(prev => prev + 1)
          resolve()
        }
        img.onerror = () => {
          clearTimeout(timer)
          setPrefetchProgress(prev => prev + 1)
          resolve()
        }
        img.src = url
      })
    }

    Promise.all(story.scenes.map((s, i) => prefetchImage(s.imageUrl, i)))
      .finally(() => setPrefetchProgress(story.scenes.length))

    return () => controllers.forEach(c => c.abort())
  }, [story])

  const scene = story.scenes[current]
  const isFirst = current === 0
  const isLast = current === story.scenes.length - 1
  const moodColor = MOOD_COLORS[scene?.mood] || 'text-neon-cyan border-neon-cyan/50'

  const handleReplay = useCallback(() => {
    setCurrent(0)
    setImageReady(false)
    onReplay()
  }, [onReplay])

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
      className="fixed inset-0 flex items-center justify-center bg-cyber-black/90 backdrop-blur-sm p-4"
      style={{ zIndex: 100 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-gradient-to-b from-cyber-dark to-cyber-black border border-cyber-border rounded-modal overflow-hidden shadow-2xl w-full"
        style={{ maxWidth: '800px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-panel/50">
          <div>
            <h2 className="text-lg font-display text-white tracking-wide">{story.title}</h2>
            <span className={`text-xs font-mono ${moodColor.split(' ')[0]}`}>
              Cena {current + 1} de {story.total_frames} · {scene?.mood}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReplay} className="p-2 rounded-lg hover:bg-cyber-surface transition-colors text-gray-400 hover:text-neon-cyan" title="Recomeçar">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-cyber-surface transition-colors text-gray-400 hover:text-neon-pink" title="Fechar">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-2 bg-cyber-panel/30">
          <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-cyan rounded-full transition-all duration-500"
              style={{ width: `${((prefetchProgress) / story.scenes.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-xs font-mono text-gray-500 mt-1">
            {prefetchProgress < story.scenes.length
              ? `Preparando cena ${prefetchProgress + 1} de ${story.scenes.length}...`
              : `Cena ${current + 1} de ${story.scenes.length}`}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <ImageWithFallback
            src={scene?.imageUrl}
            alt={scene?.scene_title}
            sceneTitle={scene?.scene_title}
            mood={scene?.mood}
            onLoad={() => setImageReady(true)}
          />

          <motion.h3
            key={`title-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-display text-white text-center"
          >
            {scene?.scene_title}
          </motion.h3>

          <motion.p
            key={`narration-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-sm text-gray-300 leading-relaxed font-mono text-center max-w-lg mx-auto"
          >
            {scene?.narration}
          </motion.p>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-cyber-border bg-cyber-panel/30">
          <button
            onClick={goPrev} disabled={isFirst}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-mono text-sm disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-neon-cyan hover:bg-cyber-surface"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {isLast ? (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleReplay}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-mono text-sm transition-all hover:bg-neon-cyan/30 shadow-glow-cyan"
            >
              <Play className="w-4 h-4" /> Rever jornada
            </motion.button>
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-mono text-sm text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-glow-cyan"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
