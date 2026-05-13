'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import Link from 'next/link'
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

const NexusDialog = dynamic(
  () => import('@/components/universo/NexusDialog').then((m) => m.NexusDialog),
  { ssr: false }
)

const NexusCanvas = dynamic(
  () => import('@/components/universo/NexusCanvas'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black" />,
  }
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

// ── Chat com NEXUS (terminal cinematografico) ────────────────────────────────
type ChatTurn = { role: 'user' | 'assistant'; content: string }

function NexusChatTerminal() {
  const [history, setHistory] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typedReply, setTypedReply] = useState('')

  const handleSubmit = useCallback(async () => {
    const question = input.trim()
    if (!question || isLoading) return

    const nextHistory: ChatTurn[] = [...history, { role: 'user', content: question }]
    setHistory(nextHistory)
    setInput('')
    setIsLoading(true)
    setTypedReply('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'nexus', messages: nextHistory }),
      })
      const data = await res.json()
      const reply: string = typeof data?.message === 'string' ? data.message : 'O cosmos está em silêncio. Tente novamente.'

      // Animacao de digitacao
      let i = 0
      const step = () => {
        i += 2
        setTypedReply(reply.slice(0, i))
        if (i < reply.length) {
          setTimeout(step, 18)
        } else {
          setHistory([...nextHistory, { role: 'assistant', content: reply }])
          setTypedReply('')
          setIsLoading(false)
        }
      }
      step()
    } catch {
      setHistory([...nextHistory, { role: 'assistant', content: 'O cosmos está em silêncio. Tente novamente.' }])
      setIsLoading(false)
    }
  }, [input, history, isLoading])

  return (
    <div className="border border-blue-500/20 bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="border-b border-blue-500/15 px-5 py-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-blue-300/70">terminal — nexus</span>
      </div>

      <div className="px-5 py-6 min-h-[300px] max-h-[480px] overflow-y-auto space-y-5 font-mono text-sm">
        {history.length === 0 && !typedReply && (
          <p className="text-blue-300/40 italic">
            O cosmos aguarda sua pergunta. Cada partícula de luz é um pensamento esperando para ser conectado.
          </p>
        )}
        {history.map((turn, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-blue-400/50">
              {turn.role === 'user' ? 'você' : 'nexus'}
            </div>
            <div className={turn.role === 'user' ? 'text-zinc-300' : 'text-blue-100 leading-relaxed'}>
              {turn.content}
            </div>
          </div>
        ))}
        {typedReply && (
          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-blue-400/50">nexus</div>
            <div className="text-blue-100 leading-relaxed">
              {typedReply}
              <span className="inline-block w-2 h-4 bg-blue-300/80 ml-1 animate-pulse align-middle" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-blue-500/15 px-5 py-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="Faça uma pergunta ao cosmos..."
          disabled={isLoading}
          className="flex-1 bg-transparent border border-blue-500/25 rounded-lg px-4 py-2.5 text-blue-100 placeholder:text-blue-400/30 font-mono text-sm focus:outline-none focus:border-blue-400/60 transition disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="px-5 py-2.5 border border-blue-400/40 text-blue-200 font-mono text-xs tracking-[0.2em] uppercase rounded-lg hover:bg-blue-500/10 hover:border-blue-400/70 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLoading ? 'conectando' : 'conectar'}
        </button>
      </div>
    </div>
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

  const portais = [
    { id: 'volt',  name: 'VOLT',  subtitle: 'O Energético',     color: '#F59E0B' },
    { id: 'kaos',  name: 'KAOS',  subtitle: 'O Caos Criativo',  color: '#EF4444' },
    { id: 'ethos', name: 'ETHOS', subtitle: 'O Filósofo',       color: '#8B5CF6' },
  ]

  return (
    <main className="bg-black">

      {/* ═══ SECAO 0 — Cosmic Entry (canvas 3D + intro cinematografica) ══════ */}
      <section className="relative w-full h-screen overflow-hidden">

        {/* Canvas 3D — sempre presente em background */}
        <div className="absolute inset-0 z-0">
          <NexusCanvas />
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

        {/* Indicador de scroll */}
        <AnimatePresence>
          {showDialog && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-2 text-blue-300/50">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase">role para baixo</span>
                <div className="w-px h-12 bg-gradient-to-b from-blue-400/60 to-transparent animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* ═══ SECAO 1 — Identidade canonica do NEXUS ═════════════════════════ */}
      <section className="relative w-full bg-gradient-to-b from-[#0a1628] via-[#1e3a5f] to-[#0a1628] py-32 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-300/60 text-xs tracking-[0.4em] uppercase mb-4">Identidade Canônica</p>
            <h2 className="text-white text-5xl md:text-6xl font-black mb-3">NEXUS</h2>
            <p className="text-blue-200/80 text-xl md:text-2xl font-light">O Arquiteto do Conhecimento</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/40 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-blue-300/70 text-[10px] tracking-[0.35em] uppercase mb-5">Valores</h3>
              <div className="flex flex-wrap gap-2">
                {['conexão', 'orquestração', 'atenção', 'transformers'].map((v) => (
                  <span
                    key={v}
                    className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-100 text-sm tracking-wide"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/40 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-blue-300/70 text-[10px] tracking-[0.35em] uppercase mb-5">Missão no Laboratório</h3>
              <p className="text-blue-100/90 leading-relaxed text-sm">
                Explicar como transformers processam tokens com atenção multi-head. Conecta os pontos entre entrada e saída mostrando o caminho da informação.
              </p>
            </div>
          </div>

          <div className="bg-black/40 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-blue-300/70 text-[10px] tracking-[0.35em] uppercase mb-5">Abordagem</h3>
            <p className="text-blue-100/90 leading-relaxed text-base md:text-lg">
              Explicativo, técnico mas acessível, usa analogias de conexão e redes. Fala como um mentor paciente que conecta conceitos complexos com exemplos do dia a dia. &ldquo;Vamos conectar os pontos!&rdquo; é seu bordão.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECAO 2 — Dialogo cosmico ═════════════════════════════════════ */}
      <section className="relative w-full bg-[#07070f] py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cyan-300/60 text-xs tracking-[0.4em] uppercase mb-4">Diálogo Cósmico</p>
            <h2 className="text-white text-4xl md:text-5xl font-black mb-3">Faça sua pergunta</h2>
            <p className="text-blue-200/50 text-sm md:text-base">
              NEXUS nunca dá a resposta completa. Ele abre portas e devolve a pergunta que você ainda não formulou.
            </p>
          </div>

          <NexusChatTerminal />
        </div>
      </section>

      {/* ═══ SECAO 3 — Portais para outros universos ════════════════════════ */}
      <section className="relative w-full bg-gradient-to-b from-[#07070f] to-black py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-300/60 text-xs tracking-[0.4em] uppercase mb-4">Portais Conectados</p>
            <h2 className="text-white text-4xl md:text-5xl font-black mb-3">O NEXUS conecta todos os universos</h2>
            <p className="text-blue-200/50 text-sm md:text-base max-w-xl mx-auto">
              Cada agente é uma dimensão própria. Atravesse os portais para entrar em mundos guiados por outras vozes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {portais.map((agente) => (
              <Link
                key={agente.id}
                href={`/universo/${agente.id}`}
                className="group relative block bg-black/60 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-500"
                style={{ boxShadow: `0 0 0 0 ${agente.color}00` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={`/images/agentes/${agente.id}.png`}
                    alt={agente.name}
                    className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${agente.color}40 0%, transparent 60%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                <div className="p-6">
                  <p
                    className="text-[10px] tracking-[0.35em] uppercase mb-2"
                    style={{ color: agente.color }}
                  >
                    {agente.subtitle}
                  </p>
                  <h3 className="text-white text-2xl font-black mb-5 tracking-tight">{agente.name}</h3>
                  <div
                    className="inline-block w-full text-center py-3 border rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 group-hover:bg-white/5"
                    style={{ borderColor: `${agente.color}80`, color: agente.color }}
                  >
                    Entrar no Universo
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
