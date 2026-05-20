"use client";

import { useEffect, useState } from "react";

/**
 * useHydrated — Hook de segurança de hidratação.
 *
 * Retorna `true` apenas após o React hidratar o componente no browser.
 * Use para evitar mismatches de SSR com APIs browser-only.
 *
 * Exemplo:
 *   const hydrated = useHydrated();
 *   if (!hydrated) return <Skeleton />;
 *   return <ComponenteQueUsaLocalStorage />;
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
