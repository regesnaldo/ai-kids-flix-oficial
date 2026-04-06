"use client";

import { useMemo } from "react";
import { getUniverso, ORDEM_UNIVERSOS, type UniversoId } from "@/data/universos";
import { useUniversoStore } from "@/store/useUniversoStore";

export function useUniverso() {
  const store = useUniversoStore();

  const universo = useMemo(() => getUniverso(store.universoAtivo), [store.universoAtivo]);

  function irParaUniverso(id: UniversoId) {
    store.setUniversoAtivo(id);
  }

  return {
    universoAtivo: store.universoAtivo,
    universo,
    universosVisitados: store.universosVisitados,
    ordem: ORDEM_UNIVERSOS,
    irParaUniverso,
    resetarUniverso: store.resetar,
  };
}

