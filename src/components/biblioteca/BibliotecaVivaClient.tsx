'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import LivingBook from './LivingBook';
import BookModal from './BookModal';
import AgentCombinationModal from '@/components/combinacao/AgentCombinationModal';
import type { Agent } from '@/data/agents';

interface Season {
  id: string;
  name: string;
  slug: string;
  agents: Agent[];
}

interface BibliotecaVivaClientProps {
  agents?: Agent[];
  seasons?: Season[];
  /** Slug da temporada inicial para scroll automático (vindo de searchParams) */
  initialSeason?: string | null;
  /** ID do agente inicial para abrir o modal automaticamente (vindo de searchParams) */
  initialAgent?: string | null;
}

// Mapear nível para classe de cor (accentClass)
const levelToAccent: Record<string, string> = {
  'Fundamentos': 'accent-blue',
  'Intermediário': 'accent-green',
  'Avançado': 'accent-orange',
  'Mestre': 'accent-purple'
};

export default function BibliotecaVivaClient({
  agents: _agents = [],
  seasons = [],
  initialSeason = null,
  initialAgent = null,
}: BibliotecaVivaClientProps) {
  const [selectedBook, setSelectedBook] = useState<Agent | null>(null);
  const [modalCombinacaoAberto, setModalCombinacaoAberto] = useState(false);

  // Scroll automático para a temporada indicada via URL param
  useEffect(() => {
    if (!initialSeason) return;
    const el = document.getElementById(initialSeason);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [initialSeason, seasons]);

  // Abre o modal do agente indicado via URL param
  useEffect(() => {
    if (!initialAgent || seasons.length === 0) return;
    for (const season of seasons) {
      const found = season.agents?.find((a) => a.id === initialAgent);
      if (found) {
        setSelectedBook(found);
        break;
      }
    }
  }, [initialAgent, seasons]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBook(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleCombinacaoBemSucedida = () => {
    // Callback opcional para atualizar estado ou notificar componentes pais
    console.log('[BibliotecaViva] Combinação bem-sucedida!');
  };

  if (!seasons || seasons.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Carregando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header fixo com botão de combinação */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Biblioteca <span className="text-cyan-400">Viva</span>
          </h1>
          <motion.button
            onClick={() => setModalCombinacaoAberto(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Combinar Agentes
          </motion.button>
        </div>
      </header>

      {seasons.map((season) => (
        <section key={season.id} id={season.slug} className="min-h-screen py-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 px-6">
            Temporada: <span className="text-cyan-400">{season.name}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
            {season.agents?.map((agent) => (
              <LivingBook
                key={agent.id}
                agent={agent}
                accentClass={levelToAccent[agent.level] || 'accent-blue'}
                onOpen={(a) => setSelectedBook(a)}
              />
            ))}
          </div>
        </section>
      ))}
      <AnimatePresence>
        {selectedBook && <BookModal agent={selectedBook!} onClose={() => setSelectedBook(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {modalCombinacaoAberto && (
          <AgentCombinationModal
            aberto={modalCombinacaoAberto}
            agentes={seasons.flatMap((s) => s.agents ?? [])}
            onFechar={() => setModalCombinacaoAberto(false)}
            onCombinacaoBemSucedida={handleCombinacaoBemSucedida}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
