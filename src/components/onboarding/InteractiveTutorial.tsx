"use client";

import { useEffect, useState } from "react";

type TutorialStep = {
  title: string;
  description: string;
  visual: string;
  tip?: string;
};

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "1. Expresse seu Estado",
    description: "Digite como você se sente no Laboratório. Seja sincero — não há julgamentos aqui.",
    visual: "✍️",
    tip: "Use palavras que descrevam sua emoção atual",
  },
  {
    title: "2. Conecte com seu Agente",
    description: "Seu agente guia analisa sua expressão e oferece uma perspectiva única para reflexão.",
    visual: "🤝",
    tip: "Cada agente tem uma abordagem diferente",
  },
  {
    title: "3. Receba Insights",
    description: "Veja conexões emocionais, acompanhe sua evolução e volte quando quiser para continuar.",
    visual: "💡",
    tip: "Volte diariamente para manter sua consistência",
  },
];

type InteractiveTutorialProps = {
  onComplete: () => void;
};

export default function InteractiveTutorial({ onComplete }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 30000;
    const interval = 100;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) setCurrentStep((s) => s + 1);
    else onComplete();
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Tutorial</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center text-white mb-8">
          <div className="text-7xl mb-6 animate-bounce">{step.visual}</div>
          <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
          <p className="text-lg text-white/90 mb-6">{step.description}</p>
          {step.tip && (
            <div className="bg-purple-600/30 border border-purple-500/50 rounded-xl p-4">
              <p className="text-sm text-purple-200">💡 {step.tip}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={[
                  "w-3 h-3 rounded-full transition",
                  index === currentStep ? "bg-white" : "bg-white/40",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold hover:scale-105 transition"
          >
            {currentStep < TUTORIAL_STEPS.length - 1 ? "Próximo →" : "Começar Agora! ✨"}
          </button>
        </div>

        <div className="text-center mt-6">
          <button onClick={onComplete} className="text-white/60 hover:text-white/90 text-sm transition">
            Pular tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

