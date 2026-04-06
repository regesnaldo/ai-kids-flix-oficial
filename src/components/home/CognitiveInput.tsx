'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const EMOTION_COLORS: Record<string, string> = {
  medo:        '#8B0000',
  curiosidade: '#00BFFF',
  alegria:     '#FFD700',
  raiva:       '#FF4500',
  tristeza:    '#4169E1',
  amor:        '#FF69B4',
  confusao:    '#9370DB',
  esperança:   '#00FA9A',
};

const EMOTION_LABELS: Record<string, string> = {
  medo:        'Medo detectado',
  curiosidade: 'Curiosidade detectada',
  alegria:     'Alegria detectada',
  raiva:       'Raiva detectada',
  tristeza:    'Tristeza detectada',
  amor:        'Amor detectado',
  confusao:    'Confusão detectada',
  esperança:   'Esperança detectada',
};

function detectEmotion(text: string): { color: string; label: string } | null {
  const lower = text.toLowerCase();
  for (const [keyword, color] of Object.entries(EMOTION_COLORS)) {
    if (lower.includes(keyword)) {
      return { color, label: EMOTION_LABELS[keyword] };
    }
  }
  return null;
}

export default function CognitiveInput() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [emotion, setEmotion] = useState<{ color: string; label: string } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    setEmotion(detectEmotion(value));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!message.trim()) return;
    router.push(`/laboratorio?q=${encodeURIComponent(message.trim())}`);
  }, [message, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
      style={{
        filter: emotion
          ? `drop-shadow(0 0 24px ${emotion.color})`
          : 'drop-shadow(0 0 12px rgba(0,217,255,0.3))',
        transition: 'filter 0.4s ease',
      }}
    >
      {emotion && (
        <div
          className="mb-2 text-xs text-center font-semibold uppercase tracking-widest"
          style={{ color: emotion.color }}
        >
          {emotion.label}
        </div>
      )}
      <div
        className="flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          background: 'rgba(10, 10, 20, 0.85)',
          borderColor: emotion?.color ?? 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
          transition: 'border-color 0.4s ease',
        }}
      >
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Fale com o metaverso… tente 'curiosidade' ou 'alegria'"
          className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
