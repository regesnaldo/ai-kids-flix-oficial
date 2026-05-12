'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

type JourneyPayload = {
  archetype: string;
  recommended: string;
  visited: string[];
  dimensions: {
    emotional: number;
    intellectual: number;
    moral: number;
  };
};

const universeOrder = ['NEXUS', 'VOLT', 'STRATOS', 'KAOS', 'ETHOS', 'LYRA', 'AURORA', 'TERRA', 'AXIOM', 'CIPHER', 'JANUS', 'PRISM'];

function toPercent(score: number): number {
  const normalized = ((score + 10) / 20) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

export default function JourneyDashboard() {
  const [data, setData] = useState<JourneyPayload | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/home/journey', { cache: 'no-store' })
      .then((res) => res.json())
      .then((payload: JourneyPayload) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) {
          setData({
            archetype: 'creative',
            recommended: 'NEXUS',
            visited: [],
            dimensions: { emotional: 0, intellectual: 0, moral: 0 },
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const progress = useMemo(() => {
    if (!data) return { emotional: 50, intellectual: 50, moral: 50 };
    return {
      emotional: toPercent(data.dimensions.emotional),
      intellectual: toPercent(data.dimensions.intellectual),
      moral: toPercent(data.dimensions.moral),
    };
  }, [data]);

  return (
    <section className="mt-10 rounded-2xl border border-white/10 bg-[#0d1028]/90 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Your Journey Map</h2>
          <p className="text-xs text-white/55">Progressão adaptativa entre universos</p>
        </div>
        <div className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
          Your current archetype: <span className="font-semibold uppercase">{data?.archetype ?? 'creative'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {universeOrder.map((universe) => {
          const visited = data?.visited.includes(universe) ?? false;
          const recommended = data?.recommended === universe;
          return (
            <div
              key={universe}
              className={`rounded-lg border px-2 py-2 text-center text-xs ${visited ? 'border-cyan-300/50 bg-cyan-400/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/10 bg-white/5 text-white/50'}`}
            >
              <div className="flex items-center justify-center gap-1">
                {visited && <CheckCircle2 className="h-3.5 w-3.5" />}
                <span>{universe}</span>
              </div>
              {recommended && <div className="mt-1 text-[10px] text-amber-300">Next stop</div>}
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        {[
          ['D1 Emotional', progress.emotional],
          ['D2 Intellectual', progress.intellectual],
          ['D3 Moral', progress.moral],
        ].map(([label, value]) => (
          <div key={label as string}>
            <div className="mb-1 flex justify-between text-xs text-white/70">
              <span>{label as string}</span>
              <span>{value as number}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-[linear-gradient(90deg,var(--cognitive-primary),var(--cognitive-secondary))]" style={{ width: `${value as number}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
