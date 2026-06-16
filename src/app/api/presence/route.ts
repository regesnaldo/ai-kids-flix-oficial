import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { universePresence } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

// GET /api/presence — contagem de participantes por universo (últimos 5 min)
export async function GET() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const rows = await db
      .select({
        agentId: universePresence.agentId,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(universePresence)
      .where(sql`${universePresence.lastSeen} >= ${fiveMinutesAgo}`)
      .groupBy(universePresence.agentId);

    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.agentId] = row.count;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[presence GET]", error);
    return NextResponse.json({});
  }
}

// POST /api/presence — registra presença do usuário em um universo
export async function POST(req: NextRequest) {
  try {
    const { agentId } = await req.json();
    if (!agentId) return NextResponse.json({ error: "agentId required" }, { status: 400 });

    // Verifica autenticação via JWT (cookie mente_ai_token)
    const token = await getAuthCookieFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    const userId = String(payload.userId);

    await db
      .insert(universePresence)
      .values({
        id: uuid(),
        userId,
        agentId,
        lastSeen: new Date(),
        createdAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: { lastSeen: new Date() },
      });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[presence POST]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
