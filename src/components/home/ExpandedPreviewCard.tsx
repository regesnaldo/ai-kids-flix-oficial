'use client';
import { useHoverSound } from '@/hooks/useHoverSound';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { calculateMatch } from '@/hooks/useMatchCalculator';

interface CardProps {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  videoPreview?: string;
  status?: 'new' | 'in-progress' | 'completed' | 'locked';
  progress?: number;
  duration?: string;
  matchPercent?: number;
  userLevel?: number;
  userAffinity?: number;
  tags?: string[];
  href?: string;
}

export default function ExpandedPreviewCard({
  id, title, description, longDescription, image, videoPreview,
  status = 'new', progress = 0, duration, matchPercent,
  userLevel = 1, userAffinity = 50, tags = ['Agente Neural'], href = '#'
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { playHoverSound } = useHoverSound(typeof window !== 'undefined' ? localStorage.getItem('mente-ai-sound') === 'true' : false);
  
  useEffect(() => {
    if (videoPreview && isHovered) {
      const timer = setTimeout(() => setIsVideoReady(true), 300);
      return () => clearTimeout(timer);
    }
    setIsVideoReady(false);
  }, [isHovered, videoPreview]);

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const dynamicMatch = matchPercent ?? calculateMatch(progress, userLevel, userAffinity);

  return (
    <div ref={cardRef} className="group relative w-[200px] h-[300px] cursor-pointer transition-all duration-300 hover:z-50"
         onMouseEnter={() => { if (!isLocked) { setIsHovered(true); playHoverSound(); } }}
         onMouseLeave={() => setIsHovered(false)}
         style={{ transform: isHovered && !isLocked ? 'scale(1.15) translateY(-10px)' : 'scale(1)', 
                  boxShadow: isHovered && !isLocked ? '0 20px 60px rgba(0, 217, 255, 0.35), 0 0 40px rgba(123, 44, 191, 0.2)' : 'none' }}>
      <div className="absolute inset-0 rounded-lg overflow-hidden bg-zinc-900">
        <Image src={image} alt={title} fill className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`} sizes="200px" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold border backdrop-blur-sm flex items-center gap-1 ${isCompleted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : isLocked ? 'bg-zinc-700/30 text-zinc-400 border-white/10' : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'}`}>
          <span>{isLocked ? '🔒' : isCompleted ? '✅' : '✨'}</span>
          <span className="hidden xs:inline">{isLocked ? 'Bloqueado' : isCompleted ? 'Concluído' : 'Novo'}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-md">{title}</h3>
        </div>
      </div>
      <div className={`absolute inset-0 bg-black/95 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300 ${isHovered && !isLocked ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="relative w-full aspect-video bg-zinc-800 overflow-hidden">
          {videoPreview && isVideoReady ? (
            <video src={videoPreview} autoPlay muted={isMuted} loop playsInline className="w-full h-full object-cover" onCanPlay={() => setIsVideoReady(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/30 to-purple-900/30">
              <span className="text-4xl animate-pulse">▶</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          {videoPreview && (
            <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-xs backdrop-blur-sm transition-all">
              {isMuted ? '🔇' : '🔊'}
            </button>
          )}
        </div>
        <div className="px-3 pt-3 pb-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-emerald-400">{dynamicMatch}% Match</span>
          <span className="text-xs text-zinc-400 border border-zinc-600 px-1.5 py-0.5 rounded">18+</span>
          {duration && <span className="text-xs text-zinc-400">{duration}</span>}
          {tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] text-cyan-300/80 font-medium">• {tag}</span>)}
        </div>
        <p className="px-3 pb-3 text-xs text-zinc-300 leading-relaxed line-clamp-3">{longDescription || description}</p>
        <div className="px-3 pb-4 flex items-center gap-2">
          <a href={href} className="flex-1 bg-white text-black font-bold text-xs py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
            <span>▶</span> Play
          </a>
          <button className="w-8 h-8 border-2 border-zinc-500 rounded-full flex items-center justify-center text-zinc-300 hover:border-white hover:text-white transition-colors">+</button>
          <button className="w-8 h-8 border-2 border-zinc-500 rounded-full flex items-center justify-center text-zinc-300 hover:border-white hover:text-white transition-colors">ℹ</button>
        </div>
        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {isLocked && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center">
            <span className="text-3xl mb-2 block">🔒</span>
            <span className="text-xs text-zinc-400 font-medium">Requer Nível</span>
          </div>
        </div>
      )}
    </div>
  );
}




