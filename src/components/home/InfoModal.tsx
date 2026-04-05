'use client';

/**
 * MENTE.AI — Modal "Sobre a Plataforma"
 * src/components/home/InfoModal.tsx
 *
 * Aberto pelo botão "Mais Informações" no HeroBanner.
 * Apresenta a proposta de valor do MENTE.AI.
 */

import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CATALOG, getFeaturedSeasons } from '@/constants/catalog';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const season = useMemo(() => {
    const featured = getFeaturedSeasons()[0];
    return featured ?? CATALOG[0]?.seasons?.[0] ?? null;
  }, []);

  const getEpisodeProgress = (status: 'disponivel' | 'bloqueado' | 'em_breve') => {
    if (status === 'disponivel') return 0.38;
    if (status === 'em_breve') return 0.08;
    return 0;
  };

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[9998] backdrop-blur-md"
          />

          {/* Centring wrapper — não é o alvo de click-outside */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              key="modal"
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{ width: 'min(70vw, 1040px)', height: '70vh' }}
            >
              {/* Header com gradiente */}
              <div className="relative h-56 overflow-hidden">
                {season && (
                  <Image
                    src={season.coverImageUrl}
                    alt={season.title}
                    fill
                    sizes="(max-width: 640px) 92vw, 70vw"
                    className="object-cover"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-black/20" />
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 80% 20%, rgba(0,240,255,0.45) 0%, transparent 52%), radial-gradient(circle at 20% 90%, rgba(139,92,246,0.35) 0%, transparent 55%)',
                  }}
                />
                {/* Botão fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/55 hover:bg-black/75 rounded-full flex items-center justify-center transition-colors border border-white/10"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <p className="text-cyan-200/90 text-xs font-bold uppercase tracking-widest">
                    Temporada {season?.number ?? '—'}
                  </p>
                  <h2 className="text-3xl font-extrabold text-white leading-tight">
                    {season?.title ?? 'Carregando…'}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-200/90">
                    <span className="px-2 py-1 rounded-full bg-black/45 border border-white/10">
                      {season?.episodes?.length ?? 0} episódios
                    </span>
                    <span className="px-2 py-1 rounded-full bg-black/45 border border-white/10">
                      {season?.totalXp ?? 0} XP
                    </span>
                    <span className="px-2 py-1 rounded-full bg-black/45 border border-white/10">
                      Agente {season?.primaryAgent ?? '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Corpo */}
              <div className="p-6 space-y-5 overflow-hidden h-[calc(70vh-14rem)]">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Sinopse</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {season?.synopsis ?? '—'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Episódios</h3>
                  <span className="text-xs text-zinc-400">
                    Progresso por episódio
                  </span>
                </div>

                <div className="space-y-3 overflow-y-auto pr-2 h-full">
                  {(season?.episodes ?? []).map((ep) => {
                    const p = getEpisodeProgress(ep.status);
                    return (
                      <div
                        key={ep.id}
                        className="rounded-xl bg-zinc-950/50 border border-white/10 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
                              E{String(ep.number).padStart(2, '0')} · {ep.type} · {ep.durationMinutes} min · {ep.xpReward} XP
                            </p>
                            <p className="text-sm font-semibold text-white truncate">
                              {ep.title}
                            </p>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                              {ep.description}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border ${
                              ep.status === 'disponivel'
                                ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/25'
                                : ep.status === 'em_breve'
                                  ? 'bg-purple-500/15 text-purple-200 border-purple-400/25'
                                  : 'bg-zinc-700/25 text-zinc-300 border-white/10'
                            }`}
                          >
                            {ep.status === 'disponivel' ? 'Disponível' : ep.status === 'em_breve' ? 'Em breve' : 'Bloqueado'}
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full"
                              style={{ width: `${Math.round(p * 100)}%`, background: '#00F0FF' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/10">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
