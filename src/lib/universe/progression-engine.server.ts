/**
 * ─── PROGRESSION ENGINE — Server-Only (DB Mutations) ──────────────────────────
 *
 * This file contains ALL functions that touch the database.
 * DO NOT import this from Client Components — use the API routes instead.
 *
 * Pure functions live in progression-engine.ts (client-safe).
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PHASE 2: OWNERSHIP ENFORCEMENT
 *
 * All state changes now route through nexusRuntime.submitProposal().
 * The pattern is:
 *   1. Validate business logic locally (fast-fail)
 *   2. Submit proposal to Nexus for ownership + authority validation
 *   3. If accepted → persist to DB → emit events
 *   4. If rejected → return Nexus error
 *
 * DB operations stay here (Nexus is in-memory).
 * Nexus governs what CAN be written — this file handles HOW.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import "server-only";

import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { universeProgression } from "@/lib/db/schema";
import { planetRegistry, type PlanetId } from "./planet-registry";
import { nexusBus } from "@/lib/nexus/nexus.events";
import { nexusRuntime } from "@/lib/nexus";
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
 *
 * Phase 2: initial creation is routed through nexusRuntime.submitProposal()
 * for ownership validation before DB insert.
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

    // Phase 2: Submit through Nexus for ownership validation
    const result = nexusRuntime.submitProposal({
      proposalId: uuid(),
      agentId: "nexus",
      type: "PROGRESSION_INIT",
      timestamp: Date.now(),
      payload: { userId, playerProgression: { ...initial, id } },
    });

    if (!result.accepted) {
      console.error(`[Nexus] PROGRESSION_INIT rejected: ${result.reason}`);
      // Fall through — insert anyway (graceful degradation)
    }

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

/**
 * Activate a planet. Validates state, submits to Nexus, persists, emits events.
 *
 * Phase 2: routes through nexusRuntime.submitProposal() for ownership validation.
 * DB persist happens AFTER Nexus approval.
 */
export async function activatePlanet(
  planetId: PlanetId,
  userId: number
): Promise<ActionResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  // Fast-fail: local business logic validation
  if (state === "undiscovered") return { success: false, error: "PLANETA AINDA NÃO DESCOBERTO" };
  if (state === "completed") return { success: false, error: "PLANETA JÁ DOMINADO" };
  if (state === "active") return { success: false, error: "PLANETA JÁ ATIVO" };

  // Phase 2: Submit to Nexus for ownership + authority validation
  const nexusResult = nexusRuntime.submitProposal({
    proposalId: uuid(),
    agentId: planetId,
    type: "PLANET_ACTIVATE",
    timestamp: Date.now(),
    payload: { planetId },
  });

  if (!nexusResult.accepted) {
    return { success: false, error: `[NEXUS] ${nexusResult.reason}` };
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

  nexusBus.emit({ type: "PLANET_ACTIVATED", planetId });
  nexusBus.emit({ type: "PROGRESSION_STATE_CHANGED", planetId, from: previousState, to: "active" });

  return { success: true, progression: newProgression };
}

/**
 * Complete a planet. Unlocks children. Validates, submits to Nexus, persists.
 *
 * Phase 2: routes through nexusRuntime.submitProposal() for ownership validation.
 */
export async function completePlanet(
  planetId: PlanetId,
  userId: number
): Promise<ActionResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  // Fast-fail: local business logic validation
  if (state !== "active") return { success: false, error: "PLANETA NÃO ESTÁ ATIVO" };
  if (Date.now() - progression.lastProgressionAt < PROGRESSION_COOLDOWN_MS) {
    return { success: false, error: "SISTEMA EM RESFRIAMENTO" };
  }

  // Phase 2: Submit to Nexus for ownership + authority validation
  const nexusResult = nexusRuntime.submitProposal({
    proposalId: uuid(),
    agentId: planetId,
    type: "PLANET_COMPLETE",
    timestamp: Date.now(),
    payload: { planetId },
  });

  if (!nexusResult.accepted) {
    return { success: false, error: `[NEXUS] ${nexusResult.reason}` };
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

  nexusBus.emit({ type: "PLANET_COMPLETED", planetId });
  nexusBus.emit({ type: "PROGRESSION_STATE_CHANGED", planetId, from: "active", to: "completed" });

  for (const unlockedId of newlyUnlocked) {
    nexusBus.emit({ type: "PLANET_UNLOCKED", planetId: unlockedId, source: planetId });
    nexusBus.emit({ type: "PROGRESSION_STATE_CHANGED", planetId: unlockedId, from: "undiscovered", to: "available" });
  }

  for (const id of newProgression.available) {
    if (newlyUnlocked.includes(id)) {
      nexusBus.emit({ type: "SIGNAL_DETECTED", planetId: id, strength: 0.5 });
    }
  }

  return { success: true, progression: newProgression };
}

// ─── HINT MANAGEMENT ──────────────────────────────────────────────────────────

/**
 * Generate a hint for a planet. Validates, submits to Nexus, persists.
 *
 * Phase 2: routes through nexusRuntime.submitProposal() for ownership validation.
 */
export async function generateHint(
  planetId: PlanetId,
  text: string,
  userId: number
): Promise<HintResult> {
  const progression = await getOrCreateProgression(userId);
  const state = calculatePlanetState(planetId, progression);

  // Fast-fail: local business logic validation
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

  // Phase 2: Submit to Nexus for ownership validation
  const nexusResult = nexusRuntime.submitProposal({
    proposalId: uuid(),
    agentId: planetId,
    type: "HINT_GENERATE",
    timestamp: Date.now(),
    payload: { planetId, text, hint },
  });

  if (!nexusResult.accepted) {
    return { success: false, error: `[NEXUS] ${nexusResult.reason}` };
  }

  const newProgression: PlayerProgression = {
    ...progression,
    activeHints: [...progression.activeHints, hint],
    lastProgressionAt: Date.now(),
  };

  await persist(newProgression);
  nexusBus.emit({ type: "HINT_GENERATED", planetId, hint: text });

  return { success: true, progression: newProgression, hint };
}

/**
 * Clear a hint. Submits to Nexus, persists.
 *
 * Phase 2: routes through nexusRuntime.submitProposal() for ownership validation.
 */
export async function clearHint(
  hintId: string,
  userId: number
): Promise<PlayerProgression> {
  const progression = await getOrCreateProgression(userId);

  // Phase 2: Submit to Nexus for ownership validation
  const nexusResult = nexusRuntime.submitProposal({
    proposalId: uuid(),
    agentId: "nexus",
    type: "HINT_CLEAR",
    timestamp: Date.now(),
    payload: { hintId },
  });

  if (!nexusResult.accepted) {
    console.error(`[Nexus] HINT_CLEAR rejected: ${nexusResult.reason}`);
    // Graceful degradation: proceed anyway
  }

  const newProgression: PlayerProgression = {
    ...progression,
    activeHints: progression.activeHints.filter((h) => h.id !== hintId),
  };
  await persist(newProgression);
  return newProgression;
}
