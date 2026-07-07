/**
 * ─── RUNTIME SYNC — GET /api/ws/runtime-sync ──────────────────────────────
 *
 * Returns the current Nexus runtime state snapshot.
 * Formerly SSE; converted to instant REST to eliminate Vercel timeout errors.
 *
 * TRANSPORT:
 *   REST polling (10s interval via OasisProvider)
 *
 * CLIENT EXAMPLE:
 *   const res = await fetch("/api/ws/runtime-sync");
 *   const { state, timestamp } = await res.json();
 *
 * PHASE 4: Memory Keeper & WebSocket Runtime
 */

import { nexusRuntime } from "@/lib/nexus/NexusRuntime";
import type { NexusCanonicalState } from "@/lib/nexus/nexus.types";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET — return current Nexus runtime state snapshot.
 * Instant response, no streaming. Compatible with Vercel Serverless.
 * Requer JWT válido (cookie mente_ai_token).
 */
export async function GET(request: NextRequest) {
  // ── Auth: JWT obrigatório (cookie mente_ai_token) ─────────────────────
  const token = getAuthCookieFromRequest(request);
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const authPayload = await verifyToken(token);
  if (!authPayload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  const userId = Number(authPayload.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
  }
  void userId; // auth gate

  try {
    // Ensure Nexus is initialized
    if (!nexusRuntime.isInitialized) {
      nexusRuntime.init();
    }

    const state = nexusRuntime.getSnapshot() as NexusCanonicalState;

    return Response.json({
      type: "STATE_UPDATED",
      state,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Erro em GET /api/ws/runtime-sync:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
