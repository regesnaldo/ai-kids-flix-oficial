import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userXp, users } from "@/lib/db/schema";
import { referrals, rewards, type NewReward } from "@/lib/db/schema-extensions";
import { REWARD_LEVELS, checkLevelUp } from "@/lib/xp-engine";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);

    // Get user data
    const [user] = await db.select({ createdAt: users.createdAt }).from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    // Count valid referrals
    const [refCount] = await db.select({ count: sql<number>`COUNT(*)` })
      .from(referrals)
      .where(and(eq(referrals.referrerId, userId), eq(referrals.valid, true)));

    const validReferrals = refCount?.count ?? 0;
    const level = await checkLevelUp(userId, validReferrals, user.createdAt);

    if (!level) {
      return NextResponse.json({ unlocked: false, reason: "Requisitos não atendidos" });
    }

    // Check if already claimed
    const [existing] = await db.select().from(rewards)
      .where(and(eq(rewards.userId, userId), eq(rewards.level, level.level)))
      .limit(1);

    if (existing?.claimedAt) {
      return NextResponse.json({ unlocked: false, reason: `Nível ${level.level} já resgatado`, code: existing.code });
    }

    // Generate reward code
    const code = `MENTE-${level.level}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 90 * 86400000); // 90 days

    await db.insert(rewards).values({
      id: crypto.randomUUID(),
      userId,
      level: level.level,
      type: `discount_${level.level}`,
      code,
      claimedAt: new Date(),
      expiresAt,
    } satisfies NewReward);

    return NextResponse.json({
      unlocked: true,
      level: level.level,
      label: level.label,
      reward: level.reward,
      code,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const claimed = await db.select().from(rewards).where(eq(rewards.userId, userId));

    return NextResponse.json({ levels: REWARD_LEVELS, claimed });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
