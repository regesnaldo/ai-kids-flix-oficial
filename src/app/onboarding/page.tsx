'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { guideAgentId, setGuideAgent } = useUserStore();

  const handleComplete = () => {
    router.push('/laboratorio/simulador');
  };

  const steps = [
    { 
      title: 'Bem-vindo à MENTE.AI', 
      content: 'Sua jornada de autoconhecimento começa aqui. Explore as profundezas da sua consciência com auxílio de inteligência artificial especializada.',
      icon: '🧠'
    },
    { 
      title: 'Crie seu perfil', 
      content: 'Personalize sua experiência para que nossos agentes possam guiar você de forma mais precisa e empática.',
      icon: '👤'
    },
    { 
      title: 'Escolha seu agente guia', 
      content: 'Selecione um dos 120 agentes das 12 Dimensões Mentais para acompanhar sua jornada evolutiva.',
      icon: '🎭',
      component: (
        <div className="grid grid-cols-2 gap-4 mt-8 max-h-[300px] overflow-y-auto p-4 bg-black/20 rounded-2xl border border-white/10">
          {['logos', 'psyche', 'philosophical_primordial_balance', 'emotional_human_order'].map(id => (
            <button
              key={id}
              onClick={() => setGuideAgent(id)}
              className={`p-4 rounded-xl border transition-all ${
                guideAgentId === id 
                ? 'bg-purple-600/40 border-purple-400 ring-2 ring-purple-400' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="font-bold uppercase text-xs tracking-widest">{id.replace(/_/g, ' ')}</p>
            </button>
          ))}
          <button 
            onClick={() => router.push('/agentes')}
            className="col-span-2 p-3 text-sm text-purple-300 hover:text-white transition-colors"
          >
            Ver todos os 120 agentes →
          </button>
        </div>
      )
    },
    { 
      title: 'Tudo pronto!', 
      content: 'Você está prestes a entrar no Laboratório de Inteligência Viva. Prepare-se para uma experiência transformadora.',
      icon: '🧪'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex items-center justify-center overflow-hidden relative">
      {/* Background Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto p-12 text-center text-white z-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="text-6xl mb-6 animate-bounce">{steps[step].icon}</div>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            {steps[step].title}
          </h1>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-8 rounded-full" />
          
          <p className="text-xl text-purple-100 leading-relaxed mb-12 min-h-[100px]">
            {steps[step].content}
          </p>

          {steps[step].component}

          <div className="flex gap-4 justify-center mt-12">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
              >
                Voltar
              </button>
            )}
            <button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleComplete();
                }
              }}
              disabled={step === 2 && !guideAgentId}
              className={`px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold shadow-lg shadow-purple-500/20 ${
                step === 2 && !guideAgentId ? 'opacity-50 cursor-not-allowed grayscale' : ''
              }`}
            >
              {step < steps.length - 1 ? 'Continuar' : 'Começar Jornada'}
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 flex justify-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-purple-400' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
