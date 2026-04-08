"use client";

import { useEffect, useMemo, useState } from "react";

type WelcomeScreenProps = {
  onNext: () => void;
  onSkip: () => void;
};

type Particle = {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
};

function seededRandom(seed: number, min: number, max: number, decimals = 4): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  const value = min + (max - min) * (x - Math.floor(x));
  return parseFloat(value.toFixed(decimals));
}

export default function WelcomeScreen({ onNext, onSkip }: WelcomeScreenProps) {
  const [loaded, setLoaded] = useState(false);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      left: `${seededRandom(i, 0, 100, 2)}%`,
      top: `${seededRandom(i + 1, 0, 100, 2)}%`,
      animationDelay: `${seededRandom(i + 2, 0, 5, 3)}s`,
      animationDuration: `${seededRandom(i + 3, 3, 7, 3)}s`,
    }));
  }, []);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
            suppressHydrationWarning
          />
        ))}
      </div>

      <div
        className={[
          "relative z-10 text-center text-white px-6 transition-all duration-700",
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        ].join(" ")}
      >
        <div className="mb-8">
          <div className="text-7xl mb-4 animate-pulse">🧠</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-2">MENTE.AI</h1>
          <p className="text-xl text-white/80">Sua jornada de autoconhecimento começa aqui</p>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <p className="text-lg text-white/90 leading-relaxed">
            Conecte-se com <span className="font-semibold text-purple-300">120 agentes</span> de inteligência
            emocional e descubra novas perspectivas sobre você mesmo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNext}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
          >
            Começar Jornada ✨
          </button>
          <button
            onClick={onSkip}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition"
          >
            Ir direto ao Laboratório
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full" />
          <div className="w-3 h-3 bg-white/40 rounded-full" />
          <div className="w-3 h-3 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

