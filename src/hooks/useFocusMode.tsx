'use client';
import { useState, useEffect } from 'react';

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault(); setIsFocusMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return { isFocusMode, setIsFocusMode };
}
export default function FocusModeOverlay({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center">
      <div className="text-center">
        <p className="text-cyan-400 text-lg mb-4 animate-pulse">Modo Foco Ativado</p>
        <p className="text-zinc-400 text-sm">Pressione <kbd className="px-2 py-1 bg-zinc-800 rounded border border-zinc-600">F</kbd> para sair</p>
      </div>
    </div>
  );
}
