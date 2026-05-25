"use client";

/**
 * SignalBars — Signal strength indicator.
 *
 * States: weak, moderate, strong, urgent, lost
 *
 * 4 vertical bars that fill progressively. Colors go from cold (cyan, weak)
 * to hot (purple, urgent) to dead (red, lost).
 *
 * Maps to priority values from Phase 1:
 *   0.0-0.4 → weak
 *   0.4-0.6 → moderate
 *   0.6-0.8 → strong
 *   0.8+    → urgent
 */

import React from "react";
import { validateProps } from "./_contracts";
import {
  SignalBarsProps as SignalBarsPropsSchema,
  SIGNAL_BARS_COLORS,
  SIGNAL_BARS_FILLED,
  SIGNAL_BARS_LABELS,
  type SignalBarsState,
} from "./_contracts";

interface SignalBarsProps {
  state: SignalBarsState;
  className?: string;
}

export function SignalBars(props: SignalBarsProps) {
  const { state, className = "" } =
    validateProps(SignalBarsPropsSchema, props);

  const color = SIGNAL_BARS_COLORS[state];
  const filled = SIGNAL_BARS_FILLED[state];
  const label = SIGNAL_BARS_LABELS[state];

  // Bar heights: each bar taller than the last (classic signal indicator)
  const barHeights = [0.3, 0.5, 0.7, 1.0];
  const barWidth = 3;

  return (
    <div
      className={`signal-bars signal-bars--${state} ${className}`}
      data-state={state}
      data-testid="signal-bars"
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap: "2px",
        height: "16px",
        userSelect: "none",
      }}
      title={label}
    >
      {barHeights.map((scale, i) => {
        const isFilled = i < filled;
        const height = Math.round(16 * scale);

        return (
          <span
            key={i}
            data-testid={`signal-bar-${i}`}
            data-filled={isFilled ? "true" : "false"}
            style={{
              display: "inline-block",
              width: `${barWidth}px`,
              height: `${height}px`,
              backgroundColor: isFilled ? color : "rgba(255, 255, 255, 0.06)",
              transition: "background-color 400ms cubic-bezier(0.4, 0, 0.2, 1), height 400ms",
              clipPath: state === "lost"
                ? "none"
                : `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - ${i * 1}px))`,
            }}
          />
        );
      })}

      {/* Label (visible on hover or focus) */}
      <span
        data-testid="signal-bars-label"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.5625rem",
          fontWeight: 400,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: state === "lost"
            ? "rgba(239, 68, 68, 0.70)"
            : "rgba(255, 255, 255, 0.50)",
          marginLeft: "6px",
          lineHeight: "16px",
          transition: "color 400ms",
        }}
      >
        {label}
      </span>
    </div>
  );
}
