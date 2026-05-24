"use client";

/**
 * ActionNode — Geometric interaction node.
 *
 * States:
 *   locked   — muted slate, lock icon, no click handler
 *   unlocked — cyan border, glow, accepts onClick
 *   active   — bright cyan, stronger glow, indicates current focus
 *   completed — purple, check indicator
 *
 * Zero rounded corners. Sharp angles only.
 */

import React from "react";
import { validateProps } from "./_contracts";
import {
  ActionNodeProps as ActionNodePropsSchema,
  ACTION_NODE_COLORS,
  ACTION_NODE_LOCKED_LABEL,
  type ActionNodeState,
} from "./_contracts";

interface ActionNodeProps {
  state: ActionNodeState;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function ActionNode(props: ActionNodeProps) {
  const { state, label, onClick, className = "" } =
    validateProps(ActionNodePropsSchema, props);

  const color = ACTION_NODE_COLORS[state];
  const isInteractive = state !== "locked";
  const displayLabel = state === "locked" ? ACTION_NODE_LOCKED_LABEL : label;

  return (
    <button
      className={`action-node action-node--${state} ${className}`}
      data-state={state}
      data-testid="action-node"
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      style={{
        // Reset browser button styles
        all: "unset",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        cursor: isInteractive ? "pointer" : "not-allowed",
        // Geometric node: zero radius, border-based
        border: `1px solid ${color}`,
        borderTop: `2px solid ${color}`,
        background: "rgba(10, 10, 26, 0.85)",
        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms",
        boxShadow: state === "active"
          ? `0 0 12px ${color}33, inset 0 0 8px ${color}11`
          : state === "completed"
            ? `0 0 8px ${color}22`
            : "none",
        opacity: state === "locked" ? 0.4 : 1,
        userSelect: "none",
      }}
    >
      {/* Left indicator — lock or check */}
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: "0.6875rem",
        color,
        letterSpacing: "0.08em",
        lineHeight: 1,
      }}>
        {state === "locked" && "◆"}
        {state === "unlocked" && "◇"}
        {state === "active" && "◆"}
        {state === "completed" && "✓"}
      </span>

      {/* Label */}
      <span
        data-testid="action-node-label"
        style={{
          fontFamily: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
          fontSize: "0.8125rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          color: state === "locked"
            ? "rgba(148, 163, 184, 0.50)"
            : "rgba(255, 255, 255, 0.92)",
          transition: "color 300ms",
        }}
      >
        {displayLabel}
      </span>
    </button>
  );
}
