// ÔöÇÔöÇÔöÇ src/app/api/aura/[userId]/route.ts ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
// FASE 12A ÔÇö Aura Din├ómica: endpoint GET para estado da aura do usu├írio
// Autentica├º├úo: cookie `mente_ai_token` (via @/lib/auth)
// Cache: HTTP 5 min + cache interno do calculator
//
// GET /api/aura/[userId]
//   ÔåÆ 200 { color, colorHex, intensity, pattern, score, phase, nextMilestone }
//   ÔåÆ 401 se n├úo autenticado
//   ÔåÆ 403 se userId Ôëá usu├írio autenticado
//   ÔåÆ 404 se usu├írio n├úo existe
//   ÔåÆ 500 se erro de banco

import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { calculateScore, resolveAuraState, getCachedAura, setCachedAura } from "@/lib/aura/calculator";
import type { AuraState } from "@/lib/aura/types";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // ÔöÇÔöÇÔöÇ Autentica├º├úo ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    const token = getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "N├úo autorizado" }, { status: 401 });
    }

    const authPayload = await verifyToken(token);
    if (!authPayload) {
      return NextResponse.json({ error: "Token inv├ílido" }, { status: 401 });
    }

    const { userId } = await params;
    const requestedUserId = parseInt(userId, 10);

    if (isNaN(requestedUserId)) {
      return NextResponse.json({ error: "userId inv├ílido" }, { status: 400 });
    }

    // Apenas o pr├│prio usu├írio pode ver sua aura
    if (String(authPayload.userId) !== userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // ÔöÇÔöÇÔöÇ Cache ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    const cacheKey = `user:${requestedUserId}`;
    const cached = getCachedAura(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "private, max-age=300" },
      });
    }

    // ÔöÇÔöÇÔöÇ Queries Drizzle ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

    // XP: conta epis├│dios completados ├ù 50 XP cada
    const xpResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.watchProgress)
      .where(
        sql`${schema.watchProgress.userId} = ${requestedUserId} AND ${schema.watchProgress.isCompleted} = true`
      );
    const xp = (xpResult[0]?.count ?? 0) * 50;

    // Decis├Áes: conta decis├Áes narrativas do usu├írio
    const decisionsResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.interactiveDecisions)
      .where(sql`${schema.interactiveDecisions.userId} = ${requestedUserId}`);
    const decisions = decisionsResult[0]?.count ?? 0;

    // Temporadas: conta temporadas com pelo menos 1 epis├│dio assistido
    const seasonsResult = await db
      .select({ count: sql<number>`count(distinct ${schema.watchProgress.seasonNumber})`.mapWith(Number) })
      .from(schema.watchProgress)
      .where(sql`${schema.watchProgress.userId} = ${requestedUserId}`);
    const seasons = seasonsResult[0]?.count ?? 0;

    // ÔöÇÔöÇÔöÇ C├ílculo ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    const score = calculateScore(xp, decisions, seasons);
    const aura: AuraState = resolveAuraState(score);
    setCachedAura(cacheKey, aura);

    return NextResponse.json(aura, {
      headers: { "Cache-Control": "private, max-age=300" },
    });
  } catch (error) {
    console.error("[aura] Erro ao calcular aura:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
