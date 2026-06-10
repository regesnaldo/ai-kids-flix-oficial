// ─── src/components/Aura/AuraField.tsx ─────────────────────────────────────
// FASE 12A — Componente visual da aura (CSS-only, zero dependências)
// Props: color (hex), intensity (1-5), pattern (sereno|eletrico|caotico|etereo)

"use client";

import { memo, type ReactNode } from "react";
import type { AuraIntensity, AuraPattern } from "@/lib/aura/types";
import styles from "./AuraField.module.css";

export interface AuraFieldProps {
  color: string;              // hex, ex: "#5C7C3A"
  intensity: AuraIntensity;   // 1-5
  pattern: AuraPattern;       // "sereno" | "eletrico" | "caotico" | "etereo"
  size?: number;              // px, default 200
  className?: string;
  children?: ReactNode;
}

export const AuraField = memo(function AuraField({
  color,
  intensity,
  pattern,
  size = 200,
  className,
  children,
}: AuraFieldProps) {
  if (intensity === 0) return null;

  const patternClass = styles[pattern] ?? styles.sereno;

  return (
    <div
      className={`${styles.aura} ${patternClass} ${className ?? ""}`}
      style={{
        // @ts-expect-error CSS custom properties
        "--aura-color": color,
        "--aura-size": `${size}px`,
        "--aura-intensity": intensity,
      } as React.CSSProperties}
    >
      <div className={styles.auraInner}>
        {children}
      </div>
    </div>
  );
});
