'use client'

import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useUniverseStore } from '@/store/useUniverseStore'
import {
  STRATOS_CONFIG,
  fetchStratosResponse,
  speakAsStratos,
} from '@/lib/laboratorio/stratos-orchestrator'

const UniverseDialog = dynamic(
  () => import('@/components/universo/UniverseDialog'),
  { ssr: false }
)

const UniverseCanvas = dynamic(
  () => import('@/components/universo/StratosCanvas'),
  { ssr: false, loading: () => <div className="w-full h-full bg-black"></div> }
)

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)) }

function UniverseIntro({ onComplete }: { onComplete: () => void }) {
  const setIntroStep = useUniverseStore((s) => s.setIntroStep)
  const introStep = useUniverseStore((s) => s.introStep)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    async function run() {
      setIntroStep('fade-in'); await delay(900)
      setIntroStep('particles'); await delay(1600)
      setIntroStep('voice')
      await speakAsStratos(STRATOS_CONFIG.introVoice)
      await delay(500)
      setIntroStep('question'); await delay(300)
      onComplete()
    }
    run()
  }, [setIntroStep, onComplete])

  return (
    <AnimatePresence>
      {introStep === 'fade-in' && (
        <motion.div key="blackout" className="absolute inset-0 z-30 bg-black"
          initial={{opacity:1}} animate={{opacity:0}} transition={{duration:1.4}} />
      )}
      {(introStep === 'particles' || introStep === 'voice') && (
        <motion.div key="welcome" className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, transition:{duration:0.6}}} transition={{duration:0.9}}>
          <motion.p className="font-mono text-purple-200 text-lg md:text-2xl text-center max-w-lg px-8"
            style={{textShadow:'0 0 30px rgba(139,92,246,0.9), 0 0 60px rgba(167,139,250,0.4)'}}
            initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.4, duration:1}}>
            {STRATOS_CONFIG.introVoice}
          </motion.p>
        </motion.div>
      )}
      {introStep === 'voice' && (
        <motion.div key="glow" className="absolute inset-0 z-10 pointer-events-none"
          style={{background:'radial-gradient(ellipse at center, rgba(139,92,246,0.25) 0%, transparent 68%)'}}
          initial={{opacity:0}} animate={{opacity:[0,1,0.4,1,0]}} transition={{duration:3, ease:'easeInOut'}} />
      )}
    </AnimatePresence>
  )
}

export default function StratosUniversePage() {
  const { introSeen, introStep, markIntroSeen, setIntroStep, dialogueState, selectedOption, setDialogueState, setSelectedOption, isSpeaking, audioEnabled, setIsSpeaking, setAudioEnabled, profile, updateProfile, addMessage, messages } = useUniverseStore()

  useEffect(() => { if (!introSeen) setIntroStep('fade-in') }, [introSeen, setIntroStep])

  const handleIntroComplete = useCallback(() => { markIntroSeen() }, [markIntroSeen])

  const handleOptionSelect = useCallback(async (option: string) => {
    setSelectedOption(option)
    setDialogueState('responding')
    updateProfile({ turnCount: profile.turnCount + 1, lastChoices: [...profile.lastChoices, option] })
    addMessage({ role: 'user', content: option, timestamp: Date.now() })
    const history: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map((m) => ({ role: m.role === 'universe' ? 'assistant' : 'user', content: m.content }))
    const reply = await fetchStratosResponse(option, profile, history)
    addMessage({ role: 'universe', content: reply, timestamp: Date.now() })
    if (audioEnabled) { setIsSpeaking(true); await speakAsStratos(reply); setIsSpeaking(false) }
  }, [setSelectedOption, setDialogueState, updateProfile, addMessage, messages, profile, audioEnabled, setIsSpeaking])

  const handleResponseComplete = useCallback(() => { setDialogueState('awaiting') }, [setDialogueState])
  const handleSpeak = useCallback(async (text: string) => { if (!isSpeaking) { setIsSpeaking(true); await speakAsStratos(text); setIsSpeaking(false) } }, [isSpeaking, setIsSpeaking])

  const showDialog = introSeen || introStep === 'question' || introStep === 'done'

  return (
    <main className="relative w-full h-screen overflow-hidden" style={{ background: STRATOS_CONFIG.themeColors.background }}>
      <div className="absolute inset-0 z-0"><UniverseCanvas /></div>
      <div className="absolute inset-0 z-5 pointer-events-none" style={{ background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)' }} />
      {!introSeen && <UniverseIntro onComplete={handleIntroComplete} />}
      <AnimatePresence>{showDialog && <motion.div key="dialog" className="absolute inset-0 z-10 pointer-events-none" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7}}>
        <UniverseDialog dialogueState={dialogueState} selectedOption={selectedOption} onOptionSelect={handleOptionSelect} onResponseComplete={handleResponseComplete} onSpeak={handleSpeak} isSpeaking={isSpeaking} audioEnabled={audioEnabled} onToggleAudio={() => setAudioEnabled(!audioEnabled)} firstQuestion={STRATOS_CONFIG.firstQuestion} initialOptions={STRATOS_CONFIG.initialOptions} latestUniverseMessage={messages.filter((m) => m.role === 'universe').at(-1)?.content} themeColors={STRATOS_CONFIG.themeColors} />
      </motion.div>}</AnimatePresence>
    </main>
  )
}