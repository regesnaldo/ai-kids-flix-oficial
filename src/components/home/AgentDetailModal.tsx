'use client';

/**
 * MENTE.AI — Modal de Detalhes do Agente estilo Netflix
 * src/components/home/AgentDetailModal.tsx
 *
 * Modal expandido com:
 *  - Header com imagem de capa + gradiente
 *  - Categoria, nome, role, descrição longa
 *  - Lista de funcionalidades
 *  - Stats (nível, categoria)
 *  - Botões: Iniciar Interação + Saber Mais
 *  - Fecha com ESC, clique fora, botão X
 */

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Play, TrendingUp, X, Zap } from 'lucide-react';
import type { HomeAgent } from '@/data/all-agents';

interface AgentDetailModalProps {
  agent: HomeAgent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentDetailModal({ agent, isOpen, onClose }: AgentDetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fechar com Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Travar scroll do body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!agent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[400]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Painel ── */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${agent.name}`}
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 28 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed inset-0 m-auto z-[401] w-[calc(100%-2rem)] max-w-4xl h-fit max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header com imagem ── */}
            <div className="relative h-72 w-full overflow-hidden rounded-t-2xl">
              {/* Imagem de capa */}
              <Image
                src={agent.image}
                alt={agent.name}
                fill
                sizes="896px"
                priority
                className="object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />

              {/* Gradiente de fundo colorido (fallback / overlay) */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${agent.color}44 0%, #18181b 100%)`,
                }}
              />

              {/* Fade inferior */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

              {/* Botão fechar */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/90 text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Título sobre a imagem */}
              <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 text-white text-xs font-bold rounded-full"
                    style={{ background: agent.color }}
                  >
                    {agent.category}
                  </span>
                  <span className="px-3 py-1 bg-zinc-700/80 text-zinc-300 text-xs font-semibold rounded-full">
                    {agent.level}
                  </span>
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">{agent.name}</h2>
                <p className="text-lg text-zinc-300 mt-1">{agent.role}</p>
              </div>
            </div>

            {/* ── Conteúdo ── */}
            <div className="p-8 space-y-6">

              {/* Descrição */}
              <div>
                <h3 className="text-base font-bold text-red-500 uppercase tracking-wider mb-2">
                  Sobre o Agente
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {agent.longDescription}
                </p>
              </div>

              {/* Funcionalidades */}
              {agent.features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-red-500 uppercase tracking-wider mb-3">
                    Funcionalidades
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {agent.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                        <span className="mt-0.5 shrink-0 text-red-500">▸</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Brain,       label: 'Nível',       value: agent.level      },
                  { icon: Zap,         label: 'Interações',  value: '1.2k+'          },
                  { icon: TrendingUp,  label: 'Popularidade',value: '95%'            },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-zinc-800 rounded-xl p-4">
                    <Icon className="w-5 h-5 text-red-500 mb-1.5" />
                    <p className="text-zinc-400 text-xs mb-0.5">{label}</p>
                    <p className="text-white font-bold text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/agentes/${agent.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-lg shadow-red-600/25"
                  onClick={onClose}
                >
                  <Play className="w-5 h-5" />
                  Iniciar Interação
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none py-4 px-6 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
