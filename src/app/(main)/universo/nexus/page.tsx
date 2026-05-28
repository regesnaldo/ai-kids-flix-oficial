'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'

const NexusCosmos = dynamic(
  () => import('@/components/universo/NexusCosmos'),
  { ssr: false, loading: () => <div className="w-full h-full bg-black" /> }
)

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(true)
  const fullText = '> INICIALIZANDO NEXUS...\n> SINCRONIZANDO 500 NÓS DE DADOS...\n> BEM-VINDO AO KERNEL DO METAVERSO.'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setText(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(interval)
        setTimeout(() => {
          setVisible(false)
          setTimeout(onComplete, 600)
        }, 1500)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [fullText, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <pre className="font-mono text-[#00FF88] text-sm md:text-base leading-loose whitespace-pre-line">
            {text}<span className="animate-pulse">▌</span>
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function HUD() {
  const [utc, setUtc] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const iso = now.toISOString()
      setUtc(`UTC ${iso.slice(0, 10)} // ${iso.slice(11, 19)}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute top-5 left-5 font-mono">
        <p className="text-[#00FF88] text-xs tracking-wider">NEXUS // KERNEL ORQUESTRADOR</p>
        <p className="text-[#00FFFF] text-[10px] mt-1">PARTÍCULAS ATIVAS: 500</p>
        <p className="text-[#00FF88] text-[10px] mt-1 animate-pulse">STATUS: ONLINE</p>
      </div>
      <div className="absolute top-5 right-5 font-mono text-[#0088FF] text-[10px]">
        {utc}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="font-mono text-[#00FFFF] text-[11px] opacity-70 animate-pulse">
          [ CLIQUE NO NÚCLEO PARA INICIAR CONTATO ]
        </p>
      </div>
    </div>
  )
}

const MOCK_RESPONSES = [
  'Você chegou ao núcleo do metaverso. Sua jornada começa aqui.',
  'Cada decisão sua alimenta o cosmos. O metaverso observa.',
  'Bem-vindo, participante. Estou processando sua presença.',
]

function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    const reply = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'nexus', content: reply }])
    }, 600)
  }, [input])

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 380 }}
          animate={{ x: 0 }}
          exit={{ x: 380 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-[380px] z-30 flex flex-col"
          style={{ background: 'rgba(0,0,0,0.92)', borderLeft: '1px solid rgba(0,255,255,0.13)' }}
        >
          <div className="border-b border-[#00FFFF]/10 px-5 py-4 flex items-center justify-between">
            <span className="font-mono text-[#00FF88] text-sm tracking-wider">// NEXUS PRIME</span>
            <button
              onClick={onClose}
              className="text-[#00FFFF]/50 hover:text-[#00FFFF] transition text-lg"
              aria-label="Fechar painel"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-sm">
            {messages.length === 0 && (
              <p className="text-[#00FFFF]/30 italic text-xs">
                O núcleo aguarda sua transmissão. Digite algo para iniciar o contato.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : ''}>
                <p className={`text-[10px] tracking-wider uppercase mb-1 ${msg.role === 'user' ? 'text-[#00FFFF]/50' : 'text-[#00FF88]/50'}`}>
                  {msg.role === 'user' ? 'você' : 'nexus'}
                </p>
                <p className={msg.role === 'user' ? 'text-[#00FFFF]' : 'text-[#00FF88]'}>
                  {msg.content}
                </p>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-[#00FFFF]/10 p-4 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent border border-[#00FFFF]/20 rounded px-4 py-2.5 text-[#00FFFF] font-mono text-sm placeholder-[#00FFFF]/30 focus:outline-none focus:border-[#00FFFF]/50 transition"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2.5 border border-[#00FFFF]/30 text-[#00FFFF] font-mono text-xs tracking-widest uppercase rounded hover:bg-[#00FFFF]/10 transition"
            >
              TRANSMITIR
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default function NexusUniversePage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        <NexusCosmos onNucleusClick={() => setChatOpen(true)} />
      </div>

      <AnimatePresence>
        {introDone && <HUD />}
      </AnimatePresence>

      {!introDone && <CinematicIntro onComplete={() => setIntroDone(true)} />}

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </main>
  )
}
