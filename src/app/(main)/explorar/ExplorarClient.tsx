// ─── src/app/(main)/explorar/ExplorarClient.tsx ────────────────────────────

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { allAgents } from "@/data/agents";
import { getFilterConfig, getFeaturedAgents } from "@/services/explorar.service";
import { useExplorarFilters } from "@/hooks/useExplorarFilters";
import ExplorarHero from "@/components/explorar/ExplorarHero";
import FilterBar from "@/components/explorar/FilterBar";
import AgentGrid from "@/components/explorar/AgentGrid";
import EmptyState from "@/components/explorar/EmptyState";

/* ─── Inner (needs Suspense for useSearchParams) ─────────────────────────── */

function ExplorarInner() {
  const searchParams = useSearchParams();
  const config = getFilterConfig();
  const featured = getFeaturedAgents(3);
  const searchQuery = searchParams.get("q") ?? "";

  const {
    filters,
    setTheme,
    setLevel,
    setSpecial,
    setSearch,
    clearFilters,
    filteredAgents,
    activeFilterCount,
  } = useExplorarFilters(allAgents, config);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0F172A" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero + Search + Featured */}
        <ExplorarHero
          searchValue={searchQuery || filters.search}
          onSearchChange={setSearch}
          featured={featured}
        />

        {/* Filter Bar */}
        <FilterBar
          config={config}
          activeTheme={filters.activeTheme}
          activeLevel={filters.activeLevel}
          activeSpecial={filters.activeSpecial}
          onThemeChange={setTheme}
          onLevelChange={setLevel}
          onSpecialChange={setSpecial}
          resultCount={filteredAgents.length}
        />

        {/* Results */}
        {filteredAgents.length === 0 ? (
          <EmptyState
            hasFilters={activeFilterCount > 0 || (searchQuery?.length ?? 0) > 0}
            onClearFilters={clearFilters}
            searchQuery={searchQuery || filters.search || undefined}
          />
        ) : (
          <AgentGrid agents={filteredAgents} />
        )}
      </div>
    </div>
  );
}

/* ─── Export (wrapped in Suspense) ──────────────────────────────────────── */

export default function ExplorarClient() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#0F172A" }}
        >
          <div className="text-slate-500 text-sm">Carregando...</div>
        </div>
      }
    >
      <ExplorarInner />
    </Suspense>
  );
}
