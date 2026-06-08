'use client';

import Image from 'next/image';
import { getStoryboardImage } from '@/lib/agents';

export function Episodes() {
  return (
    <section className="relative min-h-screen bg-black py-20">
      <div className="absolute inset-0">
        <Image
          src={getStoryboardImage('episode-logos')}
          alt="Episódios"
          fill
          className="object-cover opacity-40"
          unoptimized
        />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          TEMPORADA 1
        </h2>
        {/* Cards de episódios aqui */}
      </div>
    </section>
  );
}
