"use client";

/**
 * DeepScan — Information retrieval state overlay.
 *
 * Purpose: indicates active scanning / processing.
 * Trigger: LAB state 'scanning' or 'processing' (Phase 3).
 * Visual: horizontal scanline sweep + content desaturation.
 * Duration: motion.scan (800ms per sweep cycle).
 * Overlays on existing content — does NOT replace it.
 *
 * Uses CSS animations. No external animation libraries.
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, prefersReducedMotion } from "@/design-system/motion";

interface DeepScanProps {
  triggerState: boolean;
  statusLabel?: string;
  onComplete?: () => void;
  className?: string;
}

export function DeepScan(props: DeepScanProps) {
  const { triggerState, statusLabel, onComplete, className = "" } = props;

  const [visible, setVisible] = useState(false);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  const reduced = prefersReducedMotion();
  const scanMs = reduced ? 0 : parseInt(motion.duration.scan);
  const scanEasing = reduced ? motion.reduced.easing.scan : motion.easing.scan;

  useEffect(() => {
    if (triggerState && !visible) {
      setVisible(true);
      mountedRef.current = true;
    } else if (!triggerState && visible) {
      // Fade out gracefully
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [triggerState, visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`deep-scan ${className}`}
      data-testid="deep-scan"
      data-active={triggerState ? "true" : "false"}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 35,
        pointerEvents: "none",
        opacity: triggerState ? 1 : 0,
        transition: "opacity 300ms linear",
      }}
    >
      {/* Content desaturation overlay */}
      <div
        data-testid="deep-scan-desaturate"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 15, 45, 0.15)",
          backdropFilter: "saturate(0.3) brightness(0.85)",
          transition: "backdrop-filter 300ms linear",
        }}
      />

      {/* Horizontal scanline */}
      <div
        ref={scanLineRef}
        data-testid="deep-scan-line"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5) 20%, rgba(0, 240, 255, 0.8) 50%, rgba(0, 240, 255, 0.5) 80%, transparent)",
          boxShadow: "0 0 8px rgba(0, 240, 255, 0.25)",
          animation: `deep-scan-sweep ${scanMs}ms ${scanEasing} infinite`,
        }}
      />

      {/* Scan data overlay — bottom-left */}
      {statusLabel && (
        <div
          data-testid="deep-scan-label"
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(0, 240, 255, 0.60)",
            animation: `deep-scan-flicker 2s ${scanEasing} infinite`,
          }}
        >
          {statusLabel}
        </div>
      )}

      {/* Corner brackets — scanning indicator */}
      <div
        data-testid="deep-scan-corners"
        style={{
          position: "absolute",
          inset: "16px",
          border: "none",
          pointerEvents: "none",
        }}
      >
        {/* Top-left corner */}
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "16px",
            height: "16px",
            borderTop: "1px solid rgba(0, 240, 255, 0.30)",
            borderLeft: "1px solid rgba(0, 240, 255, 0.30)",
            animation: "deep-scan-corner-pulse 1.5s ease-in-out infinite",
          }}
        />
        {/* Top-right corner */}
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "16px",
            height: "16px",
            borderTop: "1px solid rgba(0, 240, 255, 0.30)",
            borderRight: "1px solid rgba(0, 240, 255, 0.30)",
            animation: "deep-scan-corner-pulse 1.5s ease-in-out 0.5s infinite",
          }}
        />
        {/* Bottom-left corner */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "16px",
            height: "16px",
            borderBottom: "1px solid rgba(0, 240, 255, 0.30)",
            borderLeft: "1px solid rgba(0, 240, 255, 0.30)",
            animation: "deep-scan-corner-pulse 1.5s ease-in-out 1s infinite",
          }}
        />
        {/* Bottom-right corner */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "16px",
            height: "16px",
            borderBottom: "1px solid rgba(0, 240, 255, 0.30)",
            borderRight: "1px solid rgba(0, 240, 255, 0.30)",
            animation: "deep-scan-corner-pulse 1.5s ease-in-out 1.5s infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes deep-scan-sweep {
          0% { top: 0%; opacity: 0.2; }
          10% { top: 10%; opacity: 1; }
          30% { top: 40%; opacity: 0.8; }
          50% { top: 70%; opacity: 0.6; }
          70% { top: 85%; opacity: 0.4; }
          90% { top: 95%; opacity: 0.15; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes deep-scan-flicker {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes deep-scan-corner-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
