'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRegisterPresence } from '@/hooks/usePresence'
import { AgentChatSession } from '@/components/AgentChatSession'
import { MessageSquare, X } from 'lucide-react'

const NexusCosmos = dynamic(
  () => import('@/components/universo/NexusCosmos'),
  { ssr: false }
)

export default function NexusPage() {
  const [chatOpen, setChatOpen] = useState(false)
  useRegisterPresence("nexus");

  return (
    <>
      <NexusCosmos />
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105"
        style={{ backgroundColor: chatOpen ? '#ef4444' : '#3B82F6' }}
        aria-label={chatOpen ? 'Fechar chat' : 'Abrir chat com NEXUS'}
      >
        {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[70vh] rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <AgentChatSession
            agentId="nexus"
            agentName="NEXUS — O Conector"
            agentColor="#3B82F6"
          />
        </div>
      )}
    </>
  )
}
