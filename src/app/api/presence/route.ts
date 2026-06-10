import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/mysql2";
import { v4 as uuid } from "uuid";
import * as schema from "@/lib/db/schema";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

// GET /api/presence — contagem de participantes por universo (últimos 5 min)
export async function GET() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const rows = await db
      .select({
        agentId: schema.universePresence.agentId,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(schema.universePresence)
      .where(sql`${schema.universePresence.lastSeen} >= ${fiveMinutesAgo}`)
      .groupBy(schema.universePresence.agentId);

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

    // Usa cookie mente_ai_token para identificar usuário
    const token = req.cookies.get("mente_ai_token")?.value;
    const userId = token ? atob(token) : "anon";

    await db
      .insert(schema.universePresence)
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
