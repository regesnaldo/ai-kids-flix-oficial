"use client";

/**
 * GridOverlay — Cinematic system grid.
 *
 * States:
 *   idle     — subtle grid lines, barely visible
 *   active   — moderate visibility, system is alive
 *   scanning — brightest, pulse animation, system actively processing
 *
 * CSS grid with perspective distortion (subtle 3D tilt).
 * Does NOT block pointer events by default.
 */

import React from "react";
import { validateProps } from "./_contracts";
import {
  GridOverlayProps as GridOverlayPropsSchema,
  GRID_OVERLAY_OPACITY,
  type GridOverlayState,
} from "./_contracts";

interface GridOverlayProps {
  state: GridOverlayState;
  className?: string;
  pointerEvents?: boolean;
}

export function GridOverlay(props: GridOverlayProps) {
  const { state, className = "", pointerEvents = false } =
    validateProps(GridOverlayPropsSchema, props);

  const opacity = GRID_OVERLAY_OPACITY[state];
  const isScanning = state === "scanning";

  return (
    <div
      className={`grid-overlay grid-overlay--${state} ${className}`}
      data-state={state}
      data-testid="grid-overlay"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: pointerEvents ? "auto" : "none",
        zIndex: 1,
        opacity,
        transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      {/* Perspective container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          perspective: "800px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Grid plane — slightly tilted for depth */}
        <div
          style={{
            width: "120%",
            height: "120%",
            marginLeft: "-10%",
            marginTop: "-10%",
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: "rotateX(60deg) translateZ(0)",
            transformOrigin: "center top",
            animation: isScanning
              ? "grid-scan 2s linear infinite"
              : "none",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Horizontal scan line — only in scanning state */}
      {isScanning && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), transparent)",
            animation: "scan-line 3s ease-in-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes grid-scan {
          0% { backgroundPosition: 0 0; }
          100% { backgroundPosition: 0 40px; }
        }
        @keyframes scan-line {
          0%, 100% { top: 10%; opacity: 0; }
          20% { top: 30%; opacity: 1; }
          40% { top: 70%; opacity: 0.5; }
          60% { top: 50%; opacity: 0.8; }
          80% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
