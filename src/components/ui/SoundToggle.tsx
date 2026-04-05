'use client';
import { useState, useEffect } from 'react';

export default function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('mente-ai-sound');
    if (saved) setSoundEnabled(JSON.parse(saved));
  }, []);
  const toggle = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem('mente-ai-sound', JSON.stringify(!soundEnabled));
  };
  return (
    <button 
      onClick={toggle} 
      className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-black/60 hover:bg-black/80 border border-cyan-400/30 rounded-full flex items-center justify-center text-cyan-400 backdrop-blur-md transition-all hover:scale-110"
      title={soundEnabled ? 'Desativar som' : 'Ativar som'}
    >
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  );
}