'use client';

/**
 * MENTE.AI — Página Inicial estilo Netflix
 * src/app/(main)/page.tsx
 *
 * Estrutura:
 *  1. HeroBanner — tela cheia com gradiente + formulário de email
 *  2. AgentRow  — 5 fileiras de agentes com scroll horizontal
 *  3. AgentDetailModal — abre ao clicar em qualquer card
 */

import { useState } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import AgentRow from '@/components/home/AgentRow';
import AgentDetailModal from '@/components/home/AgentDetailModal';
import InfoModal from '@/components/home/InfoModal';
import { allAgents, AGENT_ROWS } from '@/data/all-agents';
import type { HomeAgent } from '@/data/all-agents';

export default function HomePage() {
  const [selectedAgent, setSelectedAgent] = useState<HomeAgent | null>(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [isInfoOpen, setIsInfoOpen]       = useState(false);

  const handleOpenModal = (agent: HomeAgent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Limpa o agente após a animação de saída
    setTimeout(() => setSelectedAgent(null), 300);
  };

  return (
    <main className="min-h-screen bg-zinc-950">

      {/* ── 1. Hero Banner ── */}
      <HeroBanner onInfoClick={() => setIsInfoOpen(true)} />

      {/* ── 2. Fileiras de Agentes ── */}
      <section className="-mt-20 relative z-20 pb-24 pt-4 space-y-8" aria-label="Catálogo de Agentes">
        {AGENT_ROWS.map((row) => (
          <AgentRow
            key={row.title}
            title={row.title}
            agents={row.agents}
            onAgentClick={handleOpenModal}
          />
        ))}

        {/* Fileira extra: todos os agentes */}
        <AgentRow
          title="Todos os Agentes"
          agents={allAgents}
          onAgentClick={handleOpenModal}
        />
      </section>

      {/* ── 3. Modal de Detalhes do Agente ── */}
      <AgentDetailModal
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* ── 4. Modal "Mais Informações" (sobre a plataforma) ── */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </main>
  );
}
