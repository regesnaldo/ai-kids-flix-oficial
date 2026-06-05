// ─── src/hooks/useExplorarFilters.ts ───────────────────────────────────────

"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { filterAgents, type FilterConfig } from "@/services/explorar.service";
import type { HomeAgent } from "@/data/mockAgents";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface ExplorarFilters {
  activeTheme: string | null;
  activeLevel: string | null;
  activeSpecial: string | null;
  search: string;
}

interface UseExplorarFiltersReturn {
  filters: ExplorarFilters;
  setTheme: (slug: string | null) => void;
  setLevel: (slug: string | null) => void;
  setSpecial: (slug: string | null) => void;
  setSearch: (query: string) => void;
  clearFilters: () => void;
  filteredAgents: HomeAgent[];
  activeFilterCount: number;
}

/* ─── Hook ──────────────────────────────────────────────────────────────── */

export function useExplorarFilters(
  agents: HomeAgent[],
  config: FilterConfig
): UseExplorarFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Debounced search
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // Sync URL params
  const syncURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const [activeTheme, setActiveTheme] = useState<string | null>(
    searchParams.get("tema") ?? null
  );
  const [activeLevel, setActiveLevel] = useState<string | null>(
    searchParams.get("nivel") ?? null
  );
  const [activeSpecial, setActiveSpecial] = useState<string | null>(
    searchParams.get("especial") ?? null
  );

  const setTheme = useCallback(
    (slug: string | null) => {
      setActiveTheme((prev) => (prev === slug ? null : slug));
      syncURL({ tema: slug });
    },
    [syncURL]
  );

  const setLevel = useCallback(
    (slug: string | null) => {
      setActiveLevel((prev) => (prev === slug ? null : slug));
      syncURL({ nivel: slug });
    },
    [syncURL]
  );

  const setSpecial = useCallback(
    (slug: string | null) => {
      setActiveSpecial((prev) => (prev === slug ? null : slug));
      syncURL({ especial: slug });
    },
    [syncURL]
  );

  const setSearch = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveTheme(null);
    setActiveLevel(null);
    setActiveSpecial(null);
    setSearchInput("");
    setDebouncedSearch("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const filteredAgents = useMemo(() => {
    const themes = new Set<string>();
    if (activeTheme) themes.add(activeTheme);

    const levels = new Set<string>();
    if (activeLevel) levels.add(activeLevel);

    return filterAgents(agents, {
      themes,
      levels,
      search: debouncedSearch,
    });
  }, [agents, activeTheme, activeLevel, debouncedSearch]);

  const activeFilterCount =
    (activeTheme ? 1 : 0) +
    (activeLevel ? 1 : 0) +
    (activeSpecial ? 1 : 0);

  return {
    filters: { activeTheme, activeLevel, activeSpecial, search: searchInput },
    setTheme,
    setLevel,
    setSpecial,
    setSearch,
    clearFilters,
    filteredAgents,
    activeFilterCount,
  };
}
