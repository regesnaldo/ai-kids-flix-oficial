/**
 * ─── PROGRESSION ENGINE — Pure Functions & Types (Client-Safe) ────────────────
 *
 * This file contains ONLY pure functions with zero side effects.
 * SAFE to import from Client Components.
 *
 * DB-dependent functions live in progression-engine.server.ts
 */

import { planetRegistry, type PlanetId, type PlanetState } from "./planet-registry";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface PlayerProgression {
  /** DB row ID */
  id: string;
  /** Schema version for evolution safety */
  _schemaVersion?: number;
  /** Planets the player has completed */
  completed: PlanetId[];
  /** Currently active planet (if any) */
  activePlanet: PlanetId | null;
  /** Planets available for activation */
  available: PlanetId[];
  /** Active hints (max 2) */
  activeHints: Hint[];
  /** Timestamp of last progression change (for cooldown) */
  lastProgressionAt: number;
  /** Total planets completed (derived from completed.length) */
  totalCompleted: number;
}

export interface Hint {
  id: string;
  planetId: PlanetId;
  text: string;
  createdAt: number;
}

export type ActionResult =
  | { success: true; progression: PlayerProgression }
  | { success: false; error: string };

export type HintResult =
  | { success: true; progression: PlayerProgression; hint: Hint }
  | { success: false; error: string };

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** Schema version — bump when PlayerProgression shape changes */
export const SCHEMA_VERSION = 1;

/** Minimum milliseconds between progression changes */
export const PROGRESSION_COOLDOWN_MS = 2000;

/** Maximum active hints at any time */
export const MAX_ACTIVE_HINTS = 2;

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

/** The canonical empty progression. ALL initialization MUST use this. */
const EMPTY_PROGRESSION: PlayerProgression = {
  id: "",
  completed: [],
  activePlanet: null,
  available: ["nexus"],
  activeHints: [],
  lastProgressionAt: 0,
  totalCompleted: 0,
  _schemaVersion: SCHEMA_VERSION,
};

/**
 * Pure factory — default progression for a new user.
 * Does NOT touch the DB.
 */
export function createInitialProgression(): PlayerProgression {
  return { ...EMPTY_PROGRESSION };
}

// ─── RUNTIME NORMALIZATION ────────────────────────────────────────────────────

/**
 * Normalize potentially corrupted or partial progression data.
 *
 * Handles:
 *   - undefined/missing arrays → []
 *   - null activePlanet preserved
 *   - missing numeric fields → 0
 *   - schema version validation
 *   - invalid PlanetIds filtered from arrays
 *
 * This is the SINGLE normalization boundary. Every entry point
 * (API response, localStorage, mock data) MUST pass through here.
 */
export function normalizeProgression(
  raw: Partial<PlayerProgression> | null | undefined
): PlayerProgression {
  const defaults = EMPTY_PROGRESSION;

  if (!raw || typeof raw !== "object") {
    return { ...defaults };
  }

  // Defensive: every array field gets normalized
  const completed = Array.isArray(raw.completed)
    ? raw.completed.filter((id): id is PlanetId => typeof id === "string" && id in planetRegistry)
    : [...defaults.completed];

  const available = Array.isArray(raw.available)
    ? raw.available.filter((id): id is PlanetId => typeof id === "string" && id in planetRegistry)
    : [...defaults.available];

  const activeHints = Array.isArray(raw.activeHints)
    ? raw.activeHints.filter(
        (h): h is Hint =>
          typeof h === "object" &&
          h !== null &&
          typeof h.id === "string" &&
          typeof h.planetId === "string" &&
          typeof h.text === "string" &&
          typeof h.createdAt === "number"
      )
    : [];

  // Schema version: migrate if needed (future-proof)
  const version = typeof raw._schemaVersion === "number" ? raw._schemaVersion : 0;

  return {
    id: typeof raw.id === "string" ? raw.id : defaults.id,
    _schemaVersion: SCHEMA_VERSION,
    completed,
    activePlanet:
      typeof raw.activePlanet === "string" && raw.activePlanet in planetRegistry
        ? (raw.activePlanet as PlanetId)
        : null,
    available,
    activeHints,
    lastProgressionAt:
      typeof raw.lastProgressionAt === "number" ? raw.lastProgressionAt : 0,
    totalCompleted:
      typeof raw.totalCompleted === "number" ? raw.totalCompleted : completed.length,
  };
}

// ─── STATE CALCULATION (pure functions — no DB, no side effects) ──────────────

/**
 * Calculate a planet's current state based on player progression.
 * Pure function — no side effects, no mutation.
 */
export function calculatePlanetState(
  planetId: PlanetId,
  progression: PlayerProgression | null | undefined
): PlanetState {
  // Defensive guard: progression may be null/undefined during first render
  // or if API response hasn't arrived yet
  if (!progression) return "undiscovered";

  // Defensive: ensure arrays exist even if JSON deserialization is partial
  const completed: PlanetId[] = Array.isArray(progression.completed) ? progression.completed : [];
  const available: PlanetId[] = Array.isArray(progression.available) ? progression.available : [];

  if (!allRequiresMet(planetId, progression, completed)) {
    return "undiscovered";
  }
  if (planetId === progression.activePlanet) {
    return "active";
  }
  if (completed.includes(planetId)) {
    return "completed";
  }
  if (available.includes(planetId)) {
    return "available";
  }
  return "undiscovered";
}

/**
 * Check if all prerequisite planets for `planetId` have been completed.
 */
function allRequiresMet(
  planetId: PlanetId,
  progression: PlayerProgression,
  completed: PlanetId[]
): boolean {
  const planet = planetRegistry[planetId];
  if (planet.requires.length === 0) return true;
  return planet.requires.every((reqId) => completed.includes(reqId));
}

// ─── DIAGNOSTIC (pure functions) ──────────────────────────────────────────────

/**
 * Get a summary of all planet states for the current progression.
 */
export function getUniverseSnapshot(
  progression: PlayerProgression
): Record<PlanetId, PlanetState> {
  const snapshot: Record<string, PlanetState> = {};
  for (const id of Object.keys(planetRegistry) as PlanetId[]) {
    snapshot[id] = calculatePlanetState(id, progression);
  }
  return snapshot as Record<PlanetId, PlanetState>;
}

/**
 * Count planets by state.
 */
export function countByState(
  progression: PlayerProgression
): Record<PlanetState, number> {
  const snapshot = getUniverseSnapshot(progression);
  const counts: Record<PlanetState, number> = {
    undiscovered: 0,
    available: 0,
    active: 0,
    completed: 0,
  };
  for (const state of Object.values(snapshot)) {
    counts[state]++;
  }
  return counts;
}
