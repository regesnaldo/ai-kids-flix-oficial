'use client';

import { useEffect, useState } from 'react';
// IMPORTAÇÃO RELATIVA:
import { Agent } from '../data/agentsData';

interface HeroBannerProps {
  agent: Agent;
  onRotate?: () => void;
  autoRotate?: boolean;
  interval?: number;
}

const FALLBACK_AGENT: Agent = {
  id: 'ethos',
  name: 'ETHOS',
  role: 'Especialista em Ética & Valores',
  color: '#E50914',
  description: 'Desenvolvendo caráter e valores através da educação',
  tag: 'ÉTICA',
};

export default function HeroBanner({ 
  agent: rawAgent, 
  onRotate, 
  autoRotate = false, 
  interval = 8000 
}: HeroBannerProps) {
  const agent = { ...FALLBACK_AGENT, ...rawAgent };
  
  useEffect(() => {
    if (!autoRotate || !onRotate) return;
    const timer = setInterval(onRotate, interval);
    return () => clearInterval(timer);
  }, [autoRotate, interval, onRotate]);

  return (
    <div 
      className="relative h-[85vh] w-full"
      style={{ 
        backgroundColor: agent.color + '20',
        backgroundImage: `radial-gradient(circle at 80% 30%, ${agent.color}40 0%, transparent 50%)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-[#141414]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
      
      <div className="absolute bottom-[20%] left-4 md:left-12 max-w-2xl z-20">
        <span 
          className="inline-block px-3 py-1 text-xs font-bold tracking-wider rounded-sm mb-4"
          style={{ backgroundColor: agent.color, color: '#fff' }}
        >
          {agent.tag}
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-lg">{agent.name}</h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-4 font-light">{agent.role}</p>
        <p className="text-lg text-gray-300 mb-8 line-clamp-3 leading-relaxed">{agent.description}</p>
        
        <div className="flex gap-4">
          <button className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition">▶ Explorar</button>
          <button className="bg-gray-500/80 text-white px-8 py-3 rounded font-bold hover:bg-gray-500/60 transition backdrop-blur-sm">ℹ Saiba Mais</button>
        </div>
      </div>
    </div>
  );
}
