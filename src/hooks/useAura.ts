// ÔöÇÔöÇÔöÇ src/hooks/useAura.ts ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
// FASE 12A ÔÇö Hook React para consumir a aura do usu├írio
// Usa useEffect + fetch simples. Revalida a cada 5 minutos.

"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuraState } from "@/lib/aura/types";
import { useAuraSync } from "@/lib/aura/apply-css";

interface UseAuraResult {
  aura: AuraState | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAura(userId: number | string | null | undefined): UseAuraResult {
  const [aura, setAura] = useState<AuraState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza aura com o DOM automaticamente
  useAuraSync(aura);

  const fetchAura = useCallback(() => {
    if (!userId) {
      setAura(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/aura/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAura(data);
      })
      .catch((err) => {
        setError(err.message);
        setAura(null);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchAura();

    // Revalida a cada 5 minutos
    const interval = setInterval(fetchAura, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAura]);

  return { aura, isLoading, error, refetch: fetchAura };
}
