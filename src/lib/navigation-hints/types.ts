/**
 * ─── NAVIGATION HINTS — Type System & Zod Schemas ───────────────────────────
 *
 * Core type definitions for the navigationHints engine.
 * Every AI response can carry navigation directives that orchestrate
 * platform-wide discovery without breaking immersion.
 *
 * NAV tag format embedded in AI responses (stripped before user sees them):
 *   [NAV:section:human-readable-reason:priority]
 *
 * Example: [NAV:lab:Experimento pronto sobre redes neurais:0.9]
 */

import { z } from "zod";

// ─── Section Identifiers ──────────────────────────────────────────────────────

export const PLATFORM_SECTIONS = [
  "home",
  "series",
  "blog",
  "explore",
  "lab",
] as const;

export type PlatformSection = (typeof PLATFORM_SECTIONS)[number];

// ─── Unlock Types ─────────────────────────────────────────────────────────────

export const UNLOCK_TYPES = [
  "discovery", // New content found
  "experiment", // Lab experiment available
  "mission", // Series episode ready
  "territory", // Explore node revealed
  "archive", // Blog article relevant
  "continuation", // Resume in-progress mission
] as const;

export type UnlockType = (typeof UNLOCK_TYPES)[number];

// ─── Navigation Hint ──────────────────────────────────────────────────────────

export const NavigationHintSchema = z.object({
  section: z.enum(PLATFORM_SECTIONS),
  reason: z.string().min(3).max(120),
  priority: z.number().min(0).max(1),
  missionContinuityId: z.string().optional(),
  unlockType: z.enum(UNLOCK_TYPES),
  triggerContext: z
    .object({
      sourceSection: z.enum(PLATFORM_SECTIONS).optional(),
      sourceAgentId: z.string().optional(),
      discoveryTag: z.string().optional(),
    })
    .optional(),
});

export type NavigationHint = z.infer<typeof NavigationHintSchema>;

// ─── Navigation Hint Bundle ───────────────────────────────────────────────────

/** What the API returns alongside the AI response */
export const NavigationHintBundleSchema = z.object({
  hints: z.array(NavigationHintSchema).max(5),
  extractedAt: z.number(),
  sourceResponseLength: z.number(),
  dominantSection: z.enum(PLATFORM_SECTIONS).optional(),
});

export type NavigationHintBundle = z.infer<typeof NavigationHintBundleSchema>;

// ─── Mission State ────────────────────────────────────────────────────────────

export interface MissionNode {
  nodeId: string;
  section: PlatformSection;
  label: string;
  unlockedAt: number;
  visitedAt: number | null;
  completedAt: number | null;
  unlockSource: UnlockType;
  prerequisiteNodeId: string | null;
}

export interface MissionState {
  missionId: string;
  threadId: string;
  startedAt: number;
  lastActivityAt: number;
  currentNode: string | null;
  unlockedNodes: MissionNode[];
  progressionScore: number;
  currentLayer: number; // 0=surface, 1=exploring, 2=deep, 3=mastery
  lastDiscovery: {
    tag: string;
    section: PlatformSection;
    timestamp: number;
  } | null;
}

export const MissionStateSchema = z.object({
  missionId: z.string(),
  threadId: z.string(),
  startedAt: z.number(),
  lastActivityAt: z.number(),
  currentNode: z.string().nullable(),
  unlockedNodes: z.array(
    z.object({
      nodeId: z.string(),
      section: z.enum(PLATFORM_SECTIONS),
      label: z.string(),
      unlockedAt: z.number(),
      visitedAt: z.number().nullable(),
      completedAt: z.number().nullable(),
      unlockSource: z.enum(UNLOCK_TYPES),
      prerequisiteNodeId: z.string().nullable(),
    })
  ),
  progressionScore: z.number().min(0).max(100),
  currentLayer: z.number().min(0).max(3),
  lastDiscovery: z
    .object({
      tag: z.string(),
      section: z.enum(PLATFORM_SECTIONS),
      timestamp: z.number(),
    })
    .nullable(),
});

// ─── Beacon UI Object ─────────────────────────────────────────────────────────

export interface BeaconUIObject {
  id: string;
  section: PlatformSection;
  label: string;
  subtitle: string;
  priority: number;
  unlockType: UnlockType;
  pulseIntensity: "subtle" | "moderate" | "urgent";
  route: string;
  expiresAt: number | null;
  dismissed: boolean;
}

// ─── LAB State Machine ────────────────────────────────────────────────────────

export const LAB_STATES = [
  "idle",
  "scanning",
  "processing",
  "synthesis",
  "complete",
  "error",
] as const;

export type LabState = (typeof LAB_STATES)[number];

export interface LabStateContext {
  state: LabState;
  enteredAt: number;
  previousState: LabState | null;
  experimentId: string | null;
  activeAgents: string[];
  completedAgents: string[];
  boardTags: string[];
  progressPercent: number; // 0-100
  statusText: string; // Portuguese, user-facing
  technicalDetail: string; // Optional, for Data-Stream panel
}

// ─── Trigger Rule ─────────────────────────────────────────────────────────────

export interface TriggerRule {
  id: string;
  condition: TriggerCondition;
  action: TriggerAction;
  priority: number;
  cooldownMs: number;
  lastFiredAt: number | null;
}

export interface TriggerCondition {
  type: "discovery_tag" | "section_visit" | "progression_score" | "agent_mention";
  match: string; // tag name, section name, score threshold, or agent ID
  operator: "equals" | "contains" | "gte" | "lte";
  value?: string | number;
}

export interface TriggerAction {
  type: "unlock_beacon" | "escalate_priority" | "surface_suggestion" | "advance_mission";
  target: PlatformSection;
  payload: {
    reason: string;
    unlockType: UnlockType;
    basePriority: number;
  };
}

// ─── Cross-Section Handoff Payload ────────────────────────────────────────────

export interface CrossSectionPayload {
  origin: PlatformSection;
  destination: PlatformSection;
  context: {
    missionId: string | null;
    lastDiscoveryTag: string | null;
    activeExperimentId: string | null;
    transferredHints: NavigationHint[];
  };
  timestamp: number;
  ttl: number; // ms until payload expires
}

// ─── AI Prompt Injection ──────────────────────────────────────────────────────

export const NAV_SYSTEM_PROMPT_INJECTION = `
NAVEGAÇÃO COGNITIVA
Você pode incluir diretivas de navegação no formato [NAV:secao:motivo:prioridade]
para guiar o usuário a outras seções da plataforma como parte natural da missão.

Seções válidas: home | series | blog | explore | lab
Prioridade: número de 0.0 a 1.0 (0.5=menção leve, 0.8=recomendação forte, 1.0=crítico)

Regras:
- Use apenas quando houver conexão REAL com a conversa atual
- Máximo de 2 diretivas por resposta
- O motivo deve ser uma frase em português (pt-BR) que o sistema exibirá como sugestão
- NUNCA diga "clique aqui" ou "vá para" — o sistema transforma a diretiva em sinalização HUD

Exemplos:
[NAV:series:Módulo 3 contém os fundamentos que você está explorando:0.8]
[NAV:lab:Os parâmetros indicam prontidão para experimentação prática:0.9]
[NAV:blog:Uma análise expandida deste conceito está nos arquivos:0.6]
`;
