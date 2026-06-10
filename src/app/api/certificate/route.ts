import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/lib/db/schema";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    // Conta quantos knowledge_units o usuário completou via explorerProgress
    const progress = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(schema.explorerProgress)
      .where(
        sql`${schema.explorerProgress.userId} = ${parseInt(userId)} AND ${schema.explorerProgress.completed} = true`
      );

    const completed = progress[0]?.count ?? 0;
    const total = 100; // 10 temporadas × 10 episódios
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
