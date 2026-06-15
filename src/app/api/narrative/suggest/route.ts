import { NextRequest, NextResponse } from "next/server";
import { getPrimarySuggestion, type SuggestionRequest } from "@/engine/adaptive-router";
import { verifyToken } from "@/lib/auth";

/**
 * POST /api/narrative/suggest
 *
 * Adaptive narrative director endpoint. Returns the best narrative
 * suggestion for the user based on their profile, current agent,
 * and recent decisions.
 *
 * Request body:
 *   { currentAgent, recentDecisions?: string[], context?: string }
 *
 * Response:
 *   200 { suggestion: NarrativeSuggestion | null }
 *   401 { error: "Unauthorized" }
 *   400 { error: "currentAgent is required" }
 *
 * Phase 0: deterministic suggestions based on archetype mappings.
 * Phase 2: full LangChain-powered narrative generation.
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

  const currentAgent = body.currentAgent as string | undefined;
  if (!currentAgent || typeof currentAgent !== "string") {
    return NextResponse.json({ error: "currentAgent is required" }, { status: 400 });
  }

  const suggestionRequest: SuggestionRequest = {
    userId: Number(payload.userId) || 0,
    currentAgent,
    recentDecisions: body.recentDecisions as string[] | undefined,
    context: body.context as string | undefined,
  };

  const suggestion = await getPrimarySuggestion(suggestionRequest);

  return NextResponse.json({ suggestion });
}

/**
 * GET /api/narrative/suggest?currentAgent=nexus&context=...
 *
 * Quick suggestion query via query params. Useful for client-side
 * polling or navigation hints without a full POST body.
 */
export async function GET(request: NextRequest) {
  const tokenValue = request.cookies.get("mente_ai_token")?.value ?? null;
  if (!tokenValue) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(tokenValue);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentAgent = request.nextUrl.searchParams.get("currentAgent");
  if (!currentAgent) {
    return NextResponse.json({ error: "currentAgent query param is required" }, { status: 400 });
  }

  const suggestionRequest: SuggestionRequest = {
    userId: Number(payload.userId) || 0,
    currentAgent,
    recentDecisions: request.nextUrl.searchParams.get("recentDecisions")?.split(",") || undefined,
    context: request.nextUrl.searchParams.get("context") || undefined,
  };

  const suggestion = await getPrimarySuggestion(suggestionRequest);

  return NextResponse.json({ suggestion });
}
