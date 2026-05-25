/**
 * ─── NAVIGATION HINTS — Section Router & Trigger Rules ────────────────────────
 *
 * Maps extracted hints to platform routes with priority threshold rules.
 * Implements the 5x5 connectivity matrix (Home|Series|Blog|Explore|Lab).
 * Contains executable trigger rules that fire based on discovery context.
 */

import type {
  NavigationHint,
  PlatformSection,
  TriggerRule,
  TriggerCondition,
  TriggerAction,
  UnlockType,
} from "./types";
import { PLATFORM_SECTIONS, UNLOCK_TYPES } from "./types";

// ─── SECTION ROUTE MAP ────────────────────────────────────────────────────────

export const SECTION_ROUTES: Record<PlatformSection, string> = {
  home: "/home",
  series: "/series",
  blog: "/blog",
  explore: "/explore",
  lab: "/lab",
};

export const SECTION_LABELS: Record<PlatformSection, string> = {
  home: "Núcleo do Sistema",
  series: "Missões",
  blog: "Arquivos",
  explore: "Cartografia",
  lab: "Núcleo Quântico",
};

// ─── PRIORITY THRESHOLD RULES ─────────────────────────────────────────────────

/**
 * Priority thresholds that determine whether a hint becomes a visible beacon.
 * - Below MIN: hint is stored but NOT shown (silent tracking)
 * - MIN to HIGH: shown as subtle pulse
 * - Above HIGH: shown as urgent pulse
 */
export const PRIORITY_THRESHOLDS = {
  MIN_VISIBLE: 0.4, // Hints below this are invisible (tracked only)
  MODERATE: 0.6, // Shown with subtle pulse
  HIGH: 0.8, // Shown with urgent pulse
} as const;

/**
 * Determines pulse intensity from hint priority.
 */
export function priorityToIntensity(
  priority: number
): "subtle" | "moderate" | "urgent" | null {
  if (priority < PRIORITY_THRESHOLDS.MIN_VISIBLE) return null; // hidden
  if (priority >= PRIORITY_THRESHOLDS.HIGH) return "urgent";
  if (priority >= PRIORITY_THRESHOLDS.MODERATE) return "moderate";
  return "subtle";
}

/**
 * Filters hints to only those that should produce visible beacons.
 */
export function filterVisibleHints(hints: NavigationHint[]): NavigationHint[] {
  return hints.filter(
    (h) => h.priority >= PRIORITY_THRESHOLDS.MIN_VISIBLE
  );
}

// ─── 5x5 CONNECTIVITY MATRIX ──────────────────────────────────────────────────

/**
 * Defines valid cross-section handoff paths and their unlock semantics.
 * Matrix: origin → destination → { reasonTemplate, unlockType, basePriority }
 *
 * Not all connections are equally strong. For example:
 * - LAB → SERIES is a strong connection (experiment → theory)
 * - BLOG → HOME is a weak connection (rarely makes sense)
 */
type ConnectionRule = {
  reasonTemplate: string;
  unlockType: UnlockType;
  basePriority: number;
  enabled: boolean;
};

const CONNECTIVITY_MATRIX: Record<
  PlatformSection,
  Partial<Record<PlatformSection, ConnectionRule>>
> = {
  home: {
    series: {
      reasonTemplate: "Missões disponíveis baseadas no seu perfil",
      unlockType: "mission",
      basePriority: 0.7,
      enabled: true,
    },
    blog: {
      reasonTemplate: "Arquivos com conhecimento fundamental",
      unlockType: "archive",
      basePriority: 0.5,
      enabled: true,
    },
    explore: {
      reasonTemplate: "Territórios inexplorados aguardam",
      unlockType: "territory",
      basePriority: 0.5,
      enabled: true,
    },
    lab: {
      reasonTemplate: "Núcleo Quântico pronto para experimentação",
      unlockType: "experiment",
      basePriority: 0.8,
      enabled: true,
    },
  },
  series: {
    home: {
      reasonTemplate: "Retornar ao Núcleo do Sistema",
      unlockType: "continuation",
      basePriority: 0.3,
      enabled: true,
    },
    blog: {
      reasonTemplate: "Leitura complementar deste módulo nos Arquivos",
      unlockType: "archive",
      basePriority: 0.65,
      enabled: true,
    },
    explore: {
      reasonTemplate: "Conceitos deste módulo mapeados na Cartografia",
      unlockType: "territory",
      basePriority: 0.55,
      enabled: true,
    },
    lab: {
      reasonTemplate: "Experimento prático baseado neste módulo",
      unlockType: "experiment",
      basePriority: 0.85,
      enabled: true,
    },
  },
  blog: {
    home: {
      reasonTemplate: "Retornar ao Núcleo",
      unlockType: "continuation",
      basePriority: 0.2,
      enabled: true,
    },
    series: {
      reasonTemplate: "Missão relacionada a este artigo",
      unlockType: "mission",
      basePriority: 0.6,
      enabled: true,
    },
    explore: {
      reasonTemplate: "Territórios conectados a este conhecimento",
      unlockType: "territory",
      basePriority: 0.5,
      enabled: true,
    },
    lab: {
      reasonTemplate: "Experimente este conceito no Núcleo Quântico",
      unlockType: "experiment",
      basePriority: 0.75,
      enabled: true,
    },
  },
  explore: {
    home: {
      reasonTemplate: "Retornar ao Núcleo",
      unlockType: "continuation",
      basePriority: 0.2,
      enabled: true,
    },
    series: {
      reasonTemplate: "Missão estruturada sobre esta descoberta",
      unlockType: "mission",
      basePriority: 0.7,
      enabled: true,
    },
    blog: {
      reasonTemplate: "Análise detalhada nos Arquivos",
      unlockType: "archive",
      basePriority: 0.55,
      enabled: true,
    },
    lab: {
      reasonTemplate: "Transforme esta descoberta em experimento",
      unlockType: "experiment",
      basePriority: 0.8,
      enabled: true,
    },
  },
  lab: {
    home: {
      reasonTemplate: "Retornar ao Núcleo do Sistema",
      unlockType: "continuation",
      basePriority: 0.3,
      enabled: true,
    },
    series: {
      reasonTemplate: "Base teórica deste experimento em Missões",
      unlockType: "mission",
      basePriority: 0.75,
      enabled: true,
    },
    blog: {
      reasonTemplate: "Descoberta registrada nos Arquivos",
      unlockType: "archive",
      basePriority: 0.7,
      enabled: true,
    },
    explore: {
      reasonTemplate: "Territórios conectados à sua descoberta",
      unlockType: "territory",
      basePriority: 0.65,
      enabled: true,
    },
  },
};

