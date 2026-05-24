"use client";

/**
 * PlanetNode — Runtime UI adapter for a single planet.
 *
 * Reads planet config from registry and progression state from the engine.
 * NEVER writes state. NEVER hardcodes planet behavior.
 *
 * Visual states:
 *   undiscovered — dim, no glow, label hidden, hover feedback
 *   available    — subtle pulse, PulseBeacon orbit, "SINAL DETECTADO"
 *   active       — strong glow, ScannerRing, SignalBars, "MISSÃO EM ANDAMENTO"
 *   completed    — gold glow, ClassificationTag "DOMINADO"
 */

import React, { useCallback } from "react";
import { planetRegistry, type PlanetId, type PlanetState } from "@/lib/universe/planet-registry";
import type { PlayerProgression } from "@/lib/universe/progression-engine";
import { calculatePlanetState } from "@/lib/universe/progression-engine";
import { ScannerRing } from "@/components/hud/ScannerRing";
import { SignalBars } from "@/components/hud/SignalBars";
import { ClassificationTag } from "@/components/hud/ClassificationTag";
import { tokens } from "@/design-system/tokens";
import { typography, toStyle } from "@/design-system/typography";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface PlanetNodeProps {
  planetId: PlanetId;
  progression: PlayerProgression;
  onActivate?: (planetId: PlanetId) => void;
  className?: string;
}

// ─── STATE → LABEL MAPPING ────────────────────────────────────────────────────

const STATE_LABELS: Record<PlanetState, string> = {
  undiscovered: "",
  available: "SINAL DETECTADO",
  active: "MISSÃO EM ANDAMENTO",
  completed: "DOMINADO",
};

const STATE_HOVER_TEXT: Record<PlanetState, string> = {
  undiscovered: "COORDENADAS AINDA NÃO REVELADAS",
  available: "SINAL DETECTADO — CLIQUE PARA ATIVAR",
  active: "MISSÃO EM ANDAMENTO",
  completed: "TERRITÓRIO DOMINADO",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function PlanetNode({
  planetId,
  progression,
  onActivate,
  className = "",
}: PlanetNodeProps) {
  const planet = planetRegistry[planetId];
  const state = calculatePlanetState(planetId, progression);

  const handleClick = useCallback(() => {
    if (state === "available" && onActivate) {
      onActivate(planetId);
    }
  }, [state, planetId, onActivate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && state === "available" && onActivate) {
        e.preventDefault();
        onActivate(planetId);
      }
    },
    [state, planetId, onActivate]
  );

  const isInteractive = state === "available" || state === "active";

  // ── Visual properties per state ────────────────────────────────

  const glowIntensity: Record<PlanetState, string> = {
    undiscovered: "none",
    available: `0 0 6px ${planet.color}22`,
    active: `0 0 16px ${planet.color}44, 0 0 32px ${planet.color}22`,
    completed: "0 0 12px rgba(245, 158, 11, 0.30)",
  };

  const nodeOpacity: Record<PlanetState, number> = {
    undiscovered: 0.15,
    available: 0.85,
    active: 1,
    completed: 0.9,
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div
      className={`planet-node planet-node--${planetId} planet-node--${state} ${className}`}
      data-planet-id={planetId}
      data-state={state}
      data-clearance={planet.clearance}
      data-testid={`planet-node-${planetId}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : "presentation"}
      tabIndex={isInteractive ? 0 : -1}
      aria-label={STATE_HOVER_TEXT[state]}
      title={STATE_HOVER_TEXT[state]}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: tokens.spacing.xs,
        cursor: state === "available" ? "pointer" : state === "active" ? "default" : "not-allowed",
        opacity: nodeOpacity[state],
        transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 500ms",
        padding: tokens.spacing.sm,
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* ── Planet orb ──────────────────────────────────────────── */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "2px",
          // clipPath for sharp geometric aesthetic
          clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
          backgroundColor: planet.color,
          boxShadow: glowIntensity[state],
          transition: "box-shadow 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
        }}
      >
        {/* Active: ScannerRing overlay */}
        {state === "active" && (
          <div
            style={{
              position: "absolute",
              inset: "-12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScannerRing state="scanning" size={72} />
          </div>
        )}
      </div>

      {/* ── Planet name ──────────────────────────────────────────── */}
      <span
        style={{
          ...toStyle(typography.classifiedLabel),
          color:
            state === "undiscovered"
              ? tokens.color.text.tertiary
              : state === "completed"
                ? "rgba(245, 158, 11, 0.85)"
                : planet.color,
          textAlign: "center",
          transition: "color 500ms",
        }}
      >
        {planet.name}
      </span>

      {/* ── Subtitle ─────────────────────────────────────────────── */}
      <span
        style={{
          ...toStyle(typography.micro),
          color: tokens.color.text.tertiary,
          textAlign: "center",
          display: state === "undiscovered" ? "none" : "block",
          maxWidth: "120px",
        }}
      >
        {planet.subtitle}
      </span>

      {/* ── State indicator ──────────────────────────────────────── */}
      {state !== "undiscovered" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.micro,
            minHeight: "20px",
          }}
        >
          {/* Active: SignalBars */}
          {state === "active" && <SignalBars state="strong" />}

          {/* Completed: ClassificationTag */}
          {state === "completed" && (
            <ClassificationTag
              state="highlighted"
              clearance={planet.clearance}
              label={STATE_LABELS[state]}
            />
          )}

          {/* Available: state label */}
          {state === "available" && (
            <span
              style={{
                ...toStyle(typography.restricted),
                color: planet.color,
              }}
            >
              {STATE_LABELS[state]}
            </span>
          )}
        </div>
      )}

      {/* ── Undiscovered hover tooltip ──────────────────────────── */}
      {state === "undiscovered" && (
        <span
          style={{
            ...toStyle(typography.micro),
            color: tokens.color.text.tertiary,
            textAlign: "center",
            opacity: 0,
            transition: "opacity 300ms",
            position: "absolute",
            bottom: "-24px",
            width: "140px",
          }}
          className="planet-node-tooltip"
        >
          {STATE_HOVER_TEXT[state]}
        </span>
      )}
    </div>
  );
}
