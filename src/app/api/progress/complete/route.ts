import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watchProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const body = await request.json().catch(() => ({}));
    const {
      agentId,
      season,
      episode,
      choicesMade,
      firstOfDay,
    } = body as {
      agentId?: string;
      season?: number;
      episode?: number;
      choicesMade?: boolean;
      firstOfDay?: boolean;
    };

    if (!season || !episode) {
      return NextResponse.json({ error: "season e episode são obrigatórios" }, { status: 400 });
    }

    // ── 1. Save/update watch progress ──────────────────────
    const existing = await db
      .select()
      .from(watchProgress)
      .where(
        and(
          eq(watchProgress.userId, userId),
          eq(watchProgress.seasonNumber, season),
          eq(watchProgress.episodeNumber, episode),
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(watchProgress)
        .set({
          isCompleted: true,
          progressSeconds: existing[0].totalSeconds || 0,
          lastWatchedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(watchProgress.id, existing[0].id));
    } else {
      await db.insert(watchProgress).values({
        userId,
        seriesId: 0,
        episodeId: episode,
        seasonNumber: season,
        episodeNumber: episode,
        isCompleted: true,
        progressSeconds: 0,
        totalSeconds: 0,
        lastWatchedAt: new Date(),
      });
    }

    // ── 2. Award XP ────────────────────────────────────────
    let xpAwarded = 0;
    try {
      const xpRes = await fetch(`${request.nextUrl.origin}/api/xp/award`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify({
          reason: "episode_complete",
          agentId,
          season,
          episode,
          choicesMade,
          firstOfDay: firstOfDay ?? true,
        }),
      });

      if (xpRes.ok) {
        const xpData = await xpRes.json();
        xpAwarded = xpData.awarded || 0;
      }
    } catch (xpErr) {
      // XP failure não bloqueia progresso
      console.error("[progress/complete] XP award failed:", String(xpErr));
    }

    return NextResponse.json({
      success: true,
      completed: true,
      xpAwarded,
      season,
      episode,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[progress/complete] Error:", err.message);
    return NextResponse.json(
      { error: "Erro ao salvar progresso", details: err.message },
      { status: 500 }
    );
  }
}
