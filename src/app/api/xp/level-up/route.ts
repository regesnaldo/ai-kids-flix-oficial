import { NextRequest, NextResponse } from "next/server";
import { checkLevelUp, REWARD_LEVELS } from "@/lib/xp-engine";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { referrals } from "@/lib/db/schema-extensions";
import { eq, and, sql } from "drizzle-orm";

/** GET /api/xp/level-up — check if user qualifies for level-up reward */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);

    // Get user creation date
    const [user] = await db.select({ createdAt: users.createdAt })
      .from(users).where(eq(users.id, userId)).limit(1);

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    // Count valid referrals
    const [refCount] = await db.select({ count: sql<number>`COUNT(*)` })
      .from(referrals)
      .where(and(eq(referrals.referrerId, userId), eq(referrals.valid, true)));

    const level = await checkLevelUp(
      userId,
      Number(refCount?.count ?? 0),
      new Date(user.createdAt ?? new Date())
    );

    return NextResponse.json({
      currentLevel: level,
      allLevels: REWARD_LEVELS,
      unlocked: level !== null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
