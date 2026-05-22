'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface InteractivePause {
  pergunta: string;
  opcoes: [string, string, string];
  continuacoes: [string, string, string];
}

export function InteractivePostSection({
  pause,
  onChoice,
}: {
  pause: InteractivePause;
  onChoice: (idx: number, continuation: string) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [continuation, setContinuation] = useState('');

  const handleChoice = (idx: number) => {
    setSelected(idx);
    const cont = pause.continuacoes[idx];
    setContinuation(cont);
    onChoice(idx, cont);
  };

  return (
    <div className="my-10">
      {/* Pause indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(0,245,255,0.08)',
            border: '1px solid rgba(0,245,255,0.2)',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-cyan)' }}>
          Pausa Interativa
        </span>
      </div>

      {/* Question */}
      <p className="text-white text-lg font-bold mb-4 leading-snug">{pause.pergunta}</p>

      {/* Choices */}
      {selected === null && (
        <div className="space-y-2.5">
          {pause.opcoes.map((opcao, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(i)}
              className="w-full text-left px-4 py-3.5 rounded-lg border text-white/60 text-sm transition-all duration-300"
              style={{
                background: 'var(--dark-card)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3"
                style={{
                  background: 'rgba(0,245,255,0.1)',
                  color: 'var(--accent-cyan)',
                }}
              >
                {['A', 'B', 'C'][i]}
              </span>
              {opcao}
            </motion.button>
          ))}
        </div>
      )}

      {/* Continuation */}
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-lg border"
          style={{
            background: 'var(--dark-card)',
            borderColor: 'rgba(0,245,255,0.15)',
            boxShadow: '0 2px 20px rgba(0,245,255,0.03)',
          }}
        >
          <p className="text-white/70 text-sm leading-relaxed italic">
            &ldquo;{continuation}&rdquo;
          </p>
          <p className="mt-3 text-xs font-bold" style={{ color: 'var(--accent-cyan)' }}>
            +3 XP por participar
          </p>
        </motion.div>
      )}
    </div>
  );
}
