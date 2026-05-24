"use client";

/**
 * ScannerRing — Cinematic scanning indicator.
 *
 * States: idle (dim ring, no rotation), scanning (full brightness, rotating),
 *         complete (green pulse, stops), error (red, frozen)
 *
 * CSS transitions only. No animation libraries.
 */

import React from "react";
import { validateProps } from "./_contracts";
import {
  ScannerRingProps as ScannerRingPropsSchema,
  SCANNER_RING_COLORS,
  SCANNER_RING_LABELS,
  type ScannerRingState,
} from "./_contracts";

interface ScannerRingProps {
  state: ScannerRingState;
  size?: number;
  label?: string;
  className?: string;
}

export function ScannerRing(props: ScannerRingProps) {
  const { state, size = 64, label, className = "" } =
    validateProps(ScannerRingPropsSchema, props);

  const ringColor = SCANNER_RING_COLORS[state];
  const displayLabel = label ?? SCANNER_RING_LABELS[state];
  const isAnimating = state === "scanning";
  const half = size / 2;
  const strokeWidth = Math.max(1.5, size / 32);

  return (
    <div
      className={`scanner-ring scanner-ring--${state} ${className}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        userSelect: "none",
      }}
      data-state={state}
      data-testid="scanner-ring"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        {/* Outer ring */}
        <circle
          cx={half}
          cy={half}
          r={half - strokeWidth}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          style={{
            transition: "stroke 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Inner ring — rotates during scanning */}
        <circle
          cx={half}
          cy={half}
          r={half * 0.6}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth * 0.7}
          strokeDasharray={`${half * 0.6 * Math.PI * 0.75} ${half * 0.6 * Math.PI * 0.25}`}
          style={{
            transition: "stroke 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            animation: isAnimating
              ? "scanner-ring-rotate 800ms linear infinite"
              : "none",
            transformOrigin: `${half}px ${half}px`,
          }}
        />
        {/* Center dot */}
        <circle
          cx={half}
          cy={half}
          r={strokeWidth * 1.5}
          fill={ringColor}
          style={{
            transition: "fill 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms",
            opacity: state === "complete" ? 0 : 1,
          }}
        />
        {/* Error cross — visible only in error state */}
        {state === "error" && (
          <>
            <line
              x1={half - half * 0.3}
              y1={half - half * 0.3}
              x2={half + half * 0.3}
              y2={half + half * 0.3}
              stroke="rgba(239, 68, 68, 0.80)"
              strokeWidth={strokeWidth}
              strokeLinecap="square"
            />
            <line
              x1={half + half * 0.3}
              y1={half - half * 0.3}
              x2={half - half * 0.3}
              y2={half + half * 0.3}
              stroke="rgba(239, 68, 68, 0.80)"
              strokeWidth={strokeWidth}
              strokeLinecap="square"
            />
          </>
        )}
      </svg>

      {/* State label */}
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: ringColor,
          transition: "color 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        data-testid="scanner-ring-label"
      >
        {displayLabel}
      </span>

      <style jsx>{`
        @keyframes scanner-ring-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
