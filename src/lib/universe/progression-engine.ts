/**
 * ─── PROGRESSION ENGINE — Deterministic Planet State Machine ──────────────────
 *
 * AI NEVER updates state directly. The flow is:
 *
 *   AI → Hint Extraction → Validation → Progression Engine → DB → UI
 *
 * Rules:
 *   - Deterministic only — same input always produces same output
 *   - All unlocks validated before state transitions
 *   - Max 2 active hints at any time
 *   - Cooldown system prevents rapid-fire progression
 *   - Respects planetRegistry.unlocks and planetRegistry.requires
 *   - ALL mutations persist to universe_progression table (Drizzle ORM)
 */

import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { universeProgression } from "@/lib/db/schema";
import { planetRegistry, type PlanetId, type PlanetState } from "./planet-registry";
import { universeBus } from "./event-bus";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface PlayerProgression {
  /** DB row ID */
  id: string;
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

// ─── COOLDOWN ─────────────────────────────────────────────────────────────────

/** Minimum milliseconds between progression changes */
const PROGRESSION_COOLDOWN_MS = 2000;

/** Maximum active hints at any time */
const MAX_ACTIVE_HINTS = 2;

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

/**
 * Pure factory — returns default progression for a new user.
 * Does NOT touch the DB. Use getOrCreateProgression(userId) for DB-backed init.
 */
export function createInitialProgression(): PlayerProgression {
  return {
    id: "",
    completed: [],
    activePlanet: null,
    available: ["nexus"],
    activeHints: [],
    lastProgressionAt: 0,
    totalCompleted: 0,
  };
}

// ─── DB HELPERS ───────────────────────────────────────────────────────────────

/**
 * Load progression from DB for a user. Creates initial row if none exists.
 * This is the primary entry point for reading progression state.
 */
export async function getOrCreateProgression(
  userId: number
): Promise<PlayerProgression> {
  const rows = await db
    .select()
    .from(universeProgression)
    .where(eq(universeProgression.userId, userId))
    .limit(1);

  if (rows.length === 0) {
    const initial = createInitialProgression();
    const id = uuid();
    await db.insert(universeProgression).values({
      id,
      userId,
      completed: initial.completed,
      activePlanet: initial.activePlanet,
      available: initial.available,
      activeHints: initial.activeHints,
      lastProgressionAt: new Date(0),
      totalCompleted: initial.totalCompleted,
    });
    return { ...initial, id };
  }

  const row = rows[0];
  return dbRowToProgression(row);
}

/**
 * Convert a DB row to PlayerProgression interface.
 * Handles JSON parsing and timestamp conversion.
 */
function dbRowToProgression(
  row: typeof universeProgression.$inferSelect
): PlayerProgression {
  const completed = parseStringArray(row.completed);
  const available = parseStringArray(row.available);
  const activeHints = parseHints(row.activeHints);

  return {
    id: row.id,
    completed: completed.filter((id): id is PlanetId => id in planetRegistry),
    activePlanet: row.activePlanet as PlanetId | null,
    available: available.filter((id): id is PlanetId => id in planetRegistry),
    activeHints,
    lastProgressionAt: row.lastProgressionAt
      ? new Date(row.lastProgressionAt).getTime()
      : 0,
    totalCompleted: row.totalCompleted,
  };
}

/**
 * Persist a PlayerProgression state back to the DB.
 */
async function persist(progression: PlayerProgression): Promise<void> {
  await db
    .update(universeProgression)
    .set({
      completed: progression.completed,
      activePlanet: progression.activePlanet,
      available: progression.available,
      activeHints: progression.activeHints,
      lastProgressionAt: new Date(progression.lastProgressionAt),
      totalCompleted: progression.totalCompleted,
    })
    .where(eq(universeProgression.id, progression.id));
}

/**
 * Safely parse a JSON array of strings from DB.
 */
function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

/**
 * Safely parse hints JSON from DB.
 */
function parseHints(value: unknown): Hint[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (h): h is Hint =>
      typeof h === "object" &&
      h !== null &&
      typeof (h as Hint).id === "string" &&
      typeof (h as Hint).planetId === "string" &&
      typeof (h as Hint).text === "string" &&
      typeof (h as Hint).createdAt === "number"
  );
}

// ─── STATE CALCULATION (pure functions — no DB, no side effects) ──────────────

/**
 * Calculate a planet's current state based on player progression.
 * Pure function — no side effects, no mutation.
 */
export function calculatePlanetState(
  planetId: PlanetId,
  progression: PlayerProgression
): PlanetState {
  // Check if all required planets are completed
  if (!allRequiresMet(planetId, progression)) {
    return "undiscovered";
  }

  // Active planet
  if (planetId === progression.activePlanet) {
    return "active";
  }

  // Completed
  if (progression.completed.includes(planetId)) {
    return "completed";
  }

  // Available for activation
  if (progression.available.includes(planetId)) {
    return "available";
  }

  return "undiscovered";
}

/**
 * Check if all prerequisite planets for `planetId` have been completed.
 */
function allRequiresMet(
  planetId: PlanetId,
  progression: PlayerProgression
): boolean {
  const planet = planetRegistry[planetId];
  if (planet.requires.length === 0) return true;
  return planet.requires.every((reqId) => progression.completed.includes(reqId));
}

