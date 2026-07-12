"use client";

import { useState } from "react";
import type { NarrativeSuggestion } from "@/engine/adaptive-router";

/**
 * ─── NARRATIVE SUGGESTION CARD ─────────────────────────────────────
 *
 * Neon-lit card that displays an adaptive narrative suggestion.
 * Used in the Nexus Cosmos HUD to offer the player narrative paths.
 *
 * Direction: cyber-black theme, monospace typography, cyan/purple glow.
 * Animação: slide-up com fade-in ao montar.
 *
 * Props:
 *   suggestion: NarrativeSuggestion from adaptive-router
 *   onSelect: callback when user clicks "Explorar"
 *   index: card position (for staggered animation delay)
 */

interface NarrativeSuggestionCardProps {
  suggestion: NarrativeSuggestion;
  onSelect: (targetAgent: string) => void;
  index?: number;
  variant?: "default" | "homeBanner";
}

export default function NarrativeSuggestionCard({
  suggestion,
  onSelect,
  index = 0,
  variant = "default",
}: NarrativeSuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const confidenceLabel =
    suggestion.confidence >= 0.8
      ? "alta"
      : suggestion.confidence >= 0.5
        ? "média"
        : "baixa";

  const confidenceColor =
    suggestion.confidence >= 0.8
      ? "var(--neon-green)"
      : suggestion.confidence >= 0.5
        ? "var(--neon-orange)"
        : "var(--neon-pink)";

  const tagColors: Record<string, string> = {
    archetype: "var(--neon-cyan)",
    conflict: "var(--neon-purple)",
    recovery: "var(--neon-orange)",
    discovery: "var(--neon-blue)",
  };

  return (
    <div
      className={`narrative-card ${variant === "homeBanner" ? "narrative-card--home-banner" : ""}`}
      style={{
        animation: `fadeIn 0.4s ease-out ${index * 0.08}s both`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Glow line on top */}
      <div
        className="narrative-card-glow"
        style={{ backgroundColor: confidenceColor }}
      />

      <div className="narrative-card-body">
        {/* Header: title + confidence badge */}
        <div className="narrative-card-header">
          <h3 className="narrative-card-title">{suggestion.title}</h3>
          <span
            className="narrative-card-badge"
            style={{
              color: confidenceColor,
              borderColor: confidenceColor,
            }}
          >
            {confidenceLabel}
          </span>
        </div>

        {/* Description */}
        <p className="narrative-card-description">{suggestion.description}</p>

        {/* Meta row */}
        <div className="narrative-card-meta">
          <span className="narrative-card-tag">
            alvo: {suggestion.targetAgent.toUpperCase()}
          </span>
          {suggestion.isRecovery && (
            <span className="narrative-card-tag narrative-card-tag--recovery">
              recuperação
            </span>
          )}
        </div>

        {/* Tags (collapsible) */}
        {expanded && suggestion.tags.length > 0 && (
          <div className="narrative-card-tags animate-fadeIn">
            {suggestion.tags.map((tag) => (
              <span
                key={tag}
                className="narrative-card-tag-item"
                style={{
                  backgroundColor: `${tagColors[tag] || "var(--neon-cyan)"}22`,
                  color: tagColors[tag] || "var(--neon-cyan)",
                  borderColor: `${tagColors[tag] || "var(--neon-cyan)"}44`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action button */}
        {suggestion.transition && (
          <div className="narrative-card-transition-info">
            <span className="narrative-card-tag">
              transição: {suggestion.transition.visualEffect}
            </span>
          </div>
        )}

        <button
          className="narrative-card-button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(suggestion.targetAgent);
          }}
        >
          EXPLORAR → {suggestion.targetAgent.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
