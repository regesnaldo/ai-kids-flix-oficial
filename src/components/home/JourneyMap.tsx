'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useNarrativaStore } from '@/store/useNarrativaStore';
import { HERO_AGENTS } from '@/components/home/HeroBanner';

const DIMENSIONS = [
  { id: 'D1_EMOCIONAL', label: 'Dimensão Emocional' },
  { id: 'D2_INTELECTUAL', label: 'Dimensão Intelectual' },
  { id: 'D3_MORAL', label: 'Dimensão Moral' },
];

export default function JourneyMap() {
  const {
    fase,
    temporada,
    agenteAtivo,
    perfilDetectado,
    xpTotal,
    dimensaoAtiva,
    decisoesTomadas,
  } = useNarrativaStore((state) => ({
    fase: state.fase,
    temporada: state.temporada,
    agenteAtivo: state.agenteAtivo,
    perfilDetectado: state.perfilDetectado,
    xpTotal: state.xpTotal,
    dimensaoAtiva: state.dimensaoAtiva,
    decisoesTomadas: state.decisoesTomadas,
  }));

  const currentAgent = HERO_AGENTS.find((agent) => agent.id === agenteAtivo) ?? HERO_AGENTS[0];

  const archetype = perfilDetectado ?? 'Analítico-Protetor';

  const dimensionProgress = useMemo(() => {
    const base = xpTotal % 100;
    return DIMENSIONS.map((dimension, index) => ({
      ...dimension,
      value: Math.min(100, (base + index * 15) % 100 + 20),
    }));
  }, [xpTotal]);

  const visitedAgents = useMemo(() => {
    const unique = Array.from(
      new Set(decisoesTomadas.map((d) => d.agenteRespondeu).filter(Boolean))
    );
    return unique.slice(0, 5);
  }, [decisoesTomadas]);

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:px-12">
      <div className="rounded-3xl border border-white/10 bg-black/60 p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)] ring-1 ring-white/5 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">Jornada</p>
            <h3 className="text-3xl font-extrabold text-white">
              Fase {fase} · Temporada {String(temporada).padStart(2, '0')}
            </h3>
            <p className="text-sm text-white/60">
              Próxima parada: {currentAgent.name} · {currentAgent.role}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80">
            Arquétipo atual:
            <span className="ml-2 font-bold text-white">{archetype}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {dimensionProgress.map((dim) => (
            <div key={dim.id}>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                <span>{dim.label}</span>
                <span>{dim.value}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.value}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 text-sm text-white/70 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Universos visitados</p>
            <div className="flex gap-3">
              {visitedAgents.length === 0
                ? <span className="text-xs text-white/50">Sem registros ainda</span>
                : visitedAgents.map((agentId) => (
                    <span
                      key={agentId}
                      className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-semibold text-white"
                    >
                      {agentId.slice(0, 2).toUpperCase()}
                    </span>
                  ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Próximo episódio recomendado</p>
            <p className="font-semibold text-white">
              Navegue com {currentAgent.name} e avance 1 módulo nessa fase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
