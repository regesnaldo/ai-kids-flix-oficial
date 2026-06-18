import { NextRequest, NextResponse } from "next/server";
import { routeAdaptiveNarrative } from "@/engine/router";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────
    const token = await getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    const userId = Number(payload.userId);

    const body = await request.json().catch(() => ({}));
    const { userText, currentAgent } = body;

    const decision = await routeAdaptiveNarrative({
      userId,
      userText: userText || "",
      currentAgent: currentAgent || "nexus",
    });

    return NextResponse.json({
      nextAgent: decision.nextAgent || mapUniverseToLower(decision.selectedUniverse),
      archetype: decision.archetype,
      reason: decision.reason,
      backtrackApplied: decision.backtrackApplied,
      alternatives: decision.alternatives,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[transition] Erro:", err.message);

    // Fallback seguro — NEXUS sempre está disponível
    return NextResponse.json({
      nextAgent: "nexus",
      archetype: "creative",
      reason: "Fallback — erro no roteamento adaptativo",
      fallback: true,
    });
  }
}

function mapUniverseToLower(universe: string): string {
  return universe.toLowerCase();
}
