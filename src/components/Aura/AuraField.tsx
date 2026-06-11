// ─── src/components/Aura/AuraField.tsx ─────────────────────────────────────
// FASE 12A — Componente visual da aura
// CSS variables set via ref.setProperty() (Turbopack compatibility)
"use client";

import { memo, useRef, useEffect, type ReactNode } from "react";

export type AuraIntensity = 1 | 2 | 3 | 4 | 5;
export type AuraPattern = "sereno" | "eletrico" | "caotico" | "etereo";

export interface AuraFieldProps {
  color: string;
  intensity: AuraIntensity;
  pattern: AuraPattern;
  size?: number;
  className?: string;
  children?: ReactNode;
}

export const AuraField = memo(function AuraField({
  color, intensity, pattern, size = 200, className, children,
}: AuraFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--aura-color", color);
    el.style.setProperty("--aura-size", `${size}px`);
    el.style.setProperty("--aura-intensity", String(intensity));
  }, [color, size, intensity]);

  if (intensity === 0) return null;

  return (
    <div
      ref={ref}
      className={`aura-field aura-${pattern} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <div className="aura-inner">{children}</div>
    </div>
  );
});
