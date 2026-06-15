"use client";

/**
 * EchoPulse — System notification edge pulse.
 *
 * Purpose: signals that a new navigation hint was generated while the user
 *          is in another section (or lab is idle).
 * Trigger: newHintWhileAway (beacon count increased since last mount check).
 * Visual: subtle edge light pulse + typography shift.
 * Duration: motion.echo (400ms).
 * Must be dismissible.
 *
 * Uses CSS animations. No external animation libraries.
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, prefersReducedMotion } from "@/design-system/motion";

interface EchoPulseProps {
  triggerState: boolean;
  message?: string;
  onDismiss?: () => void;
  onComplete?: () => void;
  className?: string;
}

export function EchoPulse(props: EchoPulseProps) {
  const {
    triggerState,
    message,
    onDismiss,
    onComplete,
    className = "",
  } = props;

  const [phase, setPhase] = useState<"idle" | "enter" | "visible" | "exit" | "done">("idle");
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduced = prefersReducedMotion();
  const echoMs = reduced ? 0 : parseInt(motion.duration.echo);

  useEffect(() => {
    if (!triggerState || dismissed) {
      if (phase !== "idle") {
        setPhase("exit");
        timerRef.current = setTimeout(() => {
          setPhase("done");
          onComplete?.();
        }, echoMs);
      }
      return;
    }

    // Enter
    setPhase("enter");
    timerRef.current = setTimeout(() => {
      setPhase("visible");
    }, echoMs);

    // Auto-dismiss after 5s if no interaction
    const autoDismiss = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(autoDismiss);
    };
  }, [triggerState, dismissed]);

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  if (phase === "idle" || phase === "done") return null;

  const isEntering = phase === "enter";
  const isExiting = phase === "exit";

  return (
    <div
      className={`echo-pulse echo-pulse--${phase} ${className}`}
      data-testid="echo-pulse"
      data-phase={phase}
      data-dismissed={dismissed ? "true" : "false"}
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "12px",
        right: "12px",
        zIndex: 55,
        maxWidth: "320px",
        padding: "10px 16px",
        // Edge light border — the "pulse" comes from boxShadow animation
        border: "1px solid rgba(0, 240, 255, 0.15)",
        borderLeft: "3px solid rgba(0, 240, 255, 0.60)",
        background: "rgba(10, 10, 26, 0.90)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        opacity: isExiting ? 0 : 1,
        transform: isEntering
          ? "translateX(20px)"
          : isExiting
            ? "translateX(20px)"
            : "translateX(0)",
        transition: `opacity ${echoMs}ms ease-out, transform ${echoMs}ms ${motion.easing.echo}`,
        animation:
          !isEntering && !isExiting
            ? `echo-pulse-glow 3s ease-in-out infinite`
            : "none",
        userSelect: "none",
      }}
      onClick={handleDismiss}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        {/* Left pulse indicator */}
        <span
          data-testid="echo-pulse-indicator"
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            marginTop: "4px",
            borderRadius: "0",
            backgroundColor: "rgba(0, 240, 255, 0.80)",
            clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
            flexShrink: 0,
            animation: `echo-pulse-diamond 2s ease-in-out infinite`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {/* Prefix */}
          <span
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.625rem",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(0, 240, 255, 0.60)",
            }}
          >
            [SINAL DETECTADO]
          </span>

          {/* Message */}
          {message && (
            <span
              data-testid="echo-pulse-message"
              style={{
                fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
                fontSize: "0.8125rem",
                fontWeight: 400,
                lineHeight: "1.4",
                color: "rgba(255, 255, 255, 0.80)",
              }}
            >
              {message}
            </span>
          )}
        </div>

        {/* Dismiss hint */}
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.5625rem",
            color: "rgba(255, 255, 255, 0.25)",
            marginLeft: "auto",
            flexShrink: 0,
            alignSelf: "center",
          }}
        >
          ESC
        </span>
      </div>

      <style jsx>{`
        @keyframes echo-pulse-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(0, 240, 255, 0); }
          50% { box-shadow: 0 0 12px rgba(0, 240, 255, 0.12), 0 0 2px rgba(0, 240, 255, 0.08); }
        }
        @keyframes echo-pulse-diamond {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
