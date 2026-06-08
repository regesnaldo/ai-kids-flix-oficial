'use client';

import Image from 'next/image';
import { agents, getStoryboardImage } from '@/lib/agents';
import { AgentCard } from '@/components/AgentCard';

export function Dashboard() {
  return (
    <section className="relative min-h-screen bg-black">
      {/* Background do dashboard */}
      <div className="absolute inset-0">
        <Image
          src={getStoryboardImage('dashboard')}
          alt="Dashboard Background"
          fill
          className="object-cover opacity-30"
          unoptimized
        />
      </div>
      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-white"
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
          SELECIONE SEU AGENTE
        </h2>
        {/* Grid de agentes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 justify-center">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} size="md" />
          ))}
        </div>
      </div>
    </section>
  );
}
