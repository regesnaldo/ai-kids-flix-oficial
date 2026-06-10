import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    // Encontra o explorer associado ao userId
    const explorers = await db
      .select({ id: schema.explorers.id })
      .from(schema.explorers)
      .where(eq(schema.explorers.userId, parseInt(userId)))
      .limit(1);

    const explorerId = explorers[0]?.id;
    if (!explorerId) {
      return NextResponse.json({ eligible: false, completed: 0, total: 100, progress: "0/100" });
    }

    // Conta quantos knowledge_units o explorador completou
    const progress = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.explorerProgress)
      .where(
        sql`${schema.explorerProgress.explorerId} = ${explorerId} AND ${schema.explorerProgress.completed} = true`
      );

    const completed = progress[0]?.count ?? 0;
    const total = 100;
    const eligible = completed >= total;

    return NextResponse.json({
      eligible,
      completed,
      total,
      progress: `${completed}/${total}`,
      completedAt: eligible ? new Date().toISOString() : null,
    });
  } catch (error) {
    console.error("[certificate]", error);
    return NextResponse.json({ eligible: false, error: "Erro ao verificar progresso" }, { status: 500 });
  }
}
