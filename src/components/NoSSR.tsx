'use client';

import { useEffect, useState } from 'react';

/**
 * NoSSR — renderiza children APENAS no cliente.
 * Usado para isolar componentes Three.js/WebGL do server render do Next.js.
 */
export default function NoSSR({ children, fallback = null }: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}
