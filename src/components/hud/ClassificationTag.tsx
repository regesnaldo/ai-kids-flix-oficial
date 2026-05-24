"use client";

/**
 * ClassificationTag — Clearance-level label.
 *
 * States:
 *   default     — muted, background tag
 *   highlighted — brighter, draws attention
 *   archived    — dimmed, crossed-out appearance
 *
 * Clearance levels (color + Portuguese label):
 *   surface     — SUPERFÍCIE (slate)
 *   deep        — PROFUNDO (cyan)
 *   core        — NÚCLEO (purple)
 *   restricted  — RESTRITO (red)
 */

import React from "react";
import { validateProps } from "./_contracts";
import {
  ClassificationTagProps as ClassificationTagPropsSchema,
  CLASSIFICATION_TAG_CLEARANCE_COLORS,
  CLASSIFICATION_TAG_CLEARANCE_LABELS,
  type ClassificationTagState,
} from "./_contracts";

interface ClassificationTagProps {
  state: ClassificationTagState;
  clearance: "surface" | "deep" | "core" | "restricted";
  label: string;
  className?: string;
}

export function ClassificationTag(props: ClassificationTagProps) {
  const { state, clearance, label, className = "" } =
    validateProps(ClassificationTagPropsSchema, props);

  const borderColor = CLASSIFICATION_TAG_CLEARANCE_COLORS[clearance];
  const clearanceLabel = CLASSIFICATION_TAG_CLEARANCE_LABELS[clearance];

  const stateOpacity: Record<ClassificationTagState, number> = {
    default: 0.7,
    highlighted: 1,
    archived: 0.35,
  };

  const opacity = stateOpacity[state];

  return (
    <div
      className={`classification-tag classification-tag--${state} classification-tag--${clearance} ${className}`}
      data-state={state}
      data-clearance={clearance}
      data-testid="classification-tag"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "2px 8px",
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${borderColor}`,
        clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)",
        background: "rgba(10, 10, 26, 0.60)",
        opacity,
        transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms",
        textDecoration: state === "archived" ? "line-through" : "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {/* Clearance level dot */}
      <span
        data-testid="classification-tag-dot"
        style={{
          width: "4px",
          height: "4px",
          backgroundColor: borderColor,
          display: "inline-block",
          flexShrink: 0,
        }}
      />

      {/* Label text */}
      <span
        data-testid="classification-tag-label"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: `rgba(255, 255, 255, ${0.7 * opacity})`,
        }}
      >
        {label}
      </span>

      {/* Clearance indicator */}
      <span
        data-testid="classification-tag-clearance"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.5625rem",
          fontWeight: 400,
          letterSpacing: "0.1em",
          color: borderColor,
          opacity: 0.7,
          marginLeft: "2px",
        }}
      >
        {clearanceLabel}
      </span>
    </div>
  );
}
