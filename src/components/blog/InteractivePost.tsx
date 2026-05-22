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
    <div className="my-8 space-y-4">
      {/* Pause indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.2)' }}>
          <Sparkles size={14} style={{ color: 'var(--neon-cyan)' }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>Pausa Interativa</span>
      </div>

      <p className="text-white text-base font-bold">{pause.pergunta}</p>

      {/* Choices */}
      {selected === null && (
        <div className="space-y-2">
          {pause.opcoes.map((opcao, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01, x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice(i)}
              className="w-full text-left px-4 py-3 rounded-lg border border-white/08 text-gray-300 text-sm hover:text-white hover:border-white/15 transition-all"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3" style={{ background: 'rgba(0,240,255,0.12)', color: 'var(--neon-cyan)' }}>
                {['A', 'B', 'C'][i]}
              </span>
              {opcao}
            </motion.button>
          ))}
        </div>
      )}

      {/* Continuation */}
      {selected !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border border-white/05" style={{ background: 'rgba(0,240,255,0.04)' }}>
          <p className="text-white/80 text-sm leading-relaxed italic">&ldquo;{continuation}&rdquo;</p>
          <p className="text-gray-500 text-[10px] mt-2">+3 XP por participar</p>
        </motion.div>
      )}
    </div>
  );
}
