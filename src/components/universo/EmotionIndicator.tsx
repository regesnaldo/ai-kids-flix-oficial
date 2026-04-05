'use client';

/**
 * EmotionIndicator — Exibe o estado emocional detectado de forma sutil
 * Aparece discretamente no canto da interface durante a conversa
 */

import { useEffect, useState } from 'react';
import type { EmotionResult } from '@/lib/voice/hume';

interface EmotionIndicatorProps {
  emotion: EmotionResult | null;
  visible?: boolean;
}

const EMOTION_CONFIG: Record<
  EmotionResult['category'],
  { emoji: string; label: string; color: string; bgColor: string }
> = {
  curious:  { emoji: '🔍', label: 'Curioso',      color: 'text-sky-300',    bgColor: 'bg-sky-900/60' },
  positive: { emoji: '✨', label: 'Entusiasmado', color: 'text-emerald-300', bgColor: 'bg-emerald-900/60' },
  anxious:  { emoji: '💭', label: 'Pensativo',    color: 'text-amber-300',   bgColor: 'bg-amber-900/60' },
  negative: { emoji: '⚡', label: 'Frustrado',    color: 'text-orange-300',  bgColor: 'bg-orange-900/60' },
  neutral:  { emoji: '🌊', label: 'Calmo',        color: 'text-slate-300',   bgColor: 'bg-slate-900/60' },
};

export default function EmotionIndicator({ emotion, visible = true }: EmotionIndicatorProps) {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (emotion && visible) {
      setFadeOut(false);
      setShow(true);

      // Sumir após 4 segundos
      const t = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 500);
      }, 4000);

      return () => clearTimeout(t);
    }
  }, [emotion, visible]);

  if (!show || !emotion) return null;

  const cfg = EMOTION_CONFIG[emotion.category];
  const confidence = Math.round(emotion.dominant.score * 100);

  return (
    <div
      className={[
        'flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm',
        'border border-white/10 text-xs transition-all duration-500',
        cfg.bgColor,
        cfg.color,
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
      ].join(' ')}
      title={`NEXUS detectou: ${emotion.dominant.name} (${confidence}%)`}
    >
      <span className="text-base leading-none">{cfg.emoji}</span>
      <span className="font-medium">{cfg.label}</span>
      <span className="opacity-50 text-[10px]">{confidence}%</span>
    </div>
  );
}
