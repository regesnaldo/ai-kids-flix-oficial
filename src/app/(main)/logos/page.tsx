'use client';

import { useEffect } from 'react';
import LogosOracle from '@/components/logos/LogosOracle';
import { useAppStore } from '@/store/useAppStore';

export default function LogosPage() {
  const setLogosActive = useAppStore((s) => s.setLogosActive);

  useEffect(() => {
    // Activate LOGOS in full-page mode with a default context
    setLogosActive(true, 'Conteúdo do LOGOS — modo full-page');

    return () => {
      // Cleanup: deactivate LOGOS when leaving the page
      setLogosActive(false);
    };
  }, [setLogosActive]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: '#0a0a1a' }}
    >
      <LogosOracle />
    </div>
  );
}