/**
 * Resolve a connection rule from origin → destination.
 * Returns null if the connection is disabled or doesn't exist.
 */
export function getConnectionRule(
  origin: PlatformSection,
  destination: PlatformSection
): ConnectionRule | null {
  const rule = CONNECTIVITY_MATRIX[origin]?.[destination];
  if (!rule || !rule.enabled) return null;
  return rule;
}

/**
 * Get all valid destinations from a given origin section.
 */
export function getValidDestinations(
  origin: PlatformSection
): { section: PlatformSection; rule: ConnectionRule }[] {
  const destinations = CONNECTIVITY_MATRIX[origin] || {};
  return Object.entries(destinations)
    .filter(([_, rule]) => rule.enabled)
    .map(([section, rule]) => ({
      section: section as PlatformSection,
      rule,
    }));
}

// ─── TRIGGER RULES ENGINE ─────────────────────────────────────────────────────

/**
 * Complete trigger rule set.
 * These rules fire based on discovery context and produce navigation actions.
 */
export const TRIGGER_RULES: TriggerRule[] = [
  // ── Discovery-based triggers ────────────────────────────────────────────
  {
    id: "TRIG_001",
    condition: { type: "discovery_tag", match: "rede neural", operator: "contains" },
    action: {
      type: "unlock_beacon",
      target: "series",
      payload: {
        reason: "Módulo de Redes Neurais disponível em Missões",
        unlockType: "mission",
        basePriority: 0.75,
      },
    },
    priority: 8,
    cooldownMs: 3_600_000, // 1 hour
    lastFiredAt: null,
  },
  {
    id: "TRIG_002",
    condition: { type: "discovery_tag", match: "algoritmo", operator: "contains" },
    action: {
      type: "unlock_beacon",
      target: "lab",
      payload: {
        reason: "Algoritmo detectado — experimento prático disponível",
        unlockType: "experiment",
        basePriority: 0.8,
      },
    },
    priority: 9,
    cooldownMs: 3_600_000,
    lastFiredAt: null,
  },
  {
    id: "TRIG_003",
    condition: { type: "discovery_tag", match: "ética", operator: "contains" },
    action: {
      type: "unlock_beacon",
      target: "blog",
      payload: {
        reason: "Análise ética expandida nos Arquivos",
        unlockType: "archive",
        basePriority: 0.65,
      },
    },
    priority: 7,
    cooldownMs: 3_600_000,
    lastFiredAt: null,
  },
  {
    id: "TRIG_004",
    condition: { type: "discovery_tag", match: "dados", operator: "contains" },
    action: {
      type: "unlock_beacon",
      target: "explore",
      payload: {
        reason: "Territórios de dados conectados na Cartografia",
        unlockType: "territory",
        basePriority: 0.55,
      },
    },
    priority: 6,
    cooldownMs: 3_600_000,
    lastFiredAt: null,
  },
  // ── Progression-based triggers ──────────────────────────────────────────
  {
    id: "TRIG_010",
    condition: { type: "progression_score", match: "30", operator: "gte" },
    action: {
      type: "unlock_beacon",
      target: "lab",
      payload: {
        reason: "Progresso suficiente — Núcleo Quântico desbloqueado",
        unlockType: "experiment",
        basePriority: 0.7,
      },
    },
    priority: 7,
    cooldownMs: 7_200_000, // 2 hours
    lastFiredAt: null,
  },
  {
    id: "TRIG_011",
    condition: { type: "progression_score", match: "50", operator: "gte" },
    action: {
      type: "escalate_priority",
      target: "explore",
      payload: {
        reason: "Camada profunda da Cartografia acessível",
        unlockType: "territory",
        basePriority: 0.8,
      },
    },
    priority: 8,
    cooldownMs: 7_200_000,
    lastFiredAt: null,
  },
  // ── Section visit triggers ──────────────────────────────────────────────
  {
    id: "TRIG_020",
    condition: { type: "section_visit", match: "lab", operator: "equals" },
    action: {
      type: "surface_suggestion",
      target: "blog",
      payload: {
        reason: "Concluiu experimento? Registre a descoberta nos Arquivos",
        unlockType: "archive",
        basePriority: 0.5,
      },
    },
    priority: 5,
    cooldownMs: 1_800_000, // 30 minutes
    lastFiredAt: null,
  },
  // ── Agent mention triggers ──────────────────────────────────────────────
  {
    id: "TRIG_030",
    condition: { type: "agent_mention", match: "nexus", operator: "equals" },
    action: {
      type: "unlock_beacon",
      target: "series",
      payload: {
        reason: "NEXUS sugere missão estruturada para você",
        unlockType: "mission",
        basePriority: 0.6,
      },
    },
    priority: 6,
    cooldownMs: 3_600_000,
    lastFiredAt: null,
  },
  {
    id: "TRIG_031",
    condition: { type: "agent_mention", match: "kaos", operator: "equals" },
    action: {
      type: "unlock_beacon",
      target: "lab",
      payload: {
        reason: "KAOS detectou potencial para experimentação caótica",
        unlockType: "experiment",
        basePriority: 0.75,
      },
    },
    priority: 8,
    cooldownMs: 3_600_000,
    lastFiredAt: null,
  },
];

