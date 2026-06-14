'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

// ─── Types ───────────────────────────────────────────────────────────────────

type OraclePhase =
  | 'loading'      // spinner neon
  | 'intro'        // LOGOS se apresenta (TTS)
  | 'question'     // pergaminho flutuante
  | 'validating'   // botão pulsando
  | 'correct'      // flash verde
  | 'wrong'        // shake + toast vermelho
  | 'narration'    // olho de neon + TTS
  | 'complete'     // arquétipo revelado

interface Question {
  id: string
  text: string
  options: { id: string; text: string }[]
  correctId: string
  explanation: string
}

interface LogosGenerateResponse {
  success: boolean
  episodeId: string
  agentId: string
  questions: Question[]
}

interface LogosValidateResponse {
  success: boolean
  score: number
  total: number
  passed: boolean
  minPassing: number
  results: { questionId: string; userAnswer: string; correct: boolean; correctId: string }[]
  message: string
}

// ─── Archetype mapping ───────────────────────────────────────────────────────

const ARCHETYPE_MAP: Record<string, { title: string; description: string; emoji: string; color: string }> = {
  3: {
    title: 'O Sábio Integral',
    description: 'Sua mente absorveu cada detalhe. Você não apenas aprende — você compreende.',
    emoji: '🔮',
    color: 'linear-gradient(to right, #fbbf24, #f59e0b, #ffffff)',
  },
  2: {
    title: 'O Guardião do Conhecimento',
    description: 'Você reteve o suficiente para passar. O conhecimento está se consolidando em você.',
    emoji: '📜',
    color: 'linear-gradient(to right, #22d3ee, #3b82f6, #9333ea)',
  },
  1: {
    title: 'O Aprendiz em Jornada',
    description: 'Parte do saber escapou, mas a chama da curiosidade ainda queima. Tente novamente.',
    emoji: '🌱',
    color: 'linear-gradient(to right, #34d399, #14b8a6, #22d3ee)',
  },
  0: {
    title: 'O Peregrino',
    description: 'O conhecimento é um caminho, não um destino. Reflita e retorne quando estiver pronto.',
    emoji: '🌌',
    color: 'linear-gradient(to right, #9ca3af, #64748b, #52525b)',
  },
}

function getArchetype(score: number, total: number) {
  const pct = total > 0 ? (score / total) * 100 : 0
  if (pct >= 100) return ARCHETYPE_MAP[3]
  if (pct >= 66) return ARCHETYPE_MAP[2]
  if (pct >= 33) return ARCHETYPE_MAP[1]
  return ARCHETYPE_MAP[0]
}

// ─── ElevenLabs TTS hook ─────────────────────────────────────────────────────

