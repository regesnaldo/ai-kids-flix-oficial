import { NextRequest, NextResponse } from "next/server";
import { updateSilentProfile, extractProfileSignals, type InteractionContext } from "@/engine/profiler";
import { verifyToken } from "@/lib/auth";

/**
 * POST /api/narrative/track
 *
 * Silent profiler endpoint. Receives interactive decisions from the player,
 * extracts cognitive/emotional/moral signals from the choice label, and
 * persists the interaction to the database.
 *
 * Request body:
 *   { choiceId, choiceLabel, episodeId?, seriesId?, agentId?, narrativeResponse? }
 *
 * Response:
 *   200 { signals: ProfileSignals }
 *   401 { error: "Unauthorized" }
 *   400 { error: "choiceLabel is required" }
 */
export async function POST(request: NextRequest) {
  const tokenValue = request.cookies.get("mente_ai_token")?.value ?? null;
  if (!tokenValue) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(tokenValue);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const choiceLabel = body.choiceLabel as string | undefined;
  if (!choiceLabel || typeof choiceLabel !== "string") {
    return NextResponse.json({ error: "choiceLabel is required" }, { status: 400 });
  }

  const context: InteractionContext = {
    userId: Number(payload.userId) || 0,
    choiceLabel,
    episodeId: body.episodeId as number | undefined,
    seriesId: body.seriesId as number | undefined,
    agentId: body.agentId as string | undefined,
    choiceId: body.choiceId as string | undefined,
    narrativeResponse: body.narrativeResponse as string | undefined,
  };

  const signals = await updateSilentProfile(context);

  return NextResponse.json({
    signals,
    // Phase 0: raw signals only — full profile aggregation ships in Era 1 / Phase 2
  });
}

/**
 * GET /api/narrative/track?choiceLabel=...
 *
 * Quick signal extraction without DB persistence. Useful for client-side
 * preview during narrative authoring.
 */
export async function GET(request: NextRequest) {
  const choiceLabel = request.nextUrl.searchParams.get("choiceLabel");
  if (!choiceLabel) {
    return NextResponse.json({ error: "choiceLabel query param is required" }, { status: 400 });
  }

  const signals = extractProfileSignals(choiceLabel);
  return NextResponse.json({ signals });
}
