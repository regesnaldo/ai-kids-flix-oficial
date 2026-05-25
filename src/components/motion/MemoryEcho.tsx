"use client";

/**
 * MemoryEcho — Contextual callback to a previous discovery.
 *
 * Purpose: reminds user of a past discovery when they revisit lab.
 * Trigger: user revisits lab with existing mission.lastDiscovery.
 * Visual: brief chromatic aberration effect + Portuguese label fade-in.
 * Duration: motion.echo (400ms).
 * Must display Portuguese context label: "Referencia: {lastDiscoveryTag}".
 *
 * Uses CSS animations with text-shadow for chromatic aberration illusion.
 * No external animation libraries.
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, prefersReducedMotion } from "@/design-system/motion";

interface MemoryEchoProps {
  triggerState: boolean;
  discoveryTag?: string;
  onComplete?: () => void;
  className?: string;
}

export function MemoryEcho(props: MemoryEchoProps) {
  const { triggerState, discoveryTag, onComplete, className = "" } = props;

  const [phase, setPhase] = useState<"idle" | "aberration" | "fade" | "done">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduced = prefersReducedMotion();
  const echoMs = reduced ? 0 : parseInt(motion.duration.echo);

  useEffect(() => {
    if (!triggerState) {
      setPhase("idle");
      return;
    }

    // Phase 1: chromatic aberration (0-200ms)
    setPhase("aberration");

    timerRef.current = setTimeout(() => {
      // Phase 2: label fade-in + normalize (200-400ms)
      setPhase("fade");
      onComplete?.();

      timerRef.current = setTimeout(() => {
        setPhase("done");
      }, echoMs);
    }, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerState, reduced, onComplete]);

  if (phase === "idle" || phase === "done" || !discoveryTag) return null;

  const isAberration = phase === "aberration";

  return (
    <div
      className={`memory-echo memory-echo--${phase} ${className}`}
      data-testid="memory-echo"
      data-phase={phase}
      data-discovery={discoveryTag}
      aria-label={`Referencia: ${discoveryTag}`}
      role="status"
      style={{
        position: "fixed",
        bottom: "48px",
        left: "16px",
        zIndex: 50,
        pointerEvents: "none",
        padding: "6px 14px",
        border: "1px solid rgba(168, 85, 247, 0.20)",
        borderLeft: "2px solid rgba(168, 85, 247, 0.50)",
        background: "rgba(10, 10, 26, 0.80)",
        backdropFilter: "blur(8px)",
        opacity: isAberration ? 0 : 1,
        transition: `opacity ${echoMs}ms ease-out`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {/* Portuguese context label */}
        <span
          data-testid="memory-echo-label"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(168, 85, 247, 0.60)",
            // Chromatic aberration: red/blue text-shadow displacement
            textShadow: isAberration
              ? "-1px 0 0 rgba(239, 68, 68, 0.4), 1px 0 0 rgba(0, 240, 255, 0.4)"
              : "none",
            transition: `text-shadow ${echoMs}ms ease-out`,
          }}
        >
          REFERENCIA: {discoveryTag}
        </span>

        {/* Faint temporal marker */}
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.5625rem",
            fontWeight: 400,
            letterSpacing: "0.04em",
            color: "rgba(255, 255, 255, 0.20)",
          }}
        >
          [MEMORIA RECUPERADA]
        </span>
      </div>

      {/* Chromatic aberration overlay ring — visible only during aberration phase */}
      {isAberration && (
        <div
          data-testid="memory-echo-aberration"
          style={{
            position: "absolute",
            inset: "-2px",
            border: "1px solid transparent",
            borderImage:
              "linear-gradient(90deg, rgba(239,68,68,0.20), rgba(0,240,255,0.20)) 1",
            opacity: 0.6,
            animation: `memory-echo-chromatic 200ms ease-out`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes memory-echo-chromatic {
          0% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
