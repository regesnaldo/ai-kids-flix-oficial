"use client";

/**
 * SignalAcquisition — Discovery moment motion.
 *
 * Purpose: visually marks a discovery / beacon acquisition.
 * Trigger: beacon priority >= 0.8 OR mission node unlocked.
 * Visual: geometric flash (hexagon/diamond) + border glow expansion.
 * Duration: motion.pulse (2000ms).
 * Must NOT block interaction — pointerEvents: none throughout.
 *
 * Uses CSS animations + SVG geometry. No external animation libraries.
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, prefersReducedMotion } from "@/design-system/motion";

interface SignalAcquisitionProps {
  triggerState: boolean;
  shape?: "diamond" | "hexagon";
  label?: string;
  onComplete?: () => void;
  className?: string;
}

// Hexagon points for a flat-top hex centered at (0,0) with given radius
function hexPoints(radius: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = (radius * Math.cos(angle)).toFixed(2);
    const y = (radius * Math.sin(angle)).toFixed(2);
    return `${x},${y}`;
  }).join(" ");
}

// Diamond points (rotated square)
function diamondPoints(radius: number): string {
  const r = radius * 0.85;
  return `${0},${-r} ${r},${0} ${0},${r} ${-r},${0}`;
}

export function SignalAcquisition(props: SignalAcquisitionProps) {
  const {
    triggerState,
    shape = "hexagon",
    label,
    onComplete,
    className = "",
  } = props;

  const [phase, setPhase] = useState<"idle" | "flash" | "glow" | "fade" | "done">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduced = prefersReducedMotion();
  const pulseMs = reduced ? 0 : parseInt(motion.duration.pulse);

  useEffect(() => {
    if (!triggerState) {
      setPhase("idle");
      return;
    }

    // Phase: flash in (0-200ms)
    setPhase("flash");

    timerRef.current = setTimeout(() => {
      // Phase: glow expansion (200-1400ms)
      setPhase("glow");

      timerRef.current = setTimeout(() => {
        // Phase: fade out (1400-2000ms)
        setPhase("fade");
        onComplete?.();

        timerRef.current = setTimeout(() => {
          setPhase("done");
        }, 600);
      }, 1200);
    }, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerState, reduced, onComplete]);

  if (phase === "idle" || phase === "done") return null;

  const viewBoxSize = 120;
  const radius = 40;
  const points = shape === "hexagon" ? hexPoints(radius) : diamondPoints(radius);
  const center = viewBoxSize / 2;

  const isFlash = phase === "flash";
  const isGlow = phase === "glow";
  const isFade = phase === "fade";

  return (
    <div
      ref={containerRef}
      className={`signal-acquisition signal-acquisition--${phase} ${className}`}
      data-testid="signal-acquisition"
      data-shape={shape}
      data-phase={phase}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 45,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isFade ? 0 : 1,
        transition: `opacity ${reduced ? "0ms" : "600ms"} ease-out`,
      }}
    >
      <svg
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{
          filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))",
          animation: isFlash
            ? `signal-acq-flash 200ms ease-out`
            : isGlow
              ? `signal-acq-pulse ${reduced ? "0ms" : "1.5s"} ease-in-out infinite`
              : "none",
        }}
        data-testid="signal-acquisition-svg"
      >
        {/* Outer glow ring — expands during glow phase */}
        <polygon
          points={points}
          fill="none"
          stroke="rgba(168, 85, 247, 0.50)"
          strokeWidth="1.5"
          transform={`translate(${center}, ${center})`}
          style={{
            animation: isGlow
              ? `signal-acq-expand ${reduced ? "0ms" : "1.5s"} ease-out infinite`
              : "none",
            transformOrigin: `${center}px ${center}px`,
          }}
        />
        {/* Inner filled shape */}
        <polygon
          points={points}
          fill="rgba(168, 85, 247, 0.25)"
          stroke="rgba(168, 85, 247, 0.80)"
          strokeWidth="2"
          transform={`translate(${center}, ${center})`}
        />
      </svg>

      {/* Label */}
      {label && (
        <div
          data-testid="signal-acquisition-label"
          style={{
            position: "absolute",
            bottom: "15%",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(168, 85, 247, 0.85)",
            animation: `signal-acq-text ${reduced ? "0ms" : "1s"} ease-out`,
          }}
        >
          [AQUISIÇÃO] {label}
        </div>
      )}

      <style jsx>{`
        @keyframes signal-acq-flash {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes signal-acq-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes signal-acq-expand {
          0% { transform: translate(${center}px, ${center}px) scale(0.8); opacity: 0.8; }
          100% { transform: translate(${center}px, ${center}px) scale(2.5); opacity: 0; }
        }
        @keyframes signal-acq-text {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
