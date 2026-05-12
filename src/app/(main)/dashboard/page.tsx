'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Star, TrendingUp, BookOpen, Award, Target, Zap } from 'lucide-react';
import { CATALOG } from '@/constants/catalog';

interface WatchState {
  watchedPct: number;
  completed: boolean;
  updatedAt: number;
}

const WATCH_STORAGE_KEY = 'mente_ai_watch_progress_v1';

function getWatchMap(): Record<string, WatchState> {
  try {
    const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function DashboardPage() {
  const [watchMap, setWatchMap] = useState<Record<string, WatchState>>({});

  useEffect(() => {
    setWatchMap(getWatchMap());
  }, []);

  const stats = useMemo(() => {
    const allEpisodes = CATALOG.flatMap((p) =>
      (p.seasons ?? []).flatMap((s) => s.episodes ?? [])
    );

    const totalEpisodes = allEpisodes.length;
    const completed = Object.values(watchMap).filter((w) => w.completed).length;
    const totalXP = allEpisodes.reduce((acc, ep) => {
      if (watchMap[ep.id]?.completed) return acc + ep.xpReward;
      return acc;
    }, 0);
    const inProgress = Object.values(watchMap).filter((w) => w.watchedPct > 0 && w.watchedPct < 1).length;

    const lastWatched = Object.entries(watchMap)
      .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)[0];

    return {
      totalEpisodes,
      completed,
      totalXP,
      inProgress,
      lastWatchedId: lastWatched?.[0] ?? null,
      lastWatchedPct: lastWatched ? Math.round(lastWatched[1].watchedPct * 100) : 0,
    };
  }, [watchMap]);

  const recentEpisodes = useMemo(() => {
    return Object.entries(watchMap)
      .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
      .map(([id, state]) => {
        const ep = CATALOG.flatMap((p) =>
          (p.seasons ?? []).flatMap((s) => s.episodes ?? [])
        ).find((e) => e.id === id);
        return { id, ...state, episode: ep };
      })
      .filter((item) => item.episode);
  }, [watchMap]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Seu progresso e estatísticas</p>
          </div>
          <Link href="/home" className="text-sm text-zinc-400 hover:text-white transition">
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 md:px-12 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Star, label: 'XP Total', value: stats.totalXP.toLocaleString('pt-BR'), color: '#00D9FF' },
            { icon: BookOpen, label: 'Módulos Concluídos', value: `${stats.completed}/${stats.totalEpisodes}`, color: '#10B981' },
            { icon: Target, label: 'Em Progresso', value: String(stats.inProgress), color: '#F59E0B' },
            { icon: Award, label: 'Progresso Geral', value: `${stats.totalEpisodes > 0 ? Math.round((stats.completed / stats.totalEpisodes) * 100) : 0}%`, color: '#8B5CF6' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">{label}</p>
              </div>
              <p className="text-2xl font-black" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progresso geral */}
        <div className="mb-8 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-zinc-300">Progresso Geral</p>
            <p className="text-xs text-zinc-500">
              {stats.completed} de {stats.totalEpisodes} módulos concluídos
            </p>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${stats.totalEpisodes > 0 ? (stats.completed / stats.totalEpisodes) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #00D9FF, #8B5CF6)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Últimos episódios assistidos */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-300" />
              Atividade Recente
            </h2>

            {recentEpisodes.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <p className="text-zinc-500 text-sm">Nenhuma atividade ainda.</p>
                <Link href="/aulas" className="text-cyan-300 text-sm hover:text-cyan-200 mt-2 inline-block transition">
                  Comece a assistir →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentEpisodes.map(({ id, episode, watchedPct, completed }) => (
                  <Link
                    key={id}
                    href={`/player?episode=${encodeURIComponent(id)}`}
                    className="flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: completed ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <Zap className="w-5 h-5" style={{ color: completed ? '#00D9FF' : '#a1a1aa' }} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate group-hover:text-cyan-200 transition">
                        {episode?.title ?? id}
                      </p>
                      <p className="text-[10px] text-zinc-500">{episode?.type} · {episode?.durationMinutes}min</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {completed ? (
                        <span className="text-[10px] font-bold text-cyan-300">Concluído</span>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-400">{Math.round(watchedPct * 100)}%</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fases */}
            <div>
              <h2 className="text-lg font-bold mb-4">Fases</h2>
              <div className="space-y-2">
                {CATALOG.map((phase) => {
                  const phaseEpisodes = (phase.seasons ?? []).flatMap((s) => s.episodes ?? []);
                  const phaseCompleted = phaseEpisodes.filter((ep) => watchMap[ep.id]?.completed).length;
                  const pct = phaseEpisodes.length > 0 ? (phaseCompleted / phaseEpisodes.length) * 100 : 0;

                  return (
                    <div key={phase.id} className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-white">Fase {phase.id}</p>
                        <p className="text-[10px] text-zinc-500">{Math.round(pct)}%</p>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">{phase.name}</p>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: '#00D9FF' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Link rápido */}
            <Link
              href="/aulas"
              className="block p-4 rounded-xl border border-cyan-400/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition text-center"
            >
              <BookOpen className="w-5 h-5 text-cyan-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-cyan-200">Ver todas as aulas</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{stats.totalEpisodes} módulos disponíveis</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
