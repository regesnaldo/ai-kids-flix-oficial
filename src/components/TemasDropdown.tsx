'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export const TEMAS = [
  { slug: 'ia-generativa', label: 'IA Generativa', icon: '✨', count: 8, badge: 'NOVO', destaque: true },
  { slug: 'machine-learning', label: 'Machine Learning', icon: '🧠', count: 14, badge: null, destaque: true },
  { slug: 'redes-neurais', label: 'Redes Neurais', icon: '⚡', count: 12, badge: null, destaque: true },
  { slug: 'fundamentos', label: 'Fundamentos de IA', icon: '📚', count: 10, badge: null, destaque: false },
  { slug: 'deep-learning', label: 'Deep Learning', icon: '🔬', count: 9, badge: null, destaque: false },
  { slug: 'computer-vision', label: 'Computer Vision', icon: '👁️', count: 6, badge: null, destaque: false },
  { slug: 'nlp', label: 'Processamento de Linguagem', icon: '💬', count: 7, badge: 'NOVO', destaque: false },
  { slug: 'etica-ia', label: 'Ética em IA', icon: '⚖️', count: 5, badge: null, destaque: false },
  { slug: 'ia-criatividade', label: 'IA e Criatividade', icon: '🎨', count: 8, badge: 'NOVO', destaque: false },
  { slug: 'robotica', label: 'Robótica e Automação', icon: '🤖', count: 4, badge: null, destaque: false },
  { slug: 'ia-criancas', label: 'IA para Crianças', icon: '🧒', count: 6, badge: null, destaque: false },
  { slug: 'ia-negocios', label: 'IA nos Negócios', icon: '💼', count: 5, badge: null, destaque: false },
  { slug: 'seguranca', label: 'Segurança e IA', icon: '🔐', count: 4, badge: null, destaque: false },
  { slug: 'futuro-ia', label: 'Futuro da IA', icon: '🚀', count: 7, badge: null, destaque: false },
  { slug: 'projetos', label: 'Projetos Práticos', icon: '🛠️', count: 9, badge: null, destaque: false },
] as const;

export type TemaSlug = (typeof TEMAS)[number]['slug'];

export default function TemasDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const destaque = TEMAS.filter((t) => t.destaque);
  const lista = TEMAS.filter((t) => !t.destaque);

  const go = (slug: string) => {
    router.push(`/explorar?tema=${encodeURIComponent(slug)}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-white text-sm font-medium hover:border-b-2 hover:border-white pb-1"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Temas
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          className="absolute top-full left-0 mt-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl min-w-[600px] p-4 z-50"
          role="menu"
        >
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <p className="text-xs text-zinc-400 uppercase mb-2">EM DESTAQUE</p>
              <div className="bg-zinc-800/60 rounded-lg p-2 mb-4">
                <div className="flex gap-4">
                  {destaque.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => go(t.slug)}
                      className="px-3 py-2 rounded hover:bg-zinc-700 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base w-6">{t.icon}</span>
                        <span className="text-sm text-zinc-200 font-semibold">{t.label}</span>
                        {t.badge ? (
                          <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                            {t.badge}
                          </span>
                        ) : null}
                        <span className="text-xs text-zinc-500">({t.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-400 uppercase mb-2">TEMAS</p>
              <div className="grid grid-cols-2 gap-x-2">
                {lista.map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => go(t.slug)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-zinc-700/60 cursor-pointer text-sm text-zinc-200 transition-colors text-left"
                  >
                    <span className="text-base w-6">{t.icon}</span>
                    <span className="flex-1">{t.label}</span>
                    {t.badge ? (
                      <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                        {t.badge}
                      </span>
                    ) : null}
                    <span className="text-xs text-zinc-500">({t.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

