import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

    // Busca o explorer vinculado ao usuário (pelo campo email ou name no explorer table)
    // Como fallback, usa o userId diretamente como explorerId se não encontrar
    const explorerRows = await db
      .select({ id: schema.explorers.id })
      .from(schema.explorers)
      .where(sql`${schema.explorers.email} = ${userId} OR ${schema.explorers.name} = ${userId}`)
      .limit(1);

    // Se não encontrar explorer, tenta usar userId como explorerId numérico
    let completed = 0;
    if (explorerRows.length > 0) {
      const explorerId = explorerRows[0].id;
      const progress = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(schema.explorerProgress)
        .where(
          sql`${schema.explorerProgress.explorerId} = ${explorerId} AND ${schema.explorerProgress.completed} = true`
        );
      completed = progress[0]?.count ?? 0;
    }

    const total = 100;
    const eligible = completed >= total;

    return NextResponse.json({ eligible, completed, total, progress: `${completed}/${total}` });
  } catch (error) {
    console.error("[certificate]", error);
    return NextResponse.json({ eligible: false, completed: 0, total: 100, progress: "0/100" });
  }
}
