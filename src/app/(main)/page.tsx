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
import ContentRow, { type ContentRowCard } from '@/components/home/ContentRow';
import AgentDetailModal from '@/components/home/AgentDetailModal';
import InfoModal from '@/components/home/InfoModal';
import { allAgents } from '@/data/agents';
import type { HomeAgent } from '@/data/agents';

// ── Carousel sections ───────────────────────────────────────────────────

const AGE_RATINGS: Record<string, string> = {
  nexus: 'Livre', volt: 'Livre', kaos: '10+', cipher: 'Livre',
  lyra: 'Livre', axiom: '10+', stratos: 'Livre', terra: 'Livre',
  prism: 'Livre', janus: '12+', aurora: 'Livre', ethos: 'Livre',
};

function toCard(agent: HomeAgent): ContentRowCard {
  return { agent, ageRating: AGE_RATINGS[agent.id] ?? 'Livre' };
}

const SECTIONS = [
  {
    title: 'Continuar Assistindo',
    subtitle: 'Continue de onde parou',
    cards: allAgents.slice(0, 4).map((a, i) => ({
      ...toCard(a),
      progress: [35, 70, 15, 90][i], // example progress for demo
    })),
  },
  {
    title: 'Aventuras Populares',
    subtitle: 'Top 10 da semana',
    cards: allAgents.slice(4, 10).map((a, i) => ({
      ...toCard(a),
      badge: i === 0 ? 'Top 10' : undefined,
      badgeColor: '#EF4444',
    })),
  },
  {
    title: 'Aprender e Divertir',
    subtitle: 'Educação gamificada',
    cards: allAgents.slice(0, 6).map((a, i) => ({
      ...toCard(a),
      badge: i === 0 ? 'Novo' : i === 1 ? 'Popular' : undefined,
      badgeColor: i === 0 ? '#00D9FF' : '#22C55E',
    })),
  },
  {
    title: 'Histórias para Dormir',
    subtitle: 'Narrativas calmas para antes de dormir',
    cards: allAgents.slice(6, 10).map(toCard),
  },
  {
    title: 'Recomendado para Você',
    subtitle: 'Baseado no seu perfil',
    cards: allAgents.slice(0, 8).map(toCard),
  },
];

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

      {/* ── 2. Content Carousels ── */}
      <section className="-mt-12 md:-mt-16 relative z-20 pb-24 pt-6 space-y-6 md:space-y-8" aria-label="Catálogo de conteúdo">
        {SECTIONS.map((section) => (
          <ContentRow
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            cards={section.cards}
            onCardClick={handleOpenModal}
          />
        ))}
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
