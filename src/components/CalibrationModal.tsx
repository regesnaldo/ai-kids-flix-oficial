'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { label: 'Perfil Cognitivo', key: 'profile' },
  { label: 'Objetivos', key: 'goals' },
  { label: 'Estilo de Aprendizagem', key: 'style' },
  { label: 'Configuração Inicial', key: 'config' },
] as const;

/** ─── Step 1: Perfil Cognitivo ─────────────────────────────────────────── */

function StepProfile({ onNext }: { onNext: () => void }) {
  const [level, setLevel] = useState('leigo');
  const [age, setAge] = useState('adults-18');
  const [track, setTrack] = useState('tech');

  return (
    <div className="space-y-5">
      {/* AI Knowledge */}
      <div>
        <label className="text-cyan-300 text-sm font-mono mb-2 block">
          Seu nível de conhecimento em IA
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'leigo', label: 'Leigo', desc: 'Começando agora' },
            { id: 'intermediario', label: 'Intermediário', desc: 'Já estudei um pouco' },
            { id: 'avancado', label: 'Avançado', desc: 'Já programo IA' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLevel(opt.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                level === opt.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-800 border-slate-700 text-zinc-400 hover:border-slate-600'
              }`}
            >
              <p className="text-xs font-bold">{opt.label}</p>
              <p className="text-[10px] mt-0.5 opacity-60">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Age Group */}
      <div>
        <label className="text-cyan-300 text-sm font-mono mb-2 block">
          Faixa etária
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'kids-4-6', label: '4-6 anos' },
            { id: 'kids-7-9', label: '7-9 anos' },
            { id: 'kids-10-12', label: '10-12 anos' },
            { id: 'teens-13', label: '13-17 anos' },
            { id: 'adults-18', label: '18+' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAge(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                age === opt.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200'
                  : 'bg-slate-800 border border-slate-700 text-zinc-400 hover:border-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Track */}
      <div>
        <label className="text-cyan-300 text-sm font-mono mb-2 block">
          Trilha de interesse
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'tech', label: '🖥️ Tecnologia', desc: 'Programação e IA' },
            { id: 'science', label: '🔬 Ciência', desc: 'Pesquisa e dados' },
            { id: 'arts', label: '🎨 Artes', desc: 'Criatividade e design' },
            { id: 'math', label: '📐 Matemática', desc: 'Lógica e padrões' },
            { id: 'philosophy', label: '💭 Filosofia', desc: 'Ética e pensamento' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTrack(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                track === opt.id
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <p className={`text-xs font-bold ${track === opt.id ? 'text-cyan-200' : 'text-zinc-300'}`}>
                {opt.label}
              </p>
              <p className={`text-[10px] mt-0.5 ${track === opt.id ? 'text-cyan-400/70' : 'text-zinc-500'}`}>
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors text-sm"
      >
        Continuar <ArrowRight size={16} />
      </button>
    </div>
  );
}

/** ─── Step 2-4: Placeholder ────────────────────────────────────────────── */

function StepPlaceholder({ label, onNext }: { label: string; onNext: () => void }) {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center">
        <span className="text-2xl">🔮</span>
      </div>
      <p className="text-zinc-400 text-sm">
        {label} será revelado em breve.
      </p>
      <p className="text-zinc-600 text-xs">
        Por enquanto, sua jornada já está configurada com as escolhas do Perfil Cognitivo.
      </p>
      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-cyan-500/20 transition-colors text-sm font-mono"
      >
        <Check size={14} /> Concluir calibração
      </button>
    </div>
  );
}

/** ─── Main Modal ───────────────────────────────────────────────────────── */

export default function CalibrationModal({ isOpen, onClose }: CalibrationModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      onClose();
      setActiveStep(0);
    }
  };

  const progressPct = ((activeStep + 1) / STEPS.length) * 100;

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
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Steps */}
            <div className="flex gap-2 mb-6">
              {STEPS.map((step, i) => (
                <div
                  key={step.key}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    i <= activeStep ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Active step label */}
            <p className="text-cyan-300 text-sm font-mono font-medium mb-4">
              {STEPS[activeStep].label}
            </p>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeStep === 0 && <StepProfile onNext={handleNext} />}
                {activeStep === 1 && <StepPlaceholder label="Objetivos de aprendizado" onNext={handleNext} />}
                {activeStep === 2 && <StepPlaceholder label="Estilo de Aprendizagem" onNext={handleNext} />}
                {activeStep === 3 && <StepPlaceholder label="Configuração Inicial" onNext={handleNext} />}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <p className="text-center text-zinc-600 text-xs mt-6 font-mono">
              ETAPA {activeStep + 1} DE {STEPS.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
