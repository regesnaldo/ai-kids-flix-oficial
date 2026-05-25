/**
 * ─── NAVIGATION HINTS — Barrel Export ─────────────────────────────────────────
 *
 * Single import point for the entire navigation hints system.
 *
 * Usage:
 *   import { extractNavigationHints, NAV_SYSTEM_PROMPT_INJECTION } from "@/lib/navigation-hints";
 */

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  NavigationHint,
  NavigationHintBundle,
  MissionState,
  MissionNode,
  BeaconUIObject,
  PlatformSection,
  UnlockType,
  LabState,
  LabStateContext,
  CrossSectionPayload,
  TriggerRule,
  TriggerCondition,
  TriggerAction,
} from "./types";

export {
  PLATFORM_SECTIONS,
  UNLOCK_TYPES,
  LAB_STATES,
  NavigationHintSchema,
  NavigationHintBundleSchema,
  MissionStateSchema,
  NAV_SYSTEM_PROMPT_INJECTION,
} from "./types";

// ── Extractor ─────────────────────────────────────────────────────────────────
export {
  extractNavigationHints,
  validateHint,
  validateHints,
  getSectionRoute,
  getSectionLabel,
} from "./extractor";

// ── Router ────────────────────────────────────────────────────────────────────
export {
  SECTION_ROUTES,
  SECTION_LABELS,
  PRIORITY_THRESHOLDS,
  priorityToIntensity,
  filterVisibleHints,
  getConnectionRule,
  getValidDestinations,
  evaluateTriggers,
  buildHintFromAction,
  resolveSectionRoute,
} from "./router";

// ── Mission Store ─────────────────────────────────────────────────────────────
export {
  createMission,
  unlockNode,
  visitNode,
  completeNode,
  advanceMission,
  getNextSuggestedPath,
  recordDiscovery,
  getUnvisitedNodes,
  getActiveMissionNodes,
  getMission,
  getMissionByThread,
  saveMission,
  deleteMission,
  loadMissionFromStorage,
  persistMissionToStorage,
  getLayerLabel,
  getLayerDescription,
} from "./mission-store";

// ── Beacon Factory ────────────────────────────────────────────────────────────
export {
  generatePulseBeacon,
  generateBeacons,
  getActiveBeacons,
  getSectionBeacon,
  buildSuggestionText,
  generateStatusLine,
  SECTION_DISPLAY_NAMES,
  UNLOCK_ACTION_TEXT,
  INTENSITY_STATUS_TEXT,
  PULSE_SIGNAL_CLASSES,
} from "./beacon-factory";

// ── LAB State Machine ─────────────────────────────────────────────────────────
export {
  createLabState,
  transition,
  addActiveAgent,
  completeAgent,
  addBoardTag,
  calculateProgress,
  generateHudStatusLine,
  resetLab,
} from "./lab-state-machine";

// ── Cross-Section Handoff ─────────────────────────────────────────────────────
export {
  createHandoffPayload,
  isPayloadValid,
  processHandoff,
  createHandoffProtocol,
  detectCurrentSection,
  onBeforeNavigate,
} from "./cross-section-handoff";
