/**
 * ─── ADAPTIVE NARRATIVE DIRECTOR ──────────────────────────────────
 *
 * Suggests narrative paths based on user profile, current agent,
 * decision history, and available transitions.
 *
 * Phase 0: deterministic suggestions based on archetype + agent state.
 * Phase 2: LangChain-powered narrative generation with Tree-of-Thoughts.
 *
 * Rules:
 *   - Components call suggestNarrative(), NEVER import from @/engine/router
 *   - Zero direct calls to LLM from components
 *   - All suggestions go through this director
 */

import { getUserProfile } from "@/engine/profiler";
import { getActiveConflicts, type AgentId } from "./conflicts";
import { findTransition } from "./narrative-transitions";
import type { NarrativeTransition } from "./narrative-transitions";
import { ARCHETYPE_NARRATIVES, type Archetype } from "./archetype-narratives";

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface NarrativeSuggestion {
  /** Descriptive title of the suggested narrative path */
  title: string;

  /** Short description (1-2 sentences) */
  description: string;

  /** Target agent/universe for this path */
  targetAgent: string;

  /** Narrative transition data if applicable */
  transition: NarrativeTransition | null;

  /** Confidence score 0-1 (deterministic in Phase 0) */
  confidence: number;

  /** Whether this is a backtrack or stagnation recovery */
  isRecovery: boolean;

  /** Tags for UI filtering */
  tags: string[];
}

export interface SuggestionRequest {
  userId: number;
  currentAgent: string;
  recentDecisions?: string[];
  context?: string;
}

// ═══════════════════════════════════════════════════════════════════
// ARCHETYPE → AGENT MAPPING
// ═══════════════════════════════════════════════════════════════════

const ARCHETYPE_AGENTS: Record<Archetype, string[]> = {
  analytical: ["nexus", "axiom"],
  rebel: ["kaos", "ethos"],
  paralyzed: ["volt"],
  empathetic: ["terra", "lyra"],
  strategic: ["stratos"],
  creative: ["prism", "aurora"],
};

// ═══════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════

/**
 * Suggest the next narrative path based on the user's profile and state.
 *
 * Phase 0: deterministic — picks from archetype narratives.
 * Phase 2: will use LangChain to generate dynamic suggestions.
 */
export async function suggestNarrative(
  request: SuggestionRequest
): Promise<NarrativeSuggestion[]> {
  const profile = await getUserProfile(request.userId);
  const archetype = (profile?.archetype as Archetype) || "creative";

  const availableAgents = ARCHETYPE_AGENTS[archetype] || ["nexus"];
  const activeConflicts = request.currentAgent
    ? getActiveConflicts([
        ...(request.recentDecisions || []).map((d) => ({
          agentId: (request.currentAgent || "nexus") as AgentId,
          choice: d,
        })),
        { agentId: (request.currentAgent || "nexus") as AgentId, choice: request.context || "" },
      ])
    : [];

  const suggestions: NarrativeSuggestion[] = [];

  // 1. Main narrative based on archetype
  const archetypeNarrative = ARCHETYPE_NARRATIVES[archetype];
  if (archetypeNarrative) {
    suggestions.push({
      title: archetypeNarrative.title,
      description: archetypeNarrative.description,
      targetAgent: availableAgents[0],
      transition: findTransition(request.currentAgent as AgentId, request.context || ""),
      confidence: 0.9,
      isRecovery: false,
      tags: ["archetype", archetype, ...archetypeNarrative.tags],
    });
  }

  // 2. Conflict-based alternative (if active conflicts exist)
  if (activeConflicts.length > 0) {
    const conflicted = activeConflicts[0];
    suggestions.push({
      title: `Resolução: ${conflicted.nature}`,
      description: `Um conflito entre ${conflicted.agents[0]} e ${conflicted.agents[1]} sugere explorar uma nova perspectiva.`,
      targetAgent: availableAgents[availableAgents.length - 1] || "nexus",
      transition: null,
      confidence: 0.7,
      isRecovery: false,
      tags: ["conflict", conflicted.nature],
    });
  }

  // 3. Recovery suggestion for stagnation
  if (request.recentDecisions && request.recentDecisions.length >= 3) {
    const recentUnique = new Set(request.recentDecisions.slice(-3));
    if (recentUnique.size <= 1) {
      const recoveryAgent = availableAgents.find((a) => a !== request.currentAgent) || availableAgents[0];
      suggestions.push({
        title: "Nova Perspectiva",
        description: "Você parece estar em um ciclo. Que tal explorar uma abordagem diferente?",
        targetAgent: recoveryAgent,
        transition: null,
        confidence: 0.85,
        isRecovery: true,
        tags: ["recovery", "stagnation"],
      });
    }
  }

  // 4. Cross-agent discovery (if multiple agents available)
  if (availableAgents.length > 1) {
    const alternativeAgent = availableAgents.find((a) => a !== request.currentAgent);
    if (alternativeAgent) {
      suggestions.push({
        title: `Explorar: ${alternativeAgent.toUpperCase()}`,
        description: `Mude sua perspectiva visitando o agente ${alternativeAgent}.`,
        targetAgent: alternativeAgent,
        transition: null,
        confidence: 0.6,
        isRecovery: false,
        tags: ["discovery", "cross-agent"],
      });
    }
  }

  return suggestions;
}

/**
 * Get the primary suggestion (highest confidence, non-recovery first).
 * Used by the /api/narrative/suggest endpoint to return a single recommendation.
 */
export async function getPrimarySuggestion(
  request: SuggestionRequest
): Promise<NarrativeSuggestion | null> {
  const suggestions = await suggestNarrative(request);
  if (suggestions.length === 0) return null;

  // Prefer non-recovery with highest confidence
  const primary = suggestions
    .filter((s) => !s.isRecovery)
    .sort((a, b) => b.confidence - a.confidence)[0];

  return primary || suggestions[0];
}
