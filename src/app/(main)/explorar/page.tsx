'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { allAgents } from '@/data/all-agents';
import { TEMAS } from '@/components/TemasDropdown';

function ExplorarContent() {
  const searchParams = useSearchParams();
  const temaSlug = searchParams.get('tema');
  const [loading, setLoading] = useState(true);

  const temaLabel = useMemo(() => {
    if (!temaSlug) return null;
    const found = TEMAS.find((t) => t.slug === temaSlug);
    return found?.label ?? temaSlug;
  }, [temaSlug]);

  useEffect(() => {
    setLoading(true);
    const timer = globalThis.setTimeout(() => setLoading(false), 1500);
    return () => globalThis.clearTimeout(timer);
  }, [temaSlug]);

  return (
    <main className="mx-auto max-w-7xl px-6 md:px-12 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold">
        {temaLabel ? `Explorando: ${temaLabel}` : 'Explorar'}
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        {temaSlug ? `Tema selecionado: ${temaSlug}` : 'Todos os agentes disponíveis'}
      </p>

      {loading ? (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="w-[180px] h-[270px] bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agentes/${agent.id}`}
              className="group w-[180px] flex flex-col gap-2"
            >
              <div className="relative w-[180px] h-[270px] rounded-lg overflow-hidden border border-white/10 bg-black">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-bold tracking-widest text-zinc-300/80 uppercase">{agent.category}</p>
                  <p className="text-sm font-extrabold text-white">{agent.name}</p>
                  <p className="text-xs text-zinc-400 line-clamp-1">{agent.role}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default function ExplorarPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="text-white font-black text-2xl tracking-tight">
            <Link href="/home">
              MENTE<span style={{ color: '#00D9FF' }}>.AI</span>
            </Link>
          </div>
          <Link href="/home" className="text-sm text-zinc-300 hover:text-white transition-colors">
            Voltar
          </Link>
        </div>
      </header>

      <Suspense fallback={
        <main className="mx-auto max-w-7xl px-6 md:px-12 py-10">
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="w-[180px] h-[270px] bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </main>
      }>
        <ExplorarContent />
      </Suspense>
    </div>
  );
}
