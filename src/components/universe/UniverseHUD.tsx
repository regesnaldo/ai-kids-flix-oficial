"use client";

/**
 * UniverseHUD — Runtime system status display.
 *
 * Layout:
 *   Top-left:    ScannerRing + "SISTEMA OPERACIONAL"
 *   Top-right:   SignalBars + completed count / 12
 *   Bottom-center: "Territorios: X/12 | Sinais ativos: Y | Camada: Z"
 *
 * All text in operational Portuguese. Zero emojis.
 * Reads progression state — never writes it.
 */

import React from "react";
import { ScannerRing } from "@/components/hud/ScannerRing";
import { SignalBars } from "@/components/hud/SignalBars";
import { tokens } from "@/design-system/tokens";
import { typography, toStyle } from "@/design-system/typography";
import type { PlanetId, ClearanceLevel } from "@/lib/universe/planet-registry";
import { planetRegistry, TOTAL_PLANETS } from "@/lib/universe/planet-registry";
import type { PlayerProgression } from "@/lib/universe/progression-engine";
import { countByState, getUniverseSnapshot } from "@/lib/universe/progression-engine";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface UniverseHUDProps {
  progression: PlayerProgression;
  className?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getHighestClearance(progression: PlayerProgression): string {
  const snapshot = getUniverseSnapshot(progression);
  const clearancePriority: ClearanceLevel[] = ["surface", "deep", "core", "restricted"];

  let highest: ClearanceLevel = "surface";

  for (const [id, state] of Object.entries(snapshot)) {
    if (state === "completed") {
      const planet = planetRegistry[id as PlanetId];
      const idx = clearancePriority.indexOf(planet.clearance);
      const currentIdx = clearancePriority.indexOf(highest);
      if (idx > currentIdx) {
        highest = planet.clearance;
      }
    }
  }

  const labels: Record<ClearanceLevel, string> = {
    surface: "SUPERFÍCIE",
    deep: "PROFUNDO",
    core: "NÚCLEO",
    restricted: "RESTRITO",
  };

  return labels[highest];
}

function getSignalStrength(progression: PlayerProgression): "weak" | "moderate" | "strong" | "urgent" {
  if (progression.totalCompleted === 0) return "weak";
  if (progression.totalCompleted <= 2) return "moderate";
  if (progression.totalCompleted <= 7) return "strong";
  return "urgent";
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function UniverseHUD({ progression, className = "" }: UniverseHUDProps) {
  // Runtime normalization — single point, reused throughout
  const activeHints = Array.isArray(progression?.activeHints)
    ? progression.activeHints
    : [];
  const activePlanet =
    typeof progression?.activePlanet === "string" &&
    progression.activePlanet in planetRegistry
      ? progression.activePlanet
      : null;
  const totalCompleted = typeof progression?.totalCompleted === "number"
    ? progression.totalCompleted
    : 0;

  const normalized: PlayerProgression = {
    ...progression,
    activeHints,
    activePlanet,
    totalCompleted,
  };

  const counts = countByState(normalized);
  const territories = counts.available + counts.active + counts.completed;
  const activeSignals = counts.active + activeHints.length;
  const highestClearance = getHighestClearance(normalized);
  const signalStrength = getSignalStrength(normalized);
  const isScanning = activePlanet !== null;

  return (
    <div
      className={`universe-hud ${className}`}
      data-testid="universe-hud"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: tokens.zIndex.hud,
      }}
    >
      {/* ── Top-left: Scanner + System label ──────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: tokens.spacing.md,
          left: tokens.spacing.md,
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.sm,
        }}
      >
        <ScannerRing
          state={isScanning ? "scanning" : "idle"}
          size={28}
        />
        <span
          style={{
            ...toStyle(typography.classifiedLabel),
            color: tokens.color.text.secondary,
          }}
        >
          SISTEMA OPERACIONAL
        </span>
      </div>

      {/* ── Top-right: Signal + completed count + active planet ────── */}
      <div
        style={{
          position: "absolute",
          top: tokens.spacing.md,
          right: tokens.spacing.md,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: tokens.spacing.micro,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.sm }}>
          <span
            style={{
              ...toStyle(typography.classifiedLabel),
              color: tokens.color.text.tertiary,
            }}
          >
            {totalCompleted}/{TOTAL_PLANETS}
          </span>
          <SignalBars state={signalStrength} />
        </div>

        {activePlanet && (
          <span
            style={{
              ...toStyle(typography.restricted),
              color: planetRegistry[activePlanet].color,
            }}
          >
            {planetRegistry[activePlanet].name}: MISSÃO ATIVA
          </span>
        )}
      </div>

      {/* ── Bottom-center: Territory stats ────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: tokens.spacing.md,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: tokens.spacing.md,
          background: tokens.color.surface.panel,
          border: tokens.border.subtle,
          padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
        }}
      >
        <span
          style={{
            ...toStyle(typography.restricted),
            color: tokens.color.text.secondary,
          }}
        >
          Territórios: {territories}/{TOTAL_PLANETS}
        </span>

        <span
          style={{
            color: tokens.color.text.tertiary,
            fontFamily: typography.fontFamily.mono,
            fontSize: "0.5625rem",
          }}
        >
          |
        </span>

        <span
          style={{
            ...toStyle(typography.restricted),
            color: tokens.color.text.secondary,
          }}
        >
          Sinais ativos: {activeSignals}
        </span>

        <span
          style={{
            color: tokens.color.text.tertiary,
            fontFamily: typography.fontFamily.mono,
            fontSize: "0.5625rem",
          }}
        >
          |
        </span>

        <span
          style={{
            ...toStyle(typography.restricted),
            color:
              highestClearance === "RESTRITO"
                ? tokens.color.text.danger
                : tokens.color.text.secondary,
          }}
        >
          Camada: {highestClearance}
        </span>
      </div>
    </div>
  );
}
