// ─── src/components/Player/PlayerWithAura.tsx ──────────────────────────────
// FASE 12A — Wrapper client que adiciona aura ao Player de episódio
// Usa useAura() + AuraField. Não quebra se aura falhar.
"use client";

import { Suspense, type ReactNode } from "react";
import { useAura } from "@/hooks/useAura";
import { AuraField } from "@/components/Aura/AuraField";

interface Props {
  userId: number | string | null | undefined;
  children: ReactNode;
}

export function PlayerWithAura({ userId, children }: Props) {
  const { aura, isLoading } = useAura(userId);

  // Loading: render com aura neutra
  if (isLoading) {
    return (
      <AuraField color="#3DC0C0" intensity={1} pattern="sereno" size={200}>
        {children}
      </AuraField>
    );
  }

  // Sem aura: render sem AuraField (não quebra)
  if (!aura) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <AuraField
        color={aura.colorHex}
        intensity={aura.intensity}
        pattern={aura.pattern}
        size={200}
      >
        {children}
      </AuraField>
    </Suspense>
  );
}
