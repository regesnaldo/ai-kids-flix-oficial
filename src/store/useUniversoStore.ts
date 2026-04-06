import { create } from "zustand";
import type { UniversoId } from "@/data/universos";

interface UniversoStore {
  universoAtivo: UniversoId;
  universosVisitados: UniversoId[];
  setUniversoAtivo: (id: UniversoId) => void;
  marcarVisitado: (id: UniversoId) => void;
  resetar: () => void;
}

const INITIAL_UNIVERSO: UniversoId = "nexus";

export const useUniversoStore = create<UniversoStore>((set) => ({
  universoAtivo: INITIAL_UNIVERSO,
  universosVisitados: [INITIAL_UNIVERSO],

  setUniversoAtivo: (id) =>
    set((state) => ({
      universoAtivo: id,
      universosVisitados: [...new Set([...state.universosVisitados, id])],
    })),

  marcarVisitado: (id) =>
    set((state) => ({
      universosVisitados: [...new Set([...state.universosVisitados, id])],
    })),

  resetar: () => set({ universoAtivo: INITIAL_UNIVERSO, universosVisitados: [INITIAL_UNIVERSO] }),
}));

