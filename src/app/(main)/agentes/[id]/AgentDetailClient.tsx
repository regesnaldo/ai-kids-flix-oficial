'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import type { AgentDefinition } from '@/canon/agents/all-agents';
import AgentChat from '@/components/AgentChat';
import AgentNotes from '@/components/AgentNotes';
import { t } from '@/lib/translations';

interface AgentDetailClientProps {
  agent: AgentDefinition;
}

export default function AgentDetailClient({ agent }: AgentDetailClientProps) {
  const { guideAgentId, setGuideAgent } = useUserStore();
  const isCurrentGuide = guideAgentId === agent.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/agentes"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition"
        >
          ← Voltar para todos os agentes
        </Link>
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10">
          <div className="relative h-96 w-full bg-gradient-to-br from-purple-600 via-blue-600 to-gray-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-5xl font-bold mb-2">{agent.name}</h1>
              <p className="text-xl text-gray-300">
                {t(`dimensions.${agent.dimension}`)} • {t(`levels.${agent.level}`)}
              </p>
            </div>
          </div>
          <div className="p-8 text-white">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Personalidade</h2>
              <p className="text-lg text-gray-300 mb-4">{agent.personality.approach}</p>
              <div className="flex flex-wrap gap-2">
                {agent.personality.values.map(value => (
                  <span key={value} className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Sua Missão no Laboratório</h2>
              <p className="text-lg text-gray-300 bg-white/5 p-6 rounded-xl border border-white/10">
                {agent.laboratoryTask}
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Conquista Associada</h2>
              <div className="flex items-center gap-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 p-6 rounded-xl border border-purple-500/30">
                <div>
                  <h3 className="text-xl font-bold">{agent.badge.name}</h3>
                  <p className="text-gray-300">{agent.badge.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setGuideAgent(agent.id)}
                disabled={isCurrentGuide}
                className={`flex-1 backdrop-blur-sm border-2 text-white text-center py-4 rounded-xl font-bold text-lg transition ${
                  isCurrentGuide
                    ? 'bg-white/5 border-white/10 text-white/60 cursor-not-allowed'
                    : 'bg-white/10 border-white/30 hover:bg-white/20'
                }`}
                aria-label={isCurrentGuide ? 'Agente guia já selecionado' : 'Escolher este agente como guia'}
              >
                {isCurrentGuide ? 'Guia Atual' : 'Escolher como Guia'}
              </button>
            </div>
          </div>
        </div>
        <AgentChat
          agentId={agent.id}
          agentName={agent.name}
          agentApproach={agent.personality.approach}
        />
        <AgentNotes agentId={agent.id} agentName={agent.name} />
      </div>
    </div>
  );
}
