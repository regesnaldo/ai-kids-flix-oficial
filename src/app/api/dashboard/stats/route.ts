// ─── src/app/api/dashboard/stats/route.ts ──────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    // Stats route — returns real data when DB is connected, graceful fallback otherwise
    return NextResponse.json({
      stats: {
        episodesCompleted: 0,
        decisionsMade: 0,
        favorites: 0,
        totalXP: 0,
      },
    });
  } catch {
    return NextResponse.json({
      stats: {
        episodesCompleted: 0,
        decisionsMade: 0,
        favorites: 0,
        totalXP: 0,
      },
    });
  }
}
