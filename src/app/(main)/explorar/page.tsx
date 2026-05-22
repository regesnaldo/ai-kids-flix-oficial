'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { allAgents } from '@/data/all-agents';
import { TEMAS } from '@/components/TemasDropdown';

const themeMap: Record<string, string[]> = {
  'ia-generativa': ['aurora', 'kaos', 'lyra'],
  'machine-learning': ['cipher', 'axiom', 'nexus'],
  'redes-neurais': ['volt', 'nexus', 'lyra'],
  'fundamentos': ['nexus', 'terra', 'axiom'],
  'deep-learning': ['axiom', 'cipher', 'prism'],
  'computer-vision': ['cipher', 'prism', 'lyra'],
  'nlp': ['lyra', 'prism', 'nexus'],
  'etica-ia': ['ethos', 'janus', 'terra'],
  'ia-criatividade': ['kaos', 'aurora', 'lyra'],
  'robotica': ['volt', 'terra', 'stratos'],
  'ia-criancas': ['lyra', 'aurora', 'nexus'],
  'ia-negocios': ['stratos', 'axiom', 'nexus'],
  'seguranca': ['cipher', 'ethos', 'prism'],
  'futuro-ia': ['kaos', 'aurora', 'stratos'],
  'projetos': ['terra', 'stratos', 'volt'],
};

function ExplorarContent() {
  const searchParams = useSearchParams();
  const temaSlug = searchParams.get('tema');
  const searchQuery = searchParams.get('q')?.trim() ?? '';
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    let agents = allAgents;

    // Filter by tema (category)
    if (temaSlug) {
      const ids = themeMap[temaSlug] ?? [];
      if (ids.length > 0) agents = agents.filter((a) => ids.includes(a.id));
    }

    // Filter by search query
    if (searchQuery.length > 0) {
      const q = searchQuery.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    return agents;
  }, [temaSlug, searchQuery]);

  const temaLabel = useMemo(() => {
    if (!temaSlug) return null;
    const found = TEMAS.find((t) => t.slug === temaSlug);
    return found?.label ?? temaSlug;
  }, [temaSlug]);

  const themeIcons: Record<string, string> = {};
  TEMAS.forEach((t) => { themeIcons[t.slug] = t.icon; });

  return (
    <div className="min-h-screen" style={{ background: '#0a0a1a' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: 'linear-gradient(to bottom, #0a0a1a, transparent)' }}>
        <div className="flex items-center justify-between w-full" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-white">MENTE</span><span className="text-red-500">.AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition">Início</Link>
              <Link href="/aulas" className="text-gray-400 hover:text-white transition">Séries</Link>
              <Link href="/agentes" className="text-gray-400 hover:text-white transition">Agentes</Link>
              <Link href="/explorar" className="text-white font-semibold">Explorar</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 md:px-12 pb-12">
        {/* Tema filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <Link href="/explorar"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              !temaSlug ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>
            Todos
          </Link>
          {TEMAS.map((t) => {
            const isActive = temaSlug === t.slug;
            return (
              <Link key={t.slug} href={`/explorar?tema=${encodeURIComponent(t.slug)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  isActive ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}>
                {t.icon} {t.label}
              </Link>
            );
          })}
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            {searchQuery ? (
              <>🔍 Resultados para "{searchQuery}"</>
            ) : temaSlug ? (
              <>{themeIcons[temaSlug] ?? '📂'} {temaLabel}</>
            ) : (
              <>🗂️ Explorar todos os agentes</>
            )}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} disponíve{filteredAgents.length === 1 ? 'l' : 'is'}
            {temaSlug ? ` em ${temaLabel}` : ''}
            {searchQuery ? ` para "${searchQuery}"` : ''}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAgents.map((agent) => (
            <Link key={agent.id} href={`/agentes/${agent.id}`}
              className="group"
              onMouseEnter={() => setHoveredId(agent.id)}
              onMouseLeave={() => setHoveredId(null)}>
              <div className="relative aspect-[2/3] rounded-md overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, ${agent.color}33 0%, #0f0f0f 100%)`,
                  boxShadow: hoveredId === agent.id ? `0 8px 32px ${agent.color}22` : undefined,
                }}>
                <img src={agent.image} alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  draggable={false} loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="inline-block px-2 py-0.5 text-white text-[9px] font-bold rounded mb-1"
                    style={{ background: agent.color }}>
                    {agent.category}
                  </span>
                  <p className="text-sm font-bold text-white leading-tight">{agent.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{agent.description}</p>
                </div>
              </div>
              <p className="mt-1.5 text-xs font-bold text-gray-300 truncate">{agent.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{agent.role}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-gray-500 text-sm">Carregando...</div>
      </div>
    }>
      <ExplorarContent />
    </Suspense>
  );
}