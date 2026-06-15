import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema-narrative";
import { watchProgress } from "@/lib/db/schema";
import { eq, count, and } from "drizzle-orm";

const DESTINATIONS: Record<string, string[]> = {
  analytical: ["NEXUS", "AXIOM"],
  rebel: ["KAOS", "ETHOS"],
  paralyzed: ["VOLT"],
  empathetic: ["TERRA", "LYRA"],
  strategic: ["STRATOS"],
  creative: ["PRISM", "AURORA"],
};

export async function GET(request: NextRequest) {
  try {
    // 1. Extrair token do cookie
    const token = getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 2. Verificar JWT
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = Number(payload.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "ID de usuário inválido" }, { status: 400 });
    }

    // 3. Consultar user_profile no TiDB
    const profiles = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    // 4. Consultar watchProgress para completedEpisodes count
    const completedResult = await db
      .select({ value: count() })
      .from(watchProgress)
      .where(and(eq(watchProgress.userId, userId), eq(watchProgress.isCompleted, true)));

    const completedCount = completedResult[0]?.value ?? 0;

    // 5. Se user_profile não existir → onboarding
    if (profiles.length === 0) {
      return NextResponse.json({
        archetype: null,
        recommended: "NEXUS",
        needsOnboarding: true,
        completed: 0,
        userId,
      });
    }

    // 6. Perfil existe → retornar dados reais
    const row = profiles[0];
    const archetype = row.archetypeLabel ?? "creative";
    const recommended = (DESTINATIONS[archetype]?.[0] ?? "NEXUS").toUpperCase();

    return NextResponse.json({
      archetype,
      recommended,
      needsOnboarding: false,
      completed: completedCount,
      userId,
      dimensions: {
        emotional: Number(row.emotionalDim),
        intellectual: Number(row.intellectualDim),
        moral: Number(row.moralDim),
      },
    });
  } catch (error) {
    console.error("Erro em GET /api/home/journey:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
