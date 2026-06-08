'use client';

import Image from 'next/image';
import { getStoryboardImage } from '@/lib/agents';

export function LandingHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Image
        src={getStoryboardImage('landing-hero')}
        alt="MENTE.AI Universe"
        fill
        className="object-cover"
        priority
        unoptimized
      />
      {/* Overlay escuro para legibilidade do texto */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Conteúdo central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter"
            style={{ textShadow: '0 0 30px rgba(139, 92, 246, 0.8)' }}>
          MENTE.AI
        </h1>
        <p className="mt-4 text-xl text-white/80 max-w-2xl">
          12 agentes. Um universo. Sua jornada começa agora.
        </p>
        <button className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all hover:scale-105"
                style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>
          ENTRAR NO UNIVERSO
        </button>
      </div>
    </section>
  );
}
