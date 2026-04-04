'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Download, Info, Share2, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Agent } from '@/data/agents';
import AgentInfoModal from '@/components/info/AgentInfoModal';

interface BookModalProps { agent: Agent; onClose: () => void; }

const playAudioWithFallback = async (audioUrl: string, text: string) => {
  try {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    await Promise.race([audio.play(), new Promise((_,rej)=>setTimeout(()=>rej('timeout'),3000))]);
    audio.onended = () => { audio.src=''; audio.pause(); };
    return audio;
  } catch (e) {
    console.warn('MP3 falhou, usando TTS:', e);
    if ('speechSynthesis' in window && text) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR'; u.rate = 0.95;
      const voices = speechSynthesis.getVoices();
      const pt = voices.find(v=>v.lang.includes('pt'));
      if (pt) u.voice = pt;
      speechSynthesis.speak(u);
    }
    return null;
  }
};
const stopAudio = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };

export default function BookModal({ agent, onClose }: BookModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key==='Escape') { stopAudio(); onClose(); } };
    document.addEventListener('keydown', handleEscape);
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    return () => { document.removeEventListener('keydown', handleEscape); stopAudio(); };
  }, [onClose]);

  useEffect(() => {
    if (agent?.description && !isMuted) {
      playAudioWithFallback(`/audio/livros/livro-${agent.id}.mp3`, agent.description)
        .then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    return () => { stopAudio(); setIsPlaying(false); };
  }, [agent?.id, agent?.description, isMuted]);

  const togglePlay = () => {
    if (isPlaying) { stopAudio(); setIsPlaying(false); }
    else if (agent?.description) {
      playAudioWithFallback(`/audio/livros/livro-${agent.id}.mp3`, agent.description)
        .then(()=>setIsPlaying(true)).catch(()=>setIsPlaying(false));
    }
  };
  const toggleMute = () => { setIsMuted(!isMuted); if (!isMuted) { stopAudio(); setIsPlaying(false); } else if (agent?.description) playAudioWithFallback(`/audio/livros/livro-${agent.id}.mp3`, agent.description); };

  const levelConfig: Record<string, { glow: string; bg: string }> = {
    Fundamentos: { glow: '#3b82f6', bg: 'from-blue-900/50' },
    Intermediário: { glow: '#22c55e', bg: 'from-green-900/50' },
    Avançado: { glow: '#f97316', bg: 'from-orange-900/50' },
    Mestre: { glow: '#a855f7', bg: 'from-purple-900/50' }
  };
  const config = levelConfig[agent?.level] || levelConfig.Fundamentos;

  return (
    <>
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0,y:20}} transition={{type:"spring",damping:25,stiffness:300}}
          className={`relative w-full max-w-2xl bg-gradient-to-br ${config.bg} to-[#0a0a0f] rounded-3xl border-2 overflow-hidden`}
          style={{ borderColor: config.glow, boxShadow: `0 0 60px ${config.glow}40` }} onClick={(e)=>e.stopPropagation()}>
          <div className="relative p-6 pb-4 border-b border-white/10">
            <div className="absolute inset-0 opacity-20" style={{background:`radial-gradient(ellipse at top,${config.glow}33,transparent 70%)`}}/>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{background:`${config.glow}22`,border:`1px solid ${config.glow}44`,boxShadow:`0 0 0 2px ${config.glow}`}}>
                  <BookOpen className="w-6 h-6" style={{color:config.glow}}/>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{agent?.technicalName}</h2>
                  <p className="text-sm text-purple-300">&quot;{agent?.nickname}&quot;</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full" style={{background:`${config.glow}22`,color:config.glow}}>{agent?.level}</span>
                </div>
              </div>
              <motion.button onClick={onClose} whileHover={{scale:1.1,rotate:90}} whileTap={{scale:0.9}} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" aria-label="Fechar"><X className="w-5 h-5 text-white"/></motion.button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-300 leading-relaxed text-lg">{agent?.description}</p>
            <div className="flex items-center gap-3 pt-2">
              <motion.button onClick={togglePlay} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors" style={{background:isPlaying?`${config.glow}33`:`${config.glow}22`,color:config.glow,border:`1px solid ${config.glow}44`}}>
                {isPlaying?<><span className="w-2 h-2 bg-current rounded-sm animate-pulse"/>Tocando...</>:<><Volume2 className="w-4 h-4"/>Ouvir Explicação</>}
              </motion.button>
              <motion.button onClick={toggleMute} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" aria-label={isMuted?'Ativar som':'Silenciar'}>
                {isMuted?<VolumeX className="w-5 h-5 text-gray-400"/>:<Volume2 className="w-5 h-5 text-white"/>}
              </motion.button>
            </div>
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold transition-all"><BookOpen className="w-4 h-4"/>Explorar Conceito</motion.button>
              <motion.button
                onClick={(e) => { e.stopPropagation(); setInfoOpen(true); }}
                whileHover={{scale:1.02}}
                whileTap={{scale:0.98}}
                title="Mais Informações"
                aria-label="Mais Informações sobre este agente"
                className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Mais Info</span>
              </motion.button>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20"><Download className="w-5 h-5 text-white"/></motion.button>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20"><Share2 className="w-5 h-5 text-white"/></motion.button>
            </div>
          </div>
          <div className="px-6 py-4 bg-black/20 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden" style={{boxShadow:`0 0 0 2px ${config.glow}`}}>
                  {agent?.imageUrl?<img src={agent.imageUrl} alt={agent.nickname} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-white font-bold text-sm" style={{background:`${config.glow}33`}}>{agent?.nickname?.charAt(0)}</div>}
                </div>
                <div><p className="text-xs text-gray-400">Guia da Missão</p><p className="text-white font-medium">{agent?.nickname}</p></div>
              </div>
              <div className="text-right"><p className="text-xs text-gray-400">Tempo estimado</p><p className="text-cyan-400 font-semibold">2-3 min</p></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>

    {/* Modal de Mais Informações (estilo Netflix) */}
    <AgentInfoModal
      agent={agent}
      isOpen={infoOpen}
      onClose={() => setInfoOpen(false)}
    />
    </>
  );
}


