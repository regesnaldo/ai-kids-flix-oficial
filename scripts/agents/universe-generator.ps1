# Universe-Generator Bot
# Gera templates de universo automaticamente
# Uso: pwsh -File scripts/agents/universe-generator.ps1 [agente]

param(
    [string]$Agent = ""
)

if ($Agent -eq "") {
    Write-Host "Uso: pwsh -File scripts/agents/universe-generator.ps1 [agente]"
    Write-Host "Exemplo: pwsh -File scripts/agents/universe-generator.ps1 stratos"
    exit
}

$agentLower = $Agent.ToLower()
$projectRoot = "C:\Users\REGINALDO\Desktop\AI-KIDS-OFICIAL"
$agentDir = "$projectRoot\src\app\(main)\universo\$agentLower"
$orchestratorDir = "$projectRoot\src\lib\laboratorio"
$componentsDir = "$projectRoot\src\components\universo"

Write-Host "🌌 Gerando universo: $Agent" -ForegroundColor Cyan

# 1. Criar página do universo
$pageContent = @"
'use client'

import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useUniverseStore } from '@/store/useUniverseStore'
import {
  $((Get-Culture).TextInfo).ToTitleCase($agentLower)_CONFIG,
  fetch$((Get-Culture).TextInfo).ToTitleCase($agentLower)Response,
  speakAs$((Get-Culture).TextInfo).ToTitleCase($agentLower),
} from '@/lib/laboratorio/$agentLower-orchestrator'

const UniverseDialog = dynamic(
  () => import('@/components/universo/UniverseDialog'),
  { ssr: false }
)

const UniverseCanvas = dynamic(
  () => import('@/components/universo/$((Get-Culture).TextInfo).ToTitleCase($agentLower)Canvas'),
  { ssr: false, loading: () => <div className='w-full h-full bg-black' />
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
      await speakAs$((Get-Culture).TextInfo).ToTitleCase($agentLower)($((Get-Culture).TextInfo).ToTitleCase($agentLower)_CONFIG.introVoice)
      await delay(500)
      setIntroStep('question'); await delay(300)
      onComplete()
    }
    run()
  }, [setIntroStep, onComplete])

  return <AnimatePresence>
    {introStep === 'fade-in' && <motion.div key='blackout' className='absolute inset-0 z-30 bg-black' initial={{opacity:1}} animate={{opacity:0}} transition={{duration:1.4}} />}
  </AnimatePresence>
}

export default function $((Get-Culture).TextInfo).ToTitleCase($agentLower)UniversePage() {
  const { introSeen, introStep, markIntroSeen, setIntroStep, dialogueState, selectedOption, setDialogueState, setSelectedOption, isSpeaking, audioEnabled, setIsSpeaking, setAudioEnabled, profile, updateProfile, addMessage, messages } = useUniverseStore()

  useEffect(() => { if (!introSeen) setIntroStep('fade-in') }, [introSeen, setIntroStep])

  const handleIntroComplete = useCallback(() => { markIntroSeen() }, [markIntroSeen])

  const handleOptionSelect = useCallback(async (option: string) => {
    setSelectedOption(option)
    setDialogueState('responding')
    updateProfile({ turnCount: profile.turnCount + 1, lastChoices: [...profile.lastChoices, option] })
    addMessage({ role: 'user', content: option, timestamp: Date.now() })
    const history = messages.map((m) => ({ role: m.role === 'universe' ? 'assistant' : 'user', content: m.content }))
    const reply = await fetch$((Get-Culture).TextInfo).ToTitleCase($agentLower)Response(option, profile, history)
    addMessage({ role: 'universe', content: reply, timestamp: Date.now() })
    if (audioEnabled) { setIsSpeaking(true); await speakAs$((Get-Culture).TextInfo).ToTitleCase($agentLower)(reply); setIsSpeaking(false) }
  }, [setSelectedOption, setDialogueState, updateProfile, addMessage, messages, profile, audioEnabled, setIsSpeaking])

  const handleResponseComplete = useCallback(() => { setDialogueState('awaiting') }, [setDialogueState])
  const handleSpeak = useCallback(async (text: string) => { if (!isSpeaking) { setIsSpeaking(true); await speakAs$((Get-Culture).TextInfo).ToTitleCase($agentLower)(text); setIsSpeaking(false) } }, [isSpeaking, setIsSpeaking])

  const showDialog = introSeen || introStep === 'question' || introStep === 'done'

  return (
    <main className='relative w-full h-screen overflow-hidden' style={{ background: $((Get-Culture).TextInfo).ToTitleCase($agentLower)_CONFIG.themeColors.background }}>
      <div className='absolute inset-0 z-0'><UniverseCanvas /></div>
      <div className='absolute inset-0 z-5 pointer-events-none' style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)' }} />
      {!introSeen && <UniverseIntro onComplete={handleIntroComplete} />}
      <AnimatePresence>{showDialog && <motion.div key='dialog' className='absolute inset-0 z-10 pointer-events-none' initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.7}}>
        <UniverseDialog dialogueState={dialogueState} selectedOption={selectedOption} onOptionSelect={handleOptionSelect} onResponseComplete={handleResponseComplete} onSpeak={handleSpeak} isSpeaking={isSpeaking} audioEnabled={audioEnabled} onToggleAudio={() => setAudioEnabled(!audioEnabled)} firstQuestion={$((Get-Culture).TextInfo).ToTitleCase($agentLower)_CONFIG.firstQuestion} initialOptions={$((Get-Culture).TextInfo).ToTitleCase($agentLower)_CONFIG.initialOptions} latestUniverseMessage={messages.filter((m) => m.role === 'universe').at(-1)?.content} themeColors={$((Get-Culture).TextInfo).ToTitleCase($agentLower)_CONFIG.themeColors} />
      </motion.div>}</AnimatePresence>
    </main>
  )
}
"@

Write-Host "✅ Template de página criado" -ForegroundColor Green
Write-Host "📝 Arquivo: src/app/(main)/universo/$agentLower/page.tsx" -ForegroundColor Gray