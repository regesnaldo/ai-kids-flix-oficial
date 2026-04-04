'use client';

/**
 * MENTE.AI — Modal estilo Netflix
 * src/components/ui/NetflixModal.tsx
 *
 * Componente base reutilizável para modais com:
 *  - Overlay escuro semitransparente com blur
 *  - Animação de entrada/saída via Framer Motion
 *  - Fechar com Escape, clique fora, ou botão X
 *  - Scroll interno quando conteúdo ultrapassa a altura da tela
 *
 * Uso:
 *   <NetflixModal isOpen={open} onClose={() => setOpen(false)} title="Título">
 *     <p>Conteúdo aqui</p>
 *   </NetflixModal>
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NetflixModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** URL de imagem de capa exibida no topo (opcional) */
  coverUrl?: string;
  /** Cor de acento para o gradiente do header (hex) */
  accentColor?: string;
  /** Largura máxima do modal (default: 42rem / max-w-2xl) */
  maxWidth?: string;
  children: React.ReactNode;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function NetflixModal({
  isOpen,
  onClose,
  title,
  coverUrl,
  accentColor = '#e50914',
  maxWidth = '42rem',
  children,
}: NetflixModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fechar com Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Travar scroll do body enquanto aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            key="nf-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Painel ── */}
          <motion.div
            key="nf-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ maxWidth }}
            className="fixed inset-0 z-[301] m-auto h-fit max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header com imagem de capa ── */}
            <div
              className="relative h-48 w-full overflow-hidden rounded-t-2xl"
              style={{
                background: coverUrl
                  ? undefined
                  : `linear-gradient(135deg, ${accentColor}33 0%, #18181b 100%)`,
              }}
            >
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt=""
                  aria-hidden={true}
                  fill
                  sizes="672px"
                  className="object-cover"
                  priority={false}
                />
              )}

              {/* Gradiente de fade para o conteúdo */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent 30%, #18181b 100%)`,
                }}
              />

              {/* Título sobre a imagem */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-lg">
                  {title}
                </h2>
              </div>

              {/* Botão fechar */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800/90 text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Conteúdo ── */}
            <div className="px-6 py-5 text-white">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
