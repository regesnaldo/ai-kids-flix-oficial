'use client';
import { useEffect, useRef } from 'react';
export function useHoverSound(enabled: boolean = false) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTime = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => { audioContextRef.current?.close(); };
  }, [enabled]);
  const playHoverSound = () => {
    if (!enabled || !audioContextRef.current) return;
    const now = Date.now(); if (now - lastPlayTime.current < 300) return; lastPlayTime.current = now;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    oscillator.connect(gainNode); gainNode.connect(audioContextRef.current.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContextRef.current.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.03, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.15);
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.15);
  };
  return { playHoverSound };
}
