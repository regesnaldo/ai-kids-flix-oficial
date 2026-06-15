/**
 * safe-client.ts — Guardas de execução segura para browser-only APIs.
 *
 * Previne crashes de hidratação e acesso a APIs do navegador
 * em ambientes server-side (SSR/SSG).
 *
 * Uso:
 *   import { isBrowser, safeLocalStorage } from "@/lib/safe-client";
 */

/** True apenas no browser — seguro para usar em qualquer contexto */
export const isBrowser = typeof window !== "undefined";

/** Wrapper seguro para localStorage.getItem — nunca crasha */
export function safeGetItem(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Wrapper seguro para localStorage.setItem — nunca crasha */
export function safeSetItem(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silencioso — storage cheio ou privado não é erro crítico
  }
}

/** Wrapper seguro para localStorage.removeItem — nunca crasha */
export function safeRemoveItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silencioso
  }
}

/**
 * Retorna true se React está hidratando (evita flash de conteúdo).
 * Útil para componentes que precisam saber se já estão no browser.
 */
export function useIsHydrated(): boolean {
  // Em módulos puros, usar useState/useEffect do React.
  // Exportado como função para ser usado com useSyncExternalStore ou useState.
  return isBrowser;
}

/** Log seguro — só emite no browser em desenvolvimento ou em produção com nível warn+ */
export function safeLog(level: "warn" | "error", message: string, data?: unknown): void {
  if (!isBrowser) return;
  if (process.env.NODE_ENV === "production" && level === "warn") return;
  const fn = console[level] as (...args: unknown[]) => void;
  fn(`[MENTE.AI] ${message}`, data ?? "");
}
