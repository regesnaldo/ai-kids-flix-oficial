'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { User, Star, BookOpen, Trophy, Settings, ChevronRight, Zap, Award, Eye, Pencil } from 'lucide-react';
import { CATALOG } from '@/constants/catalog';

interface WatchState {
  watchedPct: number;
  completed: boolean;
  updatedAt: number;
}

const WATCH_STORAGE_KEY = 'mente_ai_watch_progress_v1';
const PROFILE_NAME_KEY = 'profileName';
const PROFILE_ID_KEY = 'profileId';

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

function getProfileName(): string {
  try {
    return globalThis.localStorage
      ? globalThis.localStorage.getItem('mente_ai_profile_name') ??
        getCookie(PROFILE_NAME_KEY) ??
        ''
      : '';
  } catch {
    return '';
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match?.[2] ?? null;
}

export default function PerfilPage() {
  const [watchMap, setWatchMap] = useState<Record<string, WatchState>>({});
  const [mounted, setMounted] = useState(false);
  const [profileName] = useState(() => getProfileName());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    try {
      const raw = globalThis.localStorage?.getItem(WATCH_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setWatchMap(parsed);
      }
    } catch { void 0; }
  }, []);

  const allEpisodes = useMemo(() =>
    CATALOG.flatMap((p) => (p.seasons ?? []).flatMap((s) => s.episodes ?? [])),
    []
  );

  const stats = useMemo(() => {
    const completed = Object.values(watchMap).filter((w) => w.completed).length;
    const totalXP = allEpisodes.reduce((acc, ep) => {
      if (watchMap[ep.id]?.completed) return acc + ep.xpReward;
      return acc;
    }, 0);
    const inProgress = Object.values(watchMap).filter((w) => w.watchedPct > 0 && w.watchedPct < 1).length;
    const pct = allEpisodes.length > 0 ? Math.round((completed / allEpisodes.length) * 100) : 0;

    // Most used agent
    const agentCount: Record<string, number> = {};
    Object.keys(watchMap).forEach((id) => {
      const ep = allEpisodes.find((e) => e.id === id);
      if (ep) agentCount[ep.agentId] = (agentCount[ep.agentId] ?? 0) + 1;
    });
    const topAgent = Object.entries(agentCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';

    return { completed, totalXP, inProgress, pct, topAgent, total: allEpisodes.length };
  }, [watchMap, allEpisodes]);

  const recentEpisodes = useMemo(() =>
    Object.entries(watchMap)
      .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
      .slice(0, 3)
      .map(([id, state]) => ({
        id,
        episode: allEpisodes.find((e) => e.id === id),
        ...state,
      }))
      .filter((item) => item.episode),
    [watchMap, allEpisodes]
  );

  const initials = profileName
    ? profileName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Perfil</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {profileName || 'Participante'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/conta"
              className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 transition"
            >
              <Settings className="w-3.5 h-3.5" />
              Configurações
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 md:px-12 py-8">
        {/* Profile card */}
        <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)' }}
            >
              <span className="text-2xl font-black text-white">{initials}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{profileName || 'Participante'}</h2>
                <Link href="/conta/perfis" className="p-1 hover:bg-white/10 rounded transition">
                  <Pencil className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-sm font-bold">{stats.totalXP.toLocaleString('pt-BR')} XP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-sm font-bold">{stats.completed} módulos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-sm font-bold">Agente: {stats.topAgent}</span>
                </div>
              </div>
            </div>

            {/* Progresso circular */}
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black" style={{ color: '#00D9FF' }}>{stats.pct}%</div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Concluído</p>
            </div>
          </div>
        </div>

        {/* Stats + Recente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estatísticas */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-300" />
              Estatísticas
            </h3>

            {[
              { icon: Eye, label: 'Total assistido', value: `${stats.completed} módulos`, color: '#00D9FF' },
              { icon: Award, label: 'XP acumulado', value: `${stats.totalXP.toLocaleString('pt-BR')}`, color: '#F59E0B' },
              { icon: Zap, label: 'Em progresso', value: `${stats.inProgress} módulos`, color: '#10B981' },
              { icon: User, label: 'Agente favorito', value: stats.topAgent, color: '#8B5CF6' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{label}</p>
                  <p className="text-sm font-bold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Atividade recente */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold">Atividade Recente</h3>

            {recentEpisodes.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
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
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: completed ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.05)' }}
                    >
                      <span className="text-xs" style={{ color: completed ? '#00D9FF' : '#a1a1aa' }}>
                        {completed ? '✓' : `${Math.round(watchedPct * 100)}%`}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate group-hover:text-cyan-200 transition">
                        {episode?.title ?? id}
                      </p>
                      <p className="text-[10px] text-zinc-500">{episode?.type} · {episode?.durationMinutes}min</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
