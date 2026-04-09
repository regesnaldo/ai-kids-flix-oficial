'use client';

import { useEffect, useState } from 'react';

interface NarrativeState {
  episodeId: string;
  choiceId: string;
  choiceLabel: string;
  totalVotes: number;
  percentage: number;
}

interface DominantChoice {
  choiceId: string;
  label: string;
  percentage: number;
}

interface GlobalNarrativeWidgetData {
  states: NarrativeState[];
  dominantChoice: DominantChoice | null;
}

export default function GlobalNarrativeWidget() {
  const [data, setData] = useState<GlobalNarrativeWidgetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNarrativeState() {
      try {
        const res = await fetch('/api/narrative/state');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('[GlobalNarrativeWidget] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNarrativeState();
    const interval = setInterval(fetchNarrativeState, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2" />
          <div className="h-3 bg-zinc-800 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!data?.dominantChoice) {
    return (
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4">
          <p className="text-zinc-400 text-sm text-center">
            O metaverso ainda está deciding...
          </p>
        </div>
      </div>
    );
  }

  const { label, percentage } = data.dominantChoice;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative bg-gradient-to-r from-cyan-950/60 via-zinc-900/80 to-purple-950/40 border border-cyan-500/20 rounded-xl p-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 50%, #00F0FF, transparent 60%)' }} />
        
        <div className="relative flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs text-cyan-400/80 font-medium uppercase tracking-wider mb-1">
              O metaverso decidiu
            </p>
            <p className="text-white font-bold text-sm truncate">
              {label}
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <span className="text-2xl font-bold text-cyan-400">{percentage}%</span>
          </div>
        </div>

        <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}