// ─── TRIGGER EVALUATION ───────────────────────────────────────────────────────

/**
 * Evaluate all trigger rules against the current context.
 * Returns actions for rules whose conditions are met and cooldown has expired.
 */
export function evaluateTriggers(context: {
  discoveryTags?: string[];
  currentSection?: PlatformSection;
  progressionScore?: number;
  activeAgentId?: string;
  now?: number;
}): TriggerAction[] {
  const now = context.now ?? Date.now();
  const actions: TriggerAction[] = [];

  for (const rule of TRIGGER_RULES) {
    // Check cooldown
    if (rule.lastFiredAt && now - rule.lastFiredAt < rule.cooldownMs) {
      continue;
    }

    // Evaluate condition
    const met = evaluateCondition(rule.condition, context);
    if (met) {
      actions.push(rule.action);
      rule.lastFiredAt = now; // Update cooldown
    }
  }

  return actions.sort((a, b) => {
    const ruleA = TRIGGER_RULES.find((r) => r.action === a);
    const ruleB = TRIGGER_RULES.find((r) => r.action === b);
    return (ruleB?.priority ?? 0) - (ruleA?.priority ?? 0);
  });
}

function evaluateCondition(
  condition: TriggerCondition,
  context: {
    discoveryTags?: string[];
    currentSection?: PlatformSection;
    progressionScore?: number;
    activeAgentId?: string;
  }
): boolean {
  switch (condition.type) {
    case "discovery_tag": {
      const tags = context.discoveryTags ?? [];
      return tags.some((tag) => {
        if (condition.operator === "contains") {
          return tag.toLowerCase().includes(condition.match.toLowerCase());
        }
        return tag.toLowerCase() === condition.match.toLowerCase();
      });
    }
    case "section_visit": {
      return context.currentSection === condition.match;
    }
    case "progression_score": {
      const score = context.progressionScore ?? 0;
      const threshold = parseFloat(condition.match);
      if (condition.operator === "gte") return score >= threshold;
      if (condition.operator === "lte") return score <= threshold;
      return score === threshold;
    }
    case "agent_mention": {
      return context.activeAgentId === condition.match;
    }
    default:
      return false;
  }
}

// ─── ROUTE RESOLVER ───────────────────────────────────────────────────────────

/**
 * Resolve a section + optional sub-path to a concrete Next.js route.
 */
export function resolveSectionRoute(
  section: PlatformSection,
  subPath?: string
): string {
  const base = SECTION_ROUTES[section];
  if (!subPath) return base;
  return `${base}/${subPath}`;
}

/**
 * Build a NavigationHint from a trigger action.
 */
export function buildHintFromAction(
  action: TriggerAction,
  sourceSection?: PlatformSection
): NavigationHint {
  return {
    section: action.target,
    reason: action.payload.reason,
    priority: action.payload.basePriority,
    unlockType: action.payload.unlockType,
    triggerContext: {
      sourceSection,
    },
  };
}
