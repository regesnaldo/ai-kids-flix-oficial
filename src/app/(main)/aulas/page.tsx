'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CATALOG } from '@/constants/catalog';
import type { Season, Episode } from '@/constants/catalog';

const WATCH_STORAGE_KEY = 'mente_ai_watch_progress_v1';

function getWatchMap(): Record<string, { watchedPct: number; completed: boolean }> {
  try {
    const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function AulasPage() {
  const [watchMap] = useState(getWatchMap);
  const [selectedPhase, setSelectedPhase] = useState(1);

  const phases = useMemo(() => {
    return CATALOG.filter((p) => p.seasons?.length > 0);
  }, []);

  const activePhase = phases.find((p) => p.id === selectedPhase) ?? phases[0];
  const seasons = activePhase?.seasons ?? [];

  const episodeTypeIcon: Record<string, string> = {
    teoria: '📖',
    laboratorio: '🧪',
    desafio: '🎯',
    narrativa: '🎬',
    reflexao: '💭',
  };

  const episodeTypeColor: Record<string, string> = {
    teoria: '#00D9FF',
    laboratorio: '#F59E0B',
    desafio: '#E50914',
    narrativa: '#8B5CF6',
    reflexao: '#10B981',
  };

  const totalEpisodes = seasons.reduce((acc, s) => acc + (s.episodes?.length ?? 0), 0);
  const completedCount = Object.values(watchMap).filter((w) => w.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Aulas e Módulos</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {totalEpisodes} módulos · {completedCount} concluídos
            </p>
          </div>
          <Link href="/home" className="text-sm text-zinc-400 hover:text-white transition">
            Voltar
          </Link>
        </div>
      </header>

      {/* Fases */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 py-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-8">
          {phases.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPhase(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                selectedPhase === p.id
                  ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/25'
                  : 'text-zinc-400 hover:text-white border border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              Fase {p.id}: {p.name}
            </button>
          ))}
        </div>

        {/* Progresso da fase */}
        <div className="mb-8 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-zinc-300">Progresso da Fase</p>
            <p className="text-xs text-zinc-500">{completedCount}/{totalEpisodes} módulos</p>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${totalEpisodes > 0 ? (completedCount / totalEpisodes) * 100 : 0}%`,
                background: '#00D9FF',
              }}
            />
          </div>
        </div>

        {/* Temporadas */}
        <div className="space-y-8">
          {seasons.map((season) => (
            <div key={season.id}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span style={{ color: season.isNew ? '#00D9FF' : '#a1a1aa' }}>
                  {season.isNew ? '✨' : '📁'}
                </span>
                Temporada {String(season.number).padStart(2, '0')} — {season.title}
                <span className="text-xs font-normal text-zinc-500">
                  ({season.episodes?.length ?? 0} episódios · {season.totalXp} XP)
                </span>
              </h2>

              <p className="text-sm text-zinc-400 mb-4 line-clamp-1">{season.synopsis}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {season.episodes?.map((ep) => {
                  const progress = watchMap[ep.id];
                  const pct = progress ? Math.round(progress.watchedPct * 100) : 0;
                  const icon = episodeTypeIcon[ep.type] ?? '📖';
                  const typeColor = episodeTypeColor[ep.type] ?? '#a1a1aa';

                  return (
                    <Link
                      key={ep.id}
                      href={`/player?episode=${encodeURIComponent(ep.id)}`}
                      className={`group relative rounded-xl border p-4 transition-all ${
                        progress?.completed
                          ? 'border-cyan-400/20 bg-cyan-500/5'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Status badge */}
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            color: typeColor,
                            borderColor: `${typeColor}40`,
                            background: `${typeColor}10`,
                          }}
                        >
                          {icon} {ep.type.toUpperCase()}
                        </span>
                        {progress?.completed && (
                          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/25 px-2 py-0.5 rounded-full">
                            ✓ Concluído
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-white mb-1">
                        E{String(ep.number).padStart(2, '0')}: {ep.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3">{ep.description}</p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>{ep.durationMinutes} min · {ep.xpReward} XP</span>
                        <span>Agente {ep.agentId}</span>
                      </div>

                      {/* Progress bar */}
                      {pct > 0 && (
                        <div className="mt-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: '#00D9FF' }}
                          />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
