'use client';

import { useEffect, useState } from 'react';

interface PresenceBadgeProps {
  universeId: string;
}

export default function PresenceBadge({ universeId }: PresenceBadgeProps) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPresence() {
      try {
        const res = await fetch(`/api/universe/${encodeURIComponent(universeId)}/presence`);
        const json = await res.json();
        setCount(json.activeCount ?? 0);
      } catch (error) {
        console.error('[PresenceBadge] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (universeId) {
      fetchPresence();
      const interval = setInterval(fetchPresence, 30000);
      return () => clearInterval(interval);
    }
  }, [universeId]);

  if (loading || count === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900/60 border border-zinc-700/50">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-xs text-zinc-300 font-medium">
        {count} explorador{count !== 1 ? 'es' : ''} aqui
      </span>
    </div>
  );
}