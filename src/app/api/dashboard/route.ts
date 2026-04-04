import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, watchProgress, interactiveDecisions, favorites } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";

export const runtime = "nodejs";

async function getUserFromToken(request: NextRequest) {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  const userId = payload.userId ? Number(payload.userId) : NaN;
  if (!Number.isInteger(userId) || userId <= 0) return null;
  return { userId, email: payload.email };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getUserFromToken(request);
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await db.select().from(users).where(eq(users.id, auth.userId)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const u = user[0];

    const completedEpisodes = await db
      .select({ total: count() })
      .from(watchProgress)
      .where(sql`${watchProgress.userId} = ${auth.userId} AND ${watchProgress.isCompleted} = true`);

    const totalDecisions = await db
      .select({ total: count() })
      .from(interactiveDecisions)
      .where(eq(interactiveDecisions.userId, auth.userId));

    const totalFavorites = await db
      .select({ total: count() })
      .from(favorites)
      .where(eq(favorites.userId, auth.userId));

    const recentProgress = await db
      .select()
      .from(watchProgress)
      .where(eq(watchProgress.userId, auth.userId))
      .orderBy(sql`${watchProgress.lastWatchedAt} DESC`)
      .limit(5);

    return NextResponse.json({
      user: {
        name: u.name,
        email: u.email,
        plan: u.subscriptionPlan,
        planStatus: u.subscriptionStatus,
        memberSince: u.createdAt,
      },
      stats: {
        episodesCompleted: completedEpisodes[0]?.total ?? 0,
        decisionsMade: totalDecisions[0]?.total ?? 0,
        favorites: totalFavorites[0]?.total ?? 0,
      },
      recentProgress,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json({ error: "Erro ao carregar dashboard", details: String(error) }, { status: 500 });
  }
}
