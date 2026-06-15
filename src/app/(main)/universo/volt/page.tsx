'use client'

import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useUniverseStore } from '@/store/useUniverseStore'
import {
  VOLT_CONFIG,
  fetchVoltResponse,
  speakAsVolt,
} from '@/lib/laboratorio/volt-orchestrator'

const UniverseDialog = dynamic(
  () => import('@/components/universo/UniverseDialog'),
  { ssr: false }
)

const UniverseCanvas = dynamic(
  () => import('@/components/universo/VoltCanvas'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />,
  }
)

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

function UniverseIntro({ onComplete }: { onComplete: () => void }) {
  const setIntroStep = useUniverseStore((s) => s.setIntroStep)
  const introStep = useUniverseStore((s) => s.introStep)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function run() {
      setIntroStep('fade-in')
      await delay(900)

      setIntroStep('particles')
      await delay(1600)

      setIntroStep('voice')
      await speakAsVolt(VOLT_CONFIG.introVoice)
      await delay(500)

      setIntroStep('question')
      await delay(300)

      onComplete()
    }

    run()
  }, [setIntroStep, onComplete])

  return (
    <AnimatePresence>
      {introStep === 'fade-in' && (
        <motion.div
          key="blackout"
          className="absolute inset-0 z-30 bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      )}

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
            className="font-mono text-yellow-200 text-lg md:text-2xl text-center max-w-lg px-8 leading-relaxed tracking-wide"
            style={{ textShadow: '0 0 30px rgba(255,215,0,0.9), 0 0 60px rgba(255,69,0,0.4)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            {VOLT_CONFIG.introVoice}
          </motion.p>
        </motion.div>
      )}

      {introStep === 'voice' && (
        <motion.div
          key="glow-pulse"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,215,0,0.25) 0%, transparent 68%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1, 0] }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  )
}

export default function VoltUniversePage() {
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
  } = useUniverseStore()

  useEffect(() => {
    if (!introSeen) {
      setIntroStep('fade-in')
    }
  }, [introSeen, setIntroStep])

  const handleIntroComplete = useCallback(() => {
    markIntroSeen()
  }, [markIntroSeen])

  const handleOptionSelect = useCallback(
    async (option: string) => {
      setSelectedOption(option)
      setDialogueState('responding')
      updateProfile({
        turnCount: profile.turnCount + 1,
        lastChoices: [...profile.lastChoices, option],
      })
      addMessage({ role: 'user', content: option, timestamp: Date.now() })

      const history: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map((m) => ({
        role: m.role === 'universe' ? 'assistant' : 'user',
        content: m.content,
      }))

      const reply = await fetchVoltResponse(option, profile, history)
      addMessage({ role: 'universe', content: reply, timestamp: Date.now() })

      if (audioEnabled) {
        setIsSpeaking(true)
        await speakAsVolt(reply)
        setIsSpeaking(false)
      }
    },
    [
      setSelectedOption,
      setDialogueState,
      updateProfile,
      addMessage,
      messages,
      profile,
      audioEnabled,
      setIsSpeaking,
    ]
  )

  const handleResponseComplete = useCallback(() => {
    setDialogueState('awaiting')
  }, [setDialogueState])

  const handleSpeak = useCallback(
    async (text: string) => {
      if (isSpeaking) return
      setIsSpeaking(true)
      await speakAsVolt(text)
      setIsSpeaking(false)
    },
    [isSpeaking, setIsSpeaking]
  )

  const showDialog = introSeen || introStep === 'question' || introStep === 'done'

  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ background: VOLT_CONFIG.themeColors.background }}>
      <div className="absolute inset-0 z-0">
        <UniverseCanvas />
      </div>

      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {!introSeen && <UniverseIntro onComplete={handleIntroComplete} />}

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
            <div className="font-mono text-xs text-yellow-400/70 border border-yellow-500/25 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <span className="text-yellow-500/40 mr-1.5">arquetipo</span>
              {profile.archetypeLabel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="font-mono text-xs text-yellow-400/40 border border-yellow-500/15 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              turno {profile.turnCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            key="dialog"
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <UniverseDialog
              dialogueState={dialogueState}
              selectedOption={selectedOption}
              onOptionSelect={handleOptionSelect}
              onResponseComplete={handleResponseComplete}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              audioEnabled={audioEnabled}
              onToggleAudio={() => setAudioEnabled(!audioEnabled)}
              firstQuestion={VOLT_CONFIG.firstQuestion}
              initialOptions={VOLT_CONFIG.initialOptions}
              latestUniverseMessage={
                messages.filter((m) => m.role === 'universe').at(-1)?.content
              }
              themeColors={VOLT_CONFIG.themeColors}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}