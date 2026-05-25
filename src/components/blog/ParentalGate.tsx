'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

export function ParentalGate({
  ageRating,
  onUnlock,
}: {
  ageRating: string;
  onUnlock: () => void;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (ageRating === 'all') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, validates against parent_controls table
    if (pin.length === 6) {
      onUnlock();
    } else {
      setError('PIN deve ter 6 dígitos');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(5,5,16,0.95)', backdropFilter: 'blur(8px)' }}>
      <div className="text-center max-w-sm px-8">
        <Lock size={40} className="mx-auto mb-4" style={{ color: 'var(--accent-cyan)' }} />
        <h2 className="text-white text-xl font-bold mb-2">Conteúdo +{ageRating === 'teen' ? '12' : '18'}</h2>
        <p className="text-gray-400 text-sm mb-6">
          Este conteúdo é para maiores de {ageRating === 'teen' ? '12' : '18'} anos.
          Peça ao seu responsável para liberar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(''); }}
            placeholder="PIN do responsável"
            className="w-full text-center px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-lg tracking-[0.3em] focus:outline-none focus:border-white/20"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-bold transition"
            style={{ background: 'var(--accent-cyan)', color: '#050510' }}
          >
            Liberar Conteúdo
          </button>
        </form>
      </div>
    </div>
  );
}