function useLogosTts() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async (type: 'apresentacao' | 'aprovado' | 'reprovado') => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    try {
      const res = await fetch('/api/logos/tts', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      if (!res.ok) {
        console.error(`[LOGOS/TTS] HTTP ${res.status}: ${res.statusText}`)
        throw new Error(`TTS failed (${res.status})`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.play()
      return new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url)
          resolve()
        }
      })
    } catch (err) {
      console.error('[LOGOS/TTS]', err)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  return { play, stop }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function NeonSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6" role="status" aria-label="Carregando">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-t-2 border-amber-400 animate-spin" />
        <div className="absolute inset-4 rounded-full bg-amber-500/10 blur-sm animate-pulse" />
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-amber-300/70 font-mono text-sm tracking-widest uppercase"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

function NeonEye({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-32 h-32 flex items-center justify-center"
      role="img"
      aria-label="LOGOS está falando"
    >
      {/* Anéis concêntricos pulsantes */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-amber-400/40"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-amber-300/30"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      {/* Globo ocular */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/40"
        animate={{
          boxShadow: [
            '0 0 20px rgba(245,158,11,0.3)',
            '0 0 40px rgba(245,158,11,0.6)',
            '0 0 20px rgba(245,158,11,0.3)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Pupila */}
      <motion.div
        className="w-5 h-5 rounded-full bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.8)]"
        animate={{
          scale: [1, 0.85, 1],
          x: [0, 3, -3, 0],
          y: [0, -2, 2, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

function ScrollParchment({
  question,
  index,
  total,
  onAnswer,
  disabled,
  onValidate,
  validationState,
}: {
  question: Question
  index: number
  total: number
  onAnswer: (optionId: string) => void
  disabled: boolean
  onValidate: (optionId: string) => void
  validationState: 'idle' | 'correct' | 'wrong'
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Indicador de progresso */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i < index ? 'bg-amber-500 w-8' : i === index ? 'bg-amber-400 w-10 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-amber-900/40 w-6'
            }`}
          />
        ))}
      </div>

      {/* Pergaminho */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-black/70 backdrop-blur-xl p-8 md:p-10"
        animate={
          validationState === 'correct'
            ? { borderColor: 'rgba(16,185,129,0.6)', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }
            : validationState === 'wrong'
              ? { borderColor: 'rgba(239,68,68,0.6)', boxShadow: '0 0 30px rgba(239,68,68,0.2)' }
              : { borderColor: 'rgba(245,158,11,0.3)', boxShadow: '0 0 15px rgba(245,158,11,0.1)' }
        }
        transition={{ duration: 0.3 }}
      >
        {/* Glow decorativo */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Número da pergunta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-amber-500/40 font-mono text-xs tracking-[0.2em] uppercase">
            Pergunta {index + 1} de {total}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
        </div>

        {/* Texto da pergunta */}
        <h2 className="text-xl md:text-2xl font-serif text-amber-100 leading-relaxed mb-8 tracking-wide">
          {question.text}
        </h2>

        {/* Opções */}
        <div className="space-y-3" role="radiogroup" aria-label="Opções de resposta">
          {question.options.map((opt) => (
            <motion.button
              key={opt.id}
              whileHover={!disabled ? { scale: 1.01, x: 4 } : undefined}
              whileTap={!disabled ? { scale: 0.99 } : undefined}
              animate={
                validationState === 'wrong' && disabled
                  ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                  : {}
              }
              transition={
                validationState === 'wrong' && disabled
                  ? { duration: 0.4 }
                  : { type: 'spring', stiffness: 300, damping: 20 }
              }
              onClick={() => {
                if (!disabled) {
                  onAnswer(opt.id)
                  onValidate(opt.id)
                }
              }}
              disabled={disabled}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 font-mono text-sm md:text-base leading-relaxed
                ${disabled
                  ? validationState === 'correct'
                    ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : validationState === 'wrong'
                      ? 'border-red-500/50 bg-red-950/30 text-red-200'
                      : 'border-gray-700/50 bg-gray-900/30 text-gray-500 cursor-not-allowed'
                  : 'border-amber-500/20 bg-amber-950/20 text-amber-200/90 hover:bg-amber-900/30 hover:border-amber-400/50 hover:text-amber-100 cursor-pointer'
                }`}
              role="radio"
              aria-checked={false}
            >
              <span className="inline-flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold
                  ${disabled
                    ? validationState === 'correct' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : validationState === 'wrong' ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-gray-600 bg-gray-800 text-gray-500'
                    : 'border-amber-500/40 bg-amber-900/20 text-amber-400'
                  }`}
                >
                  {opt.id.toUpperCase()}
                </span>
                {opt.text}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function Revelation({ archetype, onFinish }: {
  archetype: { title: string; description: string; emoji: string; color: string }
  onFinish: () => void
}) {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center gap-8 text-center px-6"
    >
      {/* Brilho de fundo */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          background: `radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Emoji em size grande com glow */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
        className="text-7xl md:text-8xl mb-2"
      >
        {archetype.emoji}
      </motion.div>

      {/* Título */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={showText ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
        style={{ backgroundImage: archetype.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {archetype.title}
      </motion.h2>

      {/* Descrição */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={showText ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="text-amber-200/70 font-serif text-lg md:text-xl max-w-lg leading-relaxed"
      >
        {archetype.description}
      </motion.p>

      {/* Botão */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={showText ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onFinish}
        className="mt-4 px-8 py-3 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-300 font-mono text-sm tracking-wider hover:bg-amber-900/30 hover:border-amber-400/60 transition-all duration-300"
      >
        Continuar Jornada
      </motion.button>
    </motion.div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function LogosOracle() {
  const {
    logosActive,
    logosEpisodeContext,
    setLogosActive,
    resetLogos,
  } = useAppStore()

  const [phase, setPhase] = useState<OraclePhase>('loading')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [validationState, setValidationState] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [validateResponse, setValidateResponse] = useState<LogosValidateResponse | null>(null)
  const [archetype, setArchetype] = useState<{ title: string; description: string; emoji: string; color: string } | null>(null)
  const [introVoicePlayed, setIntroVoicePlayed] = useState(false)
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { play: playTts, stop: stopTts } = useLogosTts()

  // Parse the context if it's a question array from the backend
  const episodeContent = logosEpisodeContext || ''

  // ─── Fetch questions ──────────────────────────────────────────────────────

  const fetchQuestions = useCallback(async () => {
    if (!logosEpisodeContext) return
    setPhase('loading')
    try {
      const res = await fetch('/api/logos/generate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeContent: logosEpisodeContext,
          agentId: 'logos',
          episodeId: crypto.randomUUID(),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: LogosGenerateResponse = await res.json()
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setPhase('intro')
      } else {
        throw new Error('No questions returned')
      }
    } catch (err) {
      console.error('[LOGOS] Failed to fetch questions:', err)
      // Fallback: generate locally if backend fails
      const fallbackQuestions: Question[] = [
        {
          id: 'q1',
          text: 'O que você aprendeu com este episódio?',
          options: [
            { id: 'a', text: 'O conhecimento é a chave para evoluir' },
            { id: 'b', text: 'A força bruta vence tudo' },
            { id: 'c', text: 'Ignorar é mais fácil' },
          ],
          correctId: 'a',
          explanation: 'O conhecimento é fundamental para o crescimento.',
        },
      ]
      setQuestions(fallbackQuestions)
      setPhase('intro')
    }
  }, [logosEpisodeContext])

  // ─── Intro narration ──────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === 'intro' && !introVoicePlayed) {
      setIntroVoicePlayed(true)
      playTts('apresentacao').then(() => {
        setPhase('question')
      })
      // Safety timeout in case TTS fails silently
      phaseTimeoutRef.current = setTimeout(() => {
        if (phase === 'intro') setPhase('question')
      }, 5000)
    }
    return () => {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current)
    }
  }, [phase, introVoicePlayed, playTts])

  // ─── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (logosActive && logosEpisodeContext) {
      fetchQuestions()
    }
    return () => {
      stopTts()
    }
  }, [logosActive, logosEpisodeContext, fetchQuestions, stopTts])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleValidate = useCallback(async (optionId: string) => {
    if (!questions[currentIndex]) return
    setValidationState('idle')
    setPhase('validating')

    const q = questions[currentIndex]
    const isCorrect = optionId === q.correctId

    // Simulate slight delay for dramatic effect
    await new Promise((r) => setTimeout(r, 600))

    if (isCorrect) {
      setValidationState('correct')
      await new Promise((r) => setTimeout(r, 1200))
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1)
        setValidationState('idle')
        setPhase('question')
      } else {
        // All questions answered — validate
        setPhase('validating')
        try {
          const res = await fetch('/api/logos/validate', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              episodeId: crypto.randomUUID(),
              agentId: 'logos',
              questions,
              answers: { ...answers, [q.id]: optionId },
              attemptNumber: 1,
            }),
          })
          const data: LogosValidateResponse = await res.json()
          setValidateResponse(data)

          const arch = getArchetype(data.score, data.total)
          setArchetype(arch)

          // Play approval or failure narration
          const ttsType = data.passed ? 'aprovado' as const : 'reprovado' as const
          await playTts(ttsType)

          setPhase('complete')
        } catch {
          setPhase('complete')
          const arch = getArchetype(1, 1)
          setArchetype(arch)
        }
      }
    } else {
      setValidationState('wrong')
      await new Promise((r) => setTimeout(r, 800))
      setValidationState('idle')
      setPhase('question')
    }
  }, [currentIndex, questions, answers, playTts])

  const handleAnswer = useCallback((optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentIndex]?.id]: optionId }))
  }, [currentIndex, questions])

  const handleFinish = useCallback(() => {
    stopTts()
    resetLogos()
  }, [resetLogos, stopTts])

  // ─── Render early exit ────────────────────────────────────────────────────

  if (!logosActive) return null

  const currentQuestion = questions[currentIndex]
  const isTransitioning = phase === 'loading' || phase === 'intro' || phase === 'validating'

  // ─── Glassmorphism overlay base ────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-2xl px-4"
        role="dialog"
        aria-label="LOGOS — Oráculo do Conhecimento"
        aria-modal="true"
      >
        {/* Background cosmic particles (via CSS) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/3 rounded-full blur-[150px]" />
        </div>

        {/* Título LOGOS (sempre visível nas fases) */}
        <AnimatePresence>
          {phase !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent tracking-wider">
                LOGOS
              </h1>
              <p className="text-amber-600/60 font-mono text-xs tracking-[0.3em] uppercase mt-1">
                Guardião do Conhecimento
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── LOADING ──────────────────────────────────────────────────────── */}
        {phase === 'loading' && (
          <NeonSpinner text="O LOGOS está consultando os pergaminhos..." />
        )}

        {/* ─── INTRO (TTS playing) ──────────────────────────────────────────── */}
        {phase === 'intro' && (
          <div className="flex flex-col items-center gap-8">
            <NeonEye isActive={true} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-amber-300/60 font-mono text-xs tracking-widest uppercase"
            >
              Ouvindo...
            </motion.p>
          </div>
        )}

        {/* ─── QUESTION ─────────────────────────────────────────────────────── */}
        {phase === 'question' && currentQuestion && (
          <ScrollParchment
            question={currentQuestion}
            index={currentIndex}
            total={questions.length}
            onAnswer={handleAnswer}
            disabled={false}
            onValidate={handleValidate}
            validationState={validationState}
          />
        )}

        {/* ─── VALIDATING ───────────────────────────────────────────────────── */}
        {phase === 'validating' && (
          <div className="flex flex-col items-center gap-6">
            <NeonSpinner text="O LOGOS analisa sua resposta..." />
          </div>
        )}

        {/* ─── NARRATION ────────────────────────────────────────────────────── */}
        {(phase === 'correct' || phase === 'wrong') && (
          <div className="flex flex-col items-center gap-8">
            <NeonEye isActive={true} />
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`font-mono text-sm tracking-wider ${
                phase === 'correct' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {phase === 'correct' ? 'Resposta aceita.' : 'O LOGOS não aceita essa resposta.'}
            </motion.p>
          </div>
        )}

        {/* ─── COMPLETE ─────────────────────────────────────────────────────── */}
        {phase === 'complete' && archetype && (
          <Revelation archetype={archetype} onFinish={handleFinish} />
        )}

        {/* Status bar inferior */}
        <AnimatePresence>
          {phase === 'question' && currentQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4"
            >
              <span className="text-amber-600/40 font-mono text-[10px] tracking-[0.2em] uppercase">
                {answers[currentQuestion.id] ? 'Respondida' : 'Aguardando resposta'}
              </span>
              <div className="w-1 h-1 rounded-full bg-amber-500/40 animate-pulse" />
              <span className="text-amber-600/40 font-mono text-[10px] tracking-[0.2em] uppercase">
                {currentIndex + 1}/{questions.length}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
