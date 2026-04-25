'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useNexusStore } from '@/store/useNexusStore'
import {
  NEXUS_INTRO_VOICE,
  NEXUS_FIRST_QUESTION,
  NEXUS_INITIAL_OPTIONS,
  fetchNexusResponse,
  speakAsNexus,
} from '@/lib/laboratorio/nexus-orchestrator'

// Imports lazy — evita SSR de componentes Three.js
const NexusScene = dynamic(
  () => import('@/components/universo/NexusScene').then((m) => m.NexusScene),
  { ssr: false, loading: () => <div className="w-full h-full bg-black" /> }
)

const NexusDialog = dynamic(
  () => import('@/components/universo/NexusDialog').then((m) => m.NexusDialog),
  { ssr: false }
)

// ── Utilitario ────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

// ── Sequencia cinematografica de entrada ─────────────────────────────────────
function NexusIntro({ onComplete }: { onComplete: () => void }) {
  const setIntroStep = useNexusStore((s) => s.setIntroStep)
  const introStep    = useNexusStore((s) => s.introStep)
  const hasRun       = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function run() {
      // Step 1 — tela preta com fade out
      setIntroStep('fade-in')
      await delay(900)

      // Step 2 — particulas surgem no canvas
      setIntroStep('particles')
      await delay(1600)

      // Step 3 — voz do NEXUS
      setIntroStep('voice')
      await speakAsNexus(NEXUS_INTRO_VOICE)
      await delay(500)

      // Step 4 — primeira pergunta aparece
      setIntroStep('question')
      await delay(300)

      onComplete()
    }

    run()
  }, [setIntroStep, onComplete])

  return (
    <AnimatePresence>
      {/* Fade inicial — tela preta saindo */}
      {introStep === 'fade-in' && (
        <motion.div
          key="blackout"
          className="absolute inset-0 z-30 bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      )}

      {/* Frase de boas-vindas do NEXUS */}
      {(introStep === 'particles' || introStep === 'voice') && (
        <motion.div
          key="welcome"
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{ duration: 0.9 }}
        >
          <motion.p
            className="font-mono text-blue-200 text-lg md:text-2xl text-center max-w-lg px-8 leading-relaxed tracking-wide"
            style={{ textShadow: '0 0 30px rgba(59,130,246,0.9), 0 0 60px rgba(59,130,246,0.4)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            {NEXUS_INTRO_VOICE}
          </motion.p>
        </motion.div>
      )}

      {/* Pulso de luz azul durante a voz */}
      {introStep === 'voice' && (
        <motion.div
          key="glow-pulse"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(59,130,246,0.25) 0%, transparent 68%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1, 0] }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  )
}

// ── Pagina principal do Universo NEXUS ────────────────────────────────────────
export default function NexusUniversePage() {
  const {
    introSeen,
    introStep,
    markIntroSeen,
    setIntroStep,
    dialogueState,
    selectedOption,
    setDialogueState,
    setSelectedOption,
    isSpeaking,
    audioEnabled,
    setIsSpeaking,
    setAudioEnabled,
    profile,
    updateProfile,
    addMessage,
    messages,
  } = useNexusStore()

  // Inicia a intro se o usuario nunca a viu
  useEffect(() => {
    if (!introSeen) {
      setIntroStep('fade-in')
    }
  }, [introSeen, setIntroStep])

  const handleIntroComplete = useCallback(() => {
    markIntroSeen()
  }, [markIntroSeen])

  // Usuario escolhe uma opcao → LangChain responde
  const handleOptionSelect = useCallback(
    async (option: string) => {
      setSelectedOption(option)
      setDialogueState('responding')
      updateProfile(option)
      addMessage({ role: 'user', content: option, timestamp: Date.now() })

      const history = messages.map((m) => ({
        role: m.role === 'nexus' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      }))

      const reply = await fetchNexusResponse(option, profile, history)
      addMessage({ role: 'nexus', content: reply, timestamp: Date.now() })

      if (audioEnabled) {
        setIsSpeaking(true)
        await speakAsNexus(reply)
        setIsSpeaking(false)
      }
    },
    [
      setSelectedOption, setDialogueState, updateProfile,
      addMessage, messages, profile, audioEnabled, setIsSpeaking,
    ]
  )

  const handleResponseComplete = useCallback(() => {
    setDialogueState('awaiting')
  }, [setDialogueState])

  const handleSpeak = useCallback(
    async (text: string) => {
      if (isSpeaking) return
      setIsSpeaking(true)
      await speakAsNexus(text)
      setIsSpeaking(false)
    },
    [isSpeaking, setIsSpeaking]
  )

  const showDialog =
    introSeen || introStep === 'question' || introStep === 'done'

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">

      {/* Canvas 3D — sempre presente em background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <NexusScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Vinheta de profundidade */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {/* Intro cinematografica — apenas na primeira visita */}
      {!introSeen && <NexusIntro onComplete={handleIntroComplete} />}

      {/* Badge de arquetipo — aparece apos o primeiro turno */}
      <AnimatePresence>
        {showDialog && profile.turnCount > 0 && (
          <motion.div
            key="archetype"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-5 left-5 z-20 pointer-events-none"
          >
            <div className="font-mono text-xs text-blue-400/70 border border-blue-500/25 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <span className="text-blue-500/40 mr-1.5">arquetipo</span>
              {profile.archetypeLabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contador de turnos — canto superior direito */}
      <AnimatePresence>
        {showDialog && profile.turnCount > 0 && (
          <motion.div
            key="turns"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute top-5 right-5 z-20 pointer-events-none"
          >
            <div className="font-mono text-xs text-blue-400/40 border border-blue-500/15 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              turno {profile.turnCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogo — aparece apos a intro */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            key="dialog"
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <NexusDialog
              dialogueState={dialogueState}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
              onResponseComplete={handleResponseComplete}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              audioEnabled={audioEnabled}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
              firstQuestion={NEXUS_FIRST_QUESTION}
              initialOptions={NEXUS_INITIAL_OPTIONS}
              latestNexusMessage={
                messages.filter((m) => m.role === 'nexus').at(-1)?.content
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
