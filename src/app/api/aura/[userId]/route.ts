// ─── src/app/api/aura/[userId]/route.ts ─────────────────────────────────────
// FASE 12A — Aura Dinâmica: endpoint GET para estado da aura do usuário
// Autenticação: cookie `mente_ai_token` (via @/lib/auth)
// Cache: HTTP 5 min + cache interno do calculator
//
// GET /api/aura/[userId]
//   → 200 { color, colorHex, intensity, pattern, score, phase, nextMilestone }
//   → 401 se não autenticado
//   → 403 se userId ≠ usuário autenticado
//   → 404 se usuário não existe
//   → 500 se erro de banco

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
    // ─── Autenticação ──────────────────────────────────────────────────────
    const token = getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const authPayload = await verifyToken(token);
    if (!authPayload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { userId } = await params;
    const requestedUserId = parseInt(userId, 10);

    if (isNaN(requestedUserId)) {
      return NextResponse.json({ error: "userId inválido" }, { status: 400 });
    }

    // Apenas o próprio usuário pode ver sua aura
    if (String(authPayload.userId) !== userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // ─── Cache ─────────────────────────────────────────────────────────────
    const cacheKey = `user:${requestedUserId}`;
    const cached = getCachedAura(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "private, max-age=300" },
      });
    }

    // ─── Queries Drizzle ───────────────────────────────────────────────────
    const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

    // XP: conta episódios completados × 50 XP cada
    const xpResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.watchProgress)
      .where(
        sql`${schema.watchProgress.userId} = ${requestedUserId} AND ${schema.watchProgress.isCompleted} = true`
      );
    const xp = (xpResult[0]?.count ?? 0) * 50;

    // Decisões: conta decisões narrativas do usuário
    const decisionsResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.interactiveDecisions)
      .where(sql`${schema.interactiveDecisions.userId} = ${requestedUserId}`);
    const decisions = decisionsResult[0]?.count ?? 0;

    // Temporadas: conta temporadas com pelo menos 1 episódio assistido
    const seasonsResult = await db
      .select({ count: sql<number>`count(distinct ${schema.watchProgress.seasonNumber})`.mapWith(Number) })
      .from(schema.watchProgress)
      .where(sql`${schema.watchProgress.userId} = ${requestedUserId}`);
    const seasons = seasonsResult[0]?.count ?? 0;

    // ─── Cálculo ───────────────────────────────────────────────────────────
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
