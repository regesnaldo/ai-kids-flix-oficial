import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { xpEvents, fraudLog } from "@/lib/db/schema-extensions";
import { users } from "@/lib/db/schema";
import { eq, and, gte, sql, like } from "drizzle-orm";
import crypto from "crypto";

interface FraudResult {
  riskScore: number;
  flags: string[];
}

async function velocityCheck(userId: number): Promise<string[]> {
  const flags: string[] = [];
  const oneHourAgo = new Date(Date.now() - 60 * 60000);

  const [result] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(xpEvents)
    .where(and(eq(xpEvents.userId, userId), gte(xpEvents.createdAt, oneHourAgo)));

  if ((result?.count ?? 0) > 10) {
    flags.push(`Velocidade suspeita: ${result!.count} eventos de XP em 60 minutos`);
  }
  return flags;
}

async function emailSimilarityCheck(userId: number): Promise<string[]> {
  const flags: string[] = [];
  const [user] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user?.email) return flags;

  const normalized = user.email.replace(/[+.]/g, "").split("@")[0];
  if (normalized.length < 3) return flags;

  const [similar] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(and(like(users.email, `%${normalized}%@%`), sql`id != ${userId}`));

  if ((similar?.count ?? 0) > 3) {
    flags.push(`${similar!.count} contas com email similar a ${user.email}`);
  }
  return flags;
}

export async function POST(request: NextRequest) {
  // ── Auth: JWT obrigatório (cookie mente_ai_token) ─────────────────────
  const token = getAuthCookieFromRequest(request);
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const authPayload = await verifyToken(token);
  if (!authPayload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  const adminUserId = Number(authPayload.userId);
  if (!Number.isInteger(adminUserId) || adminUserId <= 0) {
    return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
  }
  void adminUserId; // auth-only: userId do token não substitui body.userId

  try {
    const body = await request.json() as { userId: number };
    if (!body.userId) return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });

    const flags: string[] = [];
    flags.push(...(await velocityCheck(body.userId)));
    flags.push(...(await emailSimilarityCheck(body.userId)));

    const riskScore = Math.min(100, flags.length * 35);

    if (riskScore > 70) {
      await db.insert(fraudLog).values({
        id: crypto.randomUUID(),
        userId: body.userId,
        reason: flags.join("; "),
        riskScore,
      });
    }

    return NextResponse.json({ riskScore, flags } satisfies FraudResult);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
