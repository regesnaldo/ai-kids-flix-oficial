'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { AgentDefinition } from '@/canon/agents/all-agents';
import AgentChat from '@/components/AgentChat';
import { t } from '@/lib/translations';

interface AgentDetailClientProps {
  agent: AgentDefinition;
}

export default function AgentDetailClient({ agent }: AgentDetailClientProps) {
  const [heroInput, setHeroInput] = useState('');
  const [heroSendSignal, setHeroSendSignal] = useState(0);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 90]);

  const visuals = useMemo(() => {
    const byId: Record<string, { avatar: string; color: string; title: string }> = {
      nexus: { avatar: '/images/agentes/nexus.png', color: '#3B82F6', title: 'O Conector' },
      volt: { avatar: '/images/agentes/volt.png', color: '#F59E0B', title: 'O Energético' },
      aurora: { avatar: '/images/agentes/aurora.png', color: '#EC4899', title: 'A Criadora' },
      ethos: { avatar: '/images/agentes/ethos.png', color: '#22C55E', title: 'O Filósofo' },
    };

    return byId[agent.id] ?? {
      avatar: `/images/agentes/${agent.id}.png`,
      color: '#3B82F6',
      title: `${t(`dimensions.${agent.dimension}`)} ${t(`levels.${agent.level}`)}`,
    };
  }, [agent.dimension, agent.id, agent.level]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-8">
        <Link
          href="/agentes"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition"
        >
          ← Voltar para todos os agentes
        </Link>

        <section
          className="relative min-h-screen overflow-hidden rounded-3xl"
          style={{
            background: `radial-gradient(circle at 70% 30%, ${visuals.color}33 0%, rgba(10,10,26,1) 45%, rgba(10,10,26,1) 100%)`,
          }}
        >
          <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[50vh] lg:min-h-screen"
              style={{ y: parallaxY }}
            >
              <Image
                src={visuals.avatar}
                alt={agent.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex min-h-[50vh] lg:min-h-screen items-center px-6 py-10 md:px-12"
            >
              <div className="w-full">
                <span
                  className="inline-flex rounded-full px-4 py-1 text-xs tracking-[0.22em] uppercase"
                  style={{ backgroundColor: `${visuals.color}29`, color: visuals.color }}
                >
                  {visuals.title}
                </span>
                <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight">{agent.name}</h1>
                <p className="mt-4 max-w-2xl text-white/75 text-base md:text-lg">
                  {agent.personality.approach.split('. ')[0]}.
                </p>
                <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/[0.04] p-2">
                  <input
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setHeroSendSignal((prev) => prev + 1);
                      }
                    }}
                    placeholder="Inicie a conversa com este agente..."
                    className="w-full bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
                    aria-label="Mensagem para o agente"
                  />
                  <button
                    onClick={() => setHeroSendSignal((prev) => prev + 1)}
                    className="rounded-xl px-5 py-3 text-sm font-medium text-white transition hover:brightness-110"
                    style={{ backgroundColor: visuals.color, boxShadow: `0 0 30px ${visuals.color}55` }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-8 md:py-12">
          <AgentChat
            agentId={agent.id}
            agentName={agent.name}
            agentApproach={agent.personality.approach}
            accentColor={visuals.color}
            immersive
            heroInput={heroInput}
            onHeroInputChange={setHeroInput}
            heroSendSignal={heroSendSignal}
          />
        </section>
      </div>
    </div>
  );
}
