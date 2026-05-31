/**
 * ─── WATCH PROGRESS — módulo compartilhado de progresso de episódios ──────────
 *
 * Fonte única da verdade para localStorage watch progress.
 * Antes duplicado em: player/page.tsx, aulas/page.tsx, perfil/page.tsx
 */

export type WatchState = { watchedPct: number; completed: boolean; updatedAt: number };

const WATCH_KEY = "mente_ai_watch_progress_v1";

/**
 * Retorna o mapa de progresso de episódios do localStorage.
 * Retorno genérico para compatibilidade com diferentes usos.
 */
export function getWatchMap<T = Record<string, WatchState>>(): T {
  try {
    const raw = globalThis.localStorage?.getItem(WATCH_KEY);
    if (!raw) return {} as T;
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === "object" ? parsed : {}) as T;
  } catch {
    return {} as T;
  }
}

/**
 * Salva o mapa de progresso no localStorage.
 */
export function saveWatchMap(map: Record<string, WatchState>): void {
  try {
    globalThis.localStorage?.setItem(WATCH_KEY, JSON.stringify(map));
  } catch (error) {
    console.error("[MENTE.AI] Error saving watch progress:", error);
  }
}
