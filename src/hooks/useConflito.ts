"use client";

import { useCallback, useState } from "react";
import { useConflitosStore } from "@/store/useConflitosStore";

interface PayloadConflito {
  conflitoId?: string;
  agente1?: string;
  agente2?: string;
  interacoesSemResolucao?: number;
}

export function useConflito() {
  const store = useConflitosStore();
  const [loading, setLoading] = useState(false);

  const avaliar = useCallback(async (payload: PayloadConflito) => {
    setLoading(true);
    try {
      const res = await fetch("/api/conflito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.conflito?.id) store.ativarConflito(data.conflito.id);
      if (data?.intervencaoNecessaria && data?.conflito?.id) {
        store.registrarIntervencaoNexus(data.conflito.id);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, [store]);

  return {
    conflitoAtivoId: store.conflitoAtivoId,
    historicoRespostas: store.historicoRespostas,
    nexusIntervencoes: store.nexusIntervencoes,
    loading,
    avaliar,
    responderConflito: store.responderConflito,
    resolverConflito: store.resolverConflito,
    getPosicoTomada: store.getPosicoTomada,
  };
}

