"use client";

/**
 * PulseBeacon — Discovery signal marker.
 *
 * States: subtle, moderate, urgent, hidden
 * Visual: hexagonal marker (no circles, no rounded anything).
 * Frequency increases with urgency.
 *
 * Phase 1 Integration:
 *   - Reads from useNavigationStore().beacons
 *   - Maps beacon.priority → PulseBeaconState (via _contracts mapping)
 *   - onNavigate triggers pushHandoff + router.push via useNavigationStore
 *
 * Usage:
 *   <PulseBeacon
 *     state="urgent"
 *     label="Missões"
 *     subtitle="Módulo 3 — Redes Neurais"
 *     onNavigate={() => router.push("/series")}
 *   />
 */

import React from "react";
import { validateProps } from "./_contracts";
import {
  PulseBeaconProps as PulseBeaconPropsSchema,
  PULSE_BEACON_COLORS,
  PULSE_BEACON_ANIMATION,
  PULSE_BEACON_PREFIXES,
  type PulseBeaconState,
} from "./_contracts";

interface PulseBeaconProps {
  state: PulseBeaconState;
  label: string;
  subtitle?: string;
  onNavigate?: () => void;
  className?: string;
}

export function PulseBeacon(props: PulseBeaconProps) {
  const { state, label, subtitle, onNavigate, className = "" } =
    validateProps(PulseBeaconPropsSchema, props);

  if (state === "hidden") return null;

  const color = PULSE_BEACON_COLORS[state];
  const animDuration = PULSE_BEACON_ANIMATION[state];
  const prefix = PULSE_BEACON_PREFIXES[state];

  const isNavigable = !!onNavigate;
  const size = 12; // hexagon radius

  // Hexagon points for a flat-top hexagon centered at (0,0)
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6; // offset for flat-top
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  const viewBoxSize = size * 2 + 8; // padding for glow

  return (
    <button
      className={`pulse-beacon pulse-beacon--${state} ${className}`}
      data-state={state}
      data-testid="pulse-beacon"
      onClick={isNavigable ? onNavigate : undefined}
      disabled={!isNavigable}
      style={{
        all: "unset",
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 12px",
        cursor: isNavigable ? "pointer" : "default",
        border: `1px solid ${color}`,
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
        background: "rgba(10, 10, 26, 0.70)",
        transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms",
        boxShadow: state === "urgent"
          ? `0 0 10px ${color}44`
          : "none",
        userSelect: "none",
      }}
    >
      {/* Hexagonal pulse marker */}
      <svg
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{
          flexShrink: 0,
          animation: `pulse-beacon-glow ${animDuration} ease-in-out infinite`,
        }}
        data-testid="pulse-beacon-marker"
      >
        {/* Outer glow ring — scales with pulse */}
        <polygon
          points={hexPoints}
          fill="none"
          stroke={color}
          strokeWidth="1"
          transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`}
          style={{
            animation: `pulse-beacon-scale ${animDuration} ease-in-out infinite`,
            transformOrigin: `${viewBoxSize / 2}px ${viewBoxSize / 2}px`,
          }}
        />
        {/* Inner filled hexagon */}
        <polygon
          points={hexPoints}
          fill={color}
          fillOpacity={0.3}
          stroke={color}
          strokeWidth="1.5"
          transform={`translate(${viewBoxSize / 2}, ${viewBoxSize / 2})`}
        />
      </svg>

      {/* Text block */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
        {/* Prefix + label */}
        <span
          data-testid="pulse-beacon-label"
          style={{
            fontFamily: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.92)",
          }}
        >
          {prefix && (
            <span style={{ color, marginRight: "6px", fontSize: "0.6875rem" }}>
              [{prefix}]
            </span>
          )}
          {label}
        </span>

        {/* Subtitle (reason text from Phase 1) */}
        {subtitle && (
          <span
            data-testid="pulse-beacon-subtitle"
            style={{
              fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.50)",
              maxWidth: "220px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      <style>{`
        @keyframes pulse-beacon-scale {
          0%, 100% { transform: translate(${viewBoxSize / 2}px, ${viewBoxSize / 2}px) scale(0.85); }
          50% { transform: translate(${viewBoxSize / 2}px, ${viewBoxSize / 2}px) scale(1.25); }
        }
        @keyframes pulse-beacon-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </button>
  );
}

/** Priority-to-state mapper for Phase 1 integration */
export function priorityToPulseBeaconState(
  priority: number
): PulseBeaconState {
  if (priority <= 0) return "hidden";
  if (priority < 0.4) return "subtle";
  if (priority < 0.6) return "moderate";
  if (priority < 0.8) return "moderate"; // moderate covers 0.4-0.8
  return "urgent"; // 0.8+
}
