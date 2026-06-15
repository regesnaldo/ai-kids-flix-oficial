// ─── src/components/explorar/EmptyState.tsx ─────────────────────────────────

"use client";

import { SearchX } from "lucide-react";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  searchQuery?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function EmptyState({
  hasFilters,
  onClearFilters,
  searchQuery,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
        <SearchX size={28} className="text-slate-500" />
      </div>

      {searchQuery ? (
        <>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Nada encontrado para &quot;{searchQuery}&quot;
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Tente usar termos diferentes ou limpar os filtros.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Nenhum agente encontrado
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Os filtros atuais não retornaram resultados. Tente combiná-los de outra forma.
          </p>
        </>
      )}

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="mt-6 px-5 py-2.5 text-sm font-medium text-violet-300 bg-violet-600/10 border border-violet-500/20 rounded-lg hover:bg-violet-600/20 transition"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
