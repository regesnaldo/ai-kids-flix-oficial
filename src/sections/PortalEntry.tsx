'use client';

import Image from 'next/image';
import { getStoryboardImage } from '@/lib/agents';

export function PortalEntry() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Image
        src={getStoryboardImage('universe-entry')}
        alt="Portal para o Universo"
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-white/90 text-lg animate-pulse">
          Atravesse o portal...
        </p>
      </div>
    </section>
  );
}
