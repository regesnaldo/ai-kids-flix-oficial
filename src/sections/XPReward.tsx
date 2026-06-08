'use client';

import Image from 'next/image';
import { getStoryboardImage } from '@/lib/agents';

export function XPReward() {
  return (
    <section className="relative w-full h-96 overflow-hidden">
      <Image
        src={getStoryboardImage('xp-reward')}
        alt="XP e Recompensas"
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-yellow-400"
              style={{ textShadow: '0 0 20px rgba(250, 204, 21, 0.8)' }}>
            +500 XP
          </h3>
          <p className="text-white mt-2">Recompensa desbloqueada!</p>
        </div>
      </div>
    </section>
  );
}
