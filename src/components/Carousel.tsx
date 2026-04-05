'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
// IMPORTAÇÃO RELATIVA:
import { Agent } from '../data/agentsData';

interface CarouselProps {
  title: string;
  agents: Agent[];
}

export default function Carousel({ title, agents }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!agents || agents.length === 0) return null;

  return (
    <div className="mb-8 px-4 md:px-12 group/carousel">
      <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-4">{title}</h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group/card relative flex-shrink-0 w-[200px] md:w-[240px] aspect-video rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:z-10"
            >
              <div className="absolute inset-0" style={{ backgroundColor: agent.color }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 text-white">
                <p className="font-bold text-sm">{agent.name}</p>
                <p className="text-[10px] opacity-80">{agent.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
