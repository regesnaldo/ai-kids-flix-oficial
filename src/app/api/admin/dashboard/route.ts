import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { fraudLog, xpEvents } from "@/lib/db/schema-extensions";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { sql, eq, gte } from "drizzle-orm";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    // Auth check — only admins
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const [currentUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);

    if (currentUser?.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado — admin only" }, { status: 403 });
    }

    // Total users
    const [userCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users);

    // XP today
    const today = new Date().toISOString().split("T")[0];
    const [xpToday] = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(xpEvents)
      .where(gte(xpEvents.createdAt, new Date(today)));

    // Fraud alerts (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const alerts = await db.select()
      .from(fraudLog)
      .where(gte(fraudLog.flaggedAt, thirtyDaysAgo))
      .orderBy(sql`flagged_at DESC`)
      .limit(20);

    return NextResponse.json({
      totalUsers: userCount?.count ?? 0,
      xpToday: xpToday?.total ?? 0,
      activeUsers: 0, // placeholder — would need websocket or KV for real-time
      fraudAlerts: alerts.map((a) => ({
        id: a.id,
        userId: a.userId,
        reason: a.reason,
        riskScore: a.riskScore,
        flaggedAt: a.flaggedAt?.toISOString() || new Date().toISOString(),
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const [currentUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
    if (currentUser?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

    const body = await request.json() as { action: string; targetUserId: number };
    if (body.action === "suspend" && body.targetUserId) {
      await db.update(users).set({ suspended: true } as any).where(eq(users.id, body.targetUserId));
      await db.insert(fraudLog).values({
        id: crypto.randomUUID(),
        userId: body.targetUserId,
        reason: `Suspenso manualmente pelo admin #${userId}`,
        riskScore: 100,
      });
      return NextResponse.json({ success: true, action: "suspended" });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
