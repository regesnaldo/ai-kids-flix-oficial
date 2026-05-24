"use client";

/**
 * MissionOrbit — SVG orbital connection renderer.
 *
 * Renders orbital paths between planets based on progression state.
 *
 * Rules:
 *   - Solid line: both planets discovered (one available/active/completed)
 *   - Dashed line: undiscovered territory connection
 *   - Animated dash-offset: active missions only
 *   - SignalBars at midpoint for active connections
 *
 * Reads state from progression — never writes.
 */

import React from "react";
import { planetRegistry, type PlanetId } from "@/lib/universe/planet-registry";
import type { PlayerProgression } from "@/lib/universe/progression-engine";
import { calculatePlanetState } from "@/lib/universe/progression-engine";
import { tokens } from "@/design-system/tokens";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface OrbitConnection {
  from: PlanetId;
  to: PlanetId;
}

interface MissionOrbitProps {
  /** Pairs of planets to draw orbits between */
  connections: OrbitConnection[];
  progression: PlayerProgression;
  /** Positions of planets in the viewport (for SVG coordinates) */
  positions: Record<PlanetId, { x: number; y: number }>;
  width: number;
  height: number;
  className?: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getLineStyle(
  fromId: PlanetId,
  toId: PlanetId,
  progression: PlayerProgression
): {
  strokeDasharray: string;
  strokeDashoffset: string;
  animation: string;
  strokeWidth: number;
  opacity: number;
  color: string;
} {
  const fromState = calculatePlanetState(fromId, progression);
  const toState = calculatePlanetState(toId, progression);

  const bothDiscovered =
    fromState !== "undiscovered" && toState !== "undiscovered";
  const isActive = fromState === "active" || toState === "active";

  // Active: animated solid line
  if (isActive) {
    const activePlanet = fromState === "active" ? fromId : toId;
    return {
      strokeDasharray: "6 3",
      strokeDashoffset: "0",
      animation: "orbit-dash-move 1s linear infinite",
      strokeWidth: 1.5,
      opacity: 0.7,
      color: planetRegistry[activePlanet].color,
    };
  }

  // Both discovered: solid thin line
  if (bothDiscovered) {
    return {
      strokeDasharray: "none",
      strokeDashoffset: "0",
      animation: "none",
      strokeWidth: 0.5,
      opacity: 0.25,
      color: "rgba(0, 240, 255, 0.25)",
    };
  }

  // Undiscovered: dashed, very dim
  return {
    strokeDasharray: "2 6",
    strokeDashoffset: "0",
    animation: "none",
    strokeWidth: 0.5,
    opacity: 0.08,
    color: "rgba(255, 255, 255, 0.08)",
  };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function MissionOrbit({
  connections,
  progression,
  positions,
  width,
  height,
  className = "",
}: MissionOrbitProps) {
  return (
    <svg
      className={`mission-orbit ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: tokens.zIndex.grid,
        overflow: "visible",
      }}
      data-testid="mission-orbit"
    >
      <defs>
        {/* Glow filter for active orbits */}
        <filter id="orbit-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map(({ from, to }) => {
        const fromPos = positions[from];
        const toPos = positions[to];

        if (!fromPos || !toPos) return null;

        const style = getLineStyle(from, to, progression);
        const isActive = style.animation !== "none";

        // Midpoint for SignalBars placement
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;

        return (
          <g key={`${from}-${to}`}>
            {/* Orbital line */}
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={style.color}
              strokeWidth={style.strokeWidth}
              strokeDasharray={style.strokeDasharray}
              strokeDashoffset={style.strokeDashoffset}
              opacity={style.opacity}
              filter={isActive ? "url(#orbit-glow)" : undefined}
              style={{
                animation: style.animation,
              }}
            />

            {/* Active: SignalBars at midpoint (simplified as colored dot) */}
            {isActive && (
              <circle
                cx={midX}
                cy={midY}
                r={3}
                fill={style.color}
                opacity={0.8}
                style={{
                  animation: "orbit-pulse 2s ease-in-out infinite",
                }}
              />
            )}
          </g>
        );
      })}

      {/* Keyframe definitions */}
      <style>{`
        @keyframes orbit-dash-move {
          to { stroke-dashoffset: -9; }
        }
        @keyframes orbit-pulse {
          0%, 100% { opacity: 0.3; r: 3; }
          50% { opacity: 0.8; r: 4; }
        }
      `}</style>
    </svg>
  );
}
