'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { allAgents } from '@/data/all-agents';
import { TEMAS } from '@/components/TemasDropdown';

const themeMap: Record<string, string[]> = {
  'ia-generativa': ['aurora', 'aether', 'kaos'],
  'machine-learning': ['analytikos', 'quantum', 'cipher'],
  'redes-neurais': ['volt', 'nexus', 'lyra'],
  'fundamentos': ['tabula', 'terra', 'index'],
  'deep-learning': ['axiom', 'typus', 'analytikos'],
  'computer-vision': ['cipher', 'typus', 'prism'],
  'nlp': ['lyra', 'prism', 'morphe'],
  'etica-ia': ['ethos', 'janus', 'stasis'],
  'ia-criatividade': ['kaos', 'aether', 'paleta'],
  'robotica': ['volt', 'terra', 'stratos'],
  'ia-criancas': ['tabula', 'lyra', 'index'],
  'ia-negocios': ['stratos', 'praevius', 'index'],
  'seguranca': ['cipher', 'ethos', 'stasis'],
  'futuro-ia': ['quantum', 'praevius', 'kaos'],
  'projetos': ['terra', 'stratos', 'volt'],
};

function ExplorarContent() {
  const searchParams = useSearchParams();
  const temaSlug = searchParams.get('tema');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    if (!temaSlug) return allAgents;
    const ids = themeMap[temaSlug] ?? [];
    if (ids.length === 0) return allAgents;
    return allAgents.filter((a) => ids.includes(a.id));
  }, [temaSlug]);

  const temaLabel = useMemo(() => {
    if (!temaSlug) return null;
    const found = TEMAS.find((t) => t.slug === temaSlug);
    return found?.label ?? temaSlug;
  }, [temaSlug]);

  const themeIcons: Record<string, string> = {};
  TEMAS.forEach((t) => { themeIcons[t.slug] = t.icon; });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex items-center justify-between">
          <Link href="/home" className="text-white font-black text-xl tracking-tight">
            MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
          </Link>

          {/* Temas como tabs */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {TEMAS.map((t) => {
              const isActive = temaSlug === t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/explorar?tema=${encodeURIComponent(t.slug)}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/25'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="mr-1">{t.icon}</span>
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 md:px-12 py-10">
        {/* Título da seção */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
            {temaSlug ? (
              <>
                <span className="text-lg">{themeIcons[temaSlug] ?? '📂'}</span>
                {temaLabel}
              </>
            ) : (
              <>
                <span className="text-lg">🗂️</span>
                Explorar todos os agentes
              </>
            )}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} disponíve{filteredAgents.length === 1 ? 'l' : 'is'}
            {temaSlug ? ` em ${temaLabel}` : ''}
          </p>
        </div>

        {/* Grid de agentes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agentes/${agent.id}`}
              className="group w-full"
              onMouseEnter={() => setHoveredId(agent.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, ${agent.color}33 0%, #0f0f0f 100%)`,
                  boxShadow: hoveredId === agent.id ? `0 8px 32px ${agent.color}22` : undefined,
                }}
              >
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-6xl font-black select-none transition-opacity duration-300"
                    style={{ color: agent.color, opacity: 0.15 }}
                  >
                    {agent.name.charAt(0)}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span
                    className="inline-block px-2 py-0.5 text-white text-[9px] font-bold rounded mb-1"
                    style={{ background: agent.color }}
                  >
                    {agent.category}
                  </span>
                  <p className="text-sm font-extrabold text-white leading-tight">{agent.name}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{agent.description}</p>
                </div>
              </div>

              <p className="mt-1.5 text-xs font-bold text-zinc-300 truncate">{agent.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{agent.role}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Carregando...</div>
      </div>
    }>
      <ExplorarContent />
    </Suspense>
  );
}
