/**
 * usePrefersReducedMotion
 * Hook que detecta a preferência do usuário por movimento reduzido (WCAG 2.1 AA).
 * Usado em animações Framer Motion para respeitar acessibilidade.
 */
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    // SSR-safe: retorna false no servidor
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    // Compatibilidade com Safari < 14 (addEventListener vs addListener)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReduced;
}