// ─── PROGRESSION ACTIONS (async — write to DB) ────────────────────────────────

type ActionResult =
  | { success: true; progression: PlayerProgression }
  | { success: false; error: string };

/**
 * Activate a planet. Validates state, persists to DB, emits events.
 */
export async function activatePlanet(
  planetId: PlanetId,
  userId: number
): Promise<ActionResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  if (state === "undiscovered") {
    return { success: false, error: "PLANETA AINDA NÃO DESCOBERTO" };
  }
  if (state === "completed") {
    return { success: false, error: "PLANETA JÁ DOMINADO" };
  }
  if (state === "active") {
    return { success: false, error: "PLANETA JÁ ATIVO" };
  }

  const previousState = state;
  const newProgression: PlayerProgression = {
    ...progression,
    activePlanet: planetId,
    available: progression.available.filter((id) => id !== planetId),
    activeHints: progression.activeHints.filter((h) => h.planetId !== planetId),
    lastProgressionAt: Date.now(),
  };

  await persist(newProgression);

  universeBus.emit({ type: "PLANET_ACTIVATED", planetId });
  universeBus.emit({
    type: "PROGRESSION_STATE_CHANGED",
    planetId,
    from: previousState,
    to: "active",
  });

  return { success: true, progression: newProgression };
}

/**
 * Complete a planet. Unlocks its children. Persists to DB.
 */
export async function completePlanet(
  planetId: PlanetId,
  userId: number
): Promise<ActionResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  if (state !== "active") {
    return { success: false, error: "PLANETA NÃO ESTÁ ATIVO" };
  }

  // Cooldown check
  if (Date.now() - progression.lastProgressionAt < PROGRESSION_COOLDOWN_MS) {
    return { success: false, error: "SISTEMA EM RESFRIAMENTO" };
  }

  const planet = planetRegistry[planetId];

  // Calculate newly unlocked planets
  const newlyUnlocked = planet.unlocks.filter(
    (id) =>
      !progression.completed.includes(id) &&
      !progression.available.includes(id) &&
      id !== progression.activePlanet
  );

  const newProgression: PlayerProgression = {
    ...progression,
    completed: [...progression.completed, planetId],
    activePlanet: null,
    available: [...progression.available, ...newlyUnlocked],
    activeHints: progression.activeHints.filter((h) => h.planetId !== planetId),
    lastProgressionAt: Date.now(),
    totalCompleted: progression.completed.length + 1,
  };

  await persist(newProgression);

  // Emit events
  universeBus.emit({ type: "PLANET_COMPLETED", planetId });
  universeBus.emit({
    type: "PROGRESSION_STATE_CHANGED",
    planetId,
    from: "active",
    to: "completed",
  });

  for (const unlockedId of newlyUnlocked) {
    universeBus.emit({
      type: "PLANET_UNLOCKED",
      planetId: unlockedId,
      source: planetId,
    });
    universeBus.emit({
      type: "PROGRESSION_STATE_CHANGED",
      planetId: unlockedId,
      from: "undiscovered",
      to: "available",
    });
  }

  for (const id of newProgression.available) {
    if (newlyUnlocked.includes(id)) {
      universeBus.emit({
        type: "SIGNAL_DETECTED",
        planetId: id,
        strength: 0.5,
      });
    }
  }

  return { success: true, progression: newProgression };
}

// ─── HINT MANAGEMENT ──────────────────────────────────────────────────────────

type HintResult =
  | { success: true; progression: PlayerProgression; hint: Hint }
  | { success: false; error: string };

/**
 * Generate a hint for an active or available planet.
 * Max 2 active hints. Persists to DB.
 */
export async function generateHint(
  planetId: PlanetId,
  text: string,
  userId: number
): Promise<HintResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  if (state !== "active" && state !== "available") {
    return { success: false, error: "PLANETA NÃO DISPONÍVEL PARA DICAS" };
  }

  if (progression.activeHints.length >= MAX_ACTIVE_HINTS) {
    return { success: false, error: "MÁXIMO DE DICAS ATINGIDO" };
  }

  if (Date.now() - progression.lastProgressionAt < PROGRESSION_COOLDOWN_MS) {
    return { success: false, error: "SISTEMA EM RESFRIAMENTO" };
  }

  const hint: Hint = {
    id: uuid(),
    planetId,
    text,
    createdAt: Date.now(),
  };

  const newProgression: PlayerProgression = {
    ...progression,
    activeHints: [...progression.activeHints, hint],
    lastProgressionAt: Date.now(),
  };

  await persist(newProgression);

  universeBus.emit({
    type: "HINT_GENERATED",
    planetId,
    hint: text,
  });

  return { success: true, progression: newProgression, hint };
}

/**
 * Clear a specific hint by ID. Persists to DB.
 */
export async function clearHint(
  hintId: string,
  userId: number
): Promise<PlayerProgression> {
  const progression = await getOrCreateProgression(userId);

  const newProgression: PlayerProgression = {
    ...progression,
    activeHints: progression.activeHints.filter((h) => h.id !== hintId),
  };

  await persist(newProgression);
  return newProgression;
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
