// ─── src/app/(main)/explorar/page.tsx ──────────────────────────────────────
//
// Refactored from monolithic 487-line component to clean architecture:
//   page.tsx (Server) → ExplorarClient.tsx (Client) → hooks + components
//
// Components:  ExplorarHero, FilterBar, AgentGrid, EmptyState
// Hook:        useExplorarFilters (debounce, URL sync)
// Service:     explorar.service.ts (filter config, featured agents)

import ExplorarClient from "./ExplorarClient";

export default function ExplorarPage() {
  return <ExplorarClient />;
}
