"use client";

/**
 * QuantumLeap — Cross-section handoff motion.
 *
 * Purpose: section jump with mission continuity.
 * Trigger: cross-section handoff initiated (handoffPayload !== null).
 * Visual: content blur-out → radial wipe → content blur-in.
 * Duration: motion.leap (600ms).
 * Preserves scroll position and focus via onComplete callback.
 *
 * Uses CSS animations + Web Animations API. No external animation libraries.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  QuantumLeapProps as QuantumLeapPropsSchema,
  QUANTUM_LEAP_TRIGGER,
} from "./_motionContracts";
import { motion, prefersReducedMotion } from "@/design-system/motion";

interface QuantumLeapProps {
  triggerState: boolean;
  destination?: string;
  onComplete?: () => void;
  className?: string;
}

export function QuantumLeap(props: QuantumLeapProps) {
  const {
    triggerState,
    destination,
    onComplete,
    className = "",
  } = props;

  const [phase, setPhase] = useState<"idle" | "blur-out" | "wipe" | "blur-in" | "done">(
    "idle"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduced = prefersReducedMotion();
  const leapMs = reduced ? 0 : parseInt(motion.duration.leap);

  useEffect(() => {
    if (!triggerState) {
      setPhase("idle");
      return;
    }

    // Phase 1: blur-out (0-200ms)
    setPhase("blur-out");

    timerRef.current = setTimeout(() => {
      // Phase 2: radial wipe (200-400ms)
      setPhase("wipe");

      if (wipeRef.current && !reduced) {
        wipeRef.current.animate(
          [
            { clipPath: "circle(0% at 50% 50%)", opacity: "0.3" },
            { clipPath: "circle(100% at 50% 50%)", opacity: "1" },
          ],
          {
            duration: 200,
            easing: motion.easing.leap,
            fill: "forwards",
          }
        );
      }

      timerRef.current = setTimeout(() => {
        // Phase 3: blur-in (400-600ms)
        setPhase("blur-in");
        onComplete?.();

        timerRef.current = setTimeout(() => {
          setPhase("done");
        }, 200);
      }, 200);
    }, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerState, reduced, onComplete]);

  if (!triggerState && phase === "idle") return null;

  return (
    <div
      ref={containerRef}
      className={`quantum-leap quantum-leap--${phase} ${className}`}
      data-testid="quantum-leap"
      data-phase={phase}
      aria-hidden={phase === "done"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        pointerEvents: phase === "done" ? "none" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10, 10, 26, 0.95)",
        transition: `opacity ${leapMs}ms ${motion.easing.leap}`,
        opacity:
          phase === "idle" || phase === "done" ? 0 : phase === "blur-out" ? 1 : 1,
        backdropFilter: phase === "blur-out" || phase === "blur-in"
          ? "blur(8px)"
          : "none",
      }}
    >
      {/* Radial wipe circle */}
      <div
        ref={wipeRef}
        data-testid="quantum-leap-wipe"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.08), rgba(0, 240, 255, 0.02))",
          clipPath: phase === "wipe" ? "circle(0% at 50% 50%)" : "circle(100% at 50% 50%)",
        }}
      />

      {/* Center label */}
      {destination && phase !== "done" && (
        <div
          data-testid="quantum-leap-label"
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
            fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "rgba(0, 240, 255, 0.90)",
            opacity: phase === "blur-out" ? 0 : phase === "wipe" ? 0.5 : 1,
            transition: "opacity 200ms linear",
          }}
        >
          REDIRECIONANDO PARA {destination}
        </div>
      )}

      <style jsx>{`
        @keyframes quantum-leap-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
