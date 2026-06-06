'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { label: 'Perfil Cognitivo', active: true },
  { label: 'Objetivos', active: false },
  { label: 'Estilo de Aprendizagem', active: false },
  { label: 'Configuração Inicial', active: false },
];

export default function CalibrationModal({ isOpen, onClose }: CalibrationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg mx-auto bg-[#0a0e27] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold">Calibração Inicial</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Definindo seus parâmetros neurais para personalizar sua jornada.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: '25%' }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                    step.active
                      ? 'bg-cyan-500/20 border-cyan-400'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      step.active ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-slate-600'
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-mono font-medium ${
                        step.active ? 'text-cyan-300' : 'text-zinc-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {step.active ? 'Em andamento...' : 'Aguardando'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-center text-zinc-600 text-xs mt-6 font-mono">
              ETAPA 1 DE 4
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
