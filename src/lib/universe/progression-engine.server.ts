/**
 * ─── PROGRESSION ENGINE — Server-Only (DB Mutations) ──────────────────────────
 *
 * This file contains ALL functions that touch the database.
 * DO NOT import this from Client Components — use the API routes instead.
 *
 * Pure functions live in progression-engine.ts (client-safe).
 */

import "server-only";

import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { universeProgression } from "@/lib/db/schema";
import { planetRegistry, type PlanetId } from "./planet-registry";
import { universeBus } from "./event-bus";
import {
  createInitialProgression,
  calculatePlanetState,
  PROGRESSION_COOLDOWN_MS,
  MAX_ACTIVE_HINTS,
  type PlayerProgression,
  type Hint,
  type ActionResult,
  type HintResult,
} from "./progression-engine";

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

  return dbRowToProgression(rows[0]);
}

/** Convert a DB row to PlayerProgression interface. */
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

/** Persist a PlayerProgression state back to the DB. */
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

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

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

// ─── PROGRESSION ACTIONS ──────────────────────────────────────────────────────

/** Activate a planet. Validates state, persists, emits events. */
export async function activatePlanet(
  planetId: PlanetId,
  userId: number
): Promise<ActionResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  if (state === "undiscovered") return { success: false, error: "PLANETA AINDA NÃO DESCOBERTO" };
  if (state === "completed") return { success: false, error: "PLANETA JÁ DOMINADO" };
  if (state === "active") return { success: false, error: "PLANETA JÁ ATIVO" };

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
  universeBus.emit({ type: "PROGRESSION_STATE_CHANGED", planetId, from: previousState, to: "active" });

  return { success: true, progression: newProgression };
}

/** Complete a planet. Unlocks children. Persists. */
export async function completePlanet(
  planetId: PlanetId,
  userId: number
): Promise<ActionResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  if (state !== "active") return { success: false, error: "PLANETA NÃO ESTÁ ATIVO" };
  if (Date.now() - progression.lastProgressionAt < PROGRESSION_COOLDOWN_MS) {
    return { success: false, error: "SISTEMA EM RESFRIAMENTO" };
  }

  const planet = planetRegistry[planetId];
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

  universeBus.emit({ type: "PLANET_COMPLETED", planetId });
  universeBus.emit({ type: "PROGRESSION_STATE_CHANGED", planetId, from: "active", to: "completed" });

  for (const unlockedId of newlyUnlocked) {
    universeBus.emit({ type: "PLANET_UNLOCKED", planetId: unlockedId, source: planetId });
    universeBus.emit({ type: "PROGRESSION_STATE_CHANGED", planetId: unlockedId, from: "undiscovered", to: "available" });
  }

  for (const id of newProgression.available) {
    if (newlyUnlocked.includes(id)) {
      universeBus.emit({ type: "SIGNAL_DETECTED", planetId: id, strength: 0.5 });
    }
  }

  return { success: true, progression: newProgression };
}

// ─── HINT MANAGEMENT ──────────────────────────────────────────────────────────

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

  const hint: Hint = { id: uuid(), planetId, text, createdAt: Date.now() };
  const newProgression: PlayerProgression = {
    ...progression,
    activeHints: [...progression.activeHints, hint],
    lastProgressionAt: Date.now(),
  };

  await persist(newProgression);
  universeBus.emit({ type: "HINT_GENERATED", planetId, hint: text });

  return { success: true, progression: newProgression, hint };
}

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
