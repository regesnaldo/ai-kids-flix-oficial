'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LivingBook from './LivingBook';
import BookModal from './BookModal';
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
}

// Mapear nível para classe de cor (accentClass)
const levelToAccent: Record<string, string> = {
  'Fundamentos': 'accent-blue',
  'Intermediário': 'accent-green',
  'Avançado': 'accent-orange',
  'Mestre': 'accent-purple'
};

export default function BibliotecaVivaClient({ agents = [], seasons = [] }: BibliotecaVivaClientProps) {
  const [selectedBook, setSelectedBook] = useState<Agent | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBook(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!seasons || seasons.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-400 text-lg">Carregando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
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
    </div>
  );
}
