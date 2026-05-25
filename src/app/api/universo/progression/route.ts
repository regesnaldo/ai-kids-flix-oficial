/**
 * ─── PROGRESSION API — GET /api/universo/progression ─────────────────────────
 *
 * Returns the current player progression state from the Nexus-governed DB.
 *
 * Phase 2: This is the single client-facing endpoint for reading progression.
 * All state changes go through nexusRuntime.submitProposal() on the server.
 *
 * Phase 3: Route guard added. Only GET is allowed. POST/PUT/PATCH/DELETE
 * return 405 Method Not Allowed and log the violation to RUNTIME_HEALTH.
 *
 * Response (GET): { progression: PlayerProgression }
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrCreateProgression } from "@/lib/universe/progression-engine.server";
import { nexusBus } from "@/lib/nexus/nexus.events";

export const runtime = "nodejs";

/**
 * GET — allowed. Returns progression snapshot.
 * This is a READ-ONLY endpoint. No state modification.
 */
export async function GET() {
  try {
    // userId=0 for now (single-player mode)
    const progression = await getOrCreateProgression(0);

    return NextResponse.json({ progression });
  } catch (error) {
    console.error("[progression] GET Error:", error);
    return NextResponse.json(
      { error: "Failed to load progression" },
      { status: 500 }
    );
  }
}

/**
 * POST — BLOCKED. State changes must go through nexusRuntime.submitProposal().
 * Logs attempted violation to RUNTIME_HEALTH channel for monitoring.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  nexusBus.emit({
    type: "RUNTIME_HEALTH",
    subtype: "STATE_TRANSITION",
    previousState: "healthy",
    newState: "healthy", // Degraded but not unhealthy — single violation
    trigger: `[ROUTE GUARD] POST /api/universo/progression blocked — attempted direct write: ${JSON.stringify(body).slice(0, 200)}`,
  });

  return NextResponse.json(
    {
      error: "Method Not Allowed",
      message: "Progression state changes must go through nexusRuntime.submitProposal(). Use the appropriate agent endpoint.",
      allowedMethods: ["GET"],
    },
    { status: 405 }
  );
}

/**
 * PUT — BLOCKED. Same as POST.
 */
export async function PUT(request: NextRequest) {
  nexusBus.emit({
    type: "RUNTIME_HEALTH",
    subtype: "STATE_TRANSITION",
    previousState: "healthy",
    newState: "healthy",
    trigger: "[ROUTE GUARD] PUT /api/universo/progression blocked — direct mutation attempt",
  });

  return NextResponse.json(
    {
      error: "Method Not Allowed",
      message: "Progression mutations must go through the progression engine via nexusRuntime.submitProposal().",
      allowedMethods: ["GET"],
    },
    { status: 405 }
  );
}

/**
 * PATCH — BLOCKED.
 */
export async function PATCH() {
  nexusBus.emit({
    type: "RUNTIME_HEALTH",
    subtype: "STATE_TRANSITION",
    previousState: "healthy",
    newState: "healthy",
    trigger: "[ROUTE GUARD] PATCH /api/universo/progression blocked",
  });

  return NextResponse.json(
    { error: "Method Not Allowed", allowedMethods: ["GET"] },
    { status: 405 }
  );
}

/**
 * DELETE — BLOCKED.
 */
export async function DELETE() {
  nexusBus.emit({
    type: "RUNTIME_HEALTH",
    subtype: "STATE_TRANSITION",
    previousState: "healthy",
    newState: "healthy",
    trigger: "[ROUTE GUARD] DELETE /api/universo/progression blocked",
  });

  return NextResponse.json(
    { error: "Method Not Allowed", allowedMethods: ["GET"] },
    { status: 405 }
  );
}
