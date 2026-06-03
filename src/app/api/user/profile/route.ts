import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema-narrative";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const VALID_ARCHETYPES = [
  "analytical", "rebel", "paralyzed", "empathetic", "strategic", "creative", "explorer",
];

/**
 * POST /api/user/profile — Salva ou atualiza o perfil cognitivo do usuário.
 *
 * Body:
 *   {
 *     emotionalScore: number (0-1),
 *     intellectualScore: number (0-1),
 *     moralScore: number (0-1),
 *     archetype: string,
 *     lastAgentId?: string
 *   }
 *
 * Regras:
 *   - Requer JWT válido
 *   - Se perfil já existe → UPDATE
 *   - Se não existe → INSERT
 *   - Retorna 409 se conflito
 *   - Valores clamped para 0-1, 2 casas decimais
 */
export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = Number(payload.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "ID de usuário inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { emotionalScore, intellectualScore, moralScore, archetype, lastAgentId } = body;

    // Validação dos campos obrigatórios
    if (emotionalScore === undefined || intellectualScore === undefined || moralScore === undefined) {
      return NextResponse.json(
        { error: "emotionalScore, intellectualScore e moralScore são obrigatórios" },
        { status: 400 },
      );
    }

    if (!archetype || !VALID_ARCHETYPES.includes(archetype)) {
      return NextResponse.json(
        { error: `archetype inválido. Valores aceitos: ${VALID_ARCHETYPES.join(", ")}` },
        { status: 400 },
      );
    }

    // Clamp e formatação
    const clamp = (v: number) => Math.max(0, Math.min(1, Number(v.toFixed(2))));

    const profileData = {
      userId,
      emotionalDim: String(clamp(emotionalScore)),
      intellectualDim: String(clamp(intellectualScore)),
      moralDim: String(clamp(moralScore)),
      archetypeLabel: archetype,
      lastAgentId: lastAgentId ?? null,
    };

    // Verificar se já existe perfil para este userId
    const existing = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      // UPDATE
      await db
        .update(userProfile)
        .set(profileData)
        .where(eq(userProfile.userId, userId));

      return NextResponse.json({
        success: true,
        created: false,
        userId,
        profile: profileData,
      });
    }

    // INSERT
    await db.insert(userProfile).values(profileData);

    return NextResponse.json({
      success: true,
      created: true,
      userId,
      profile: profileData,
    });
  } catch (error) {
    console.error("[USER/PROFILE/POST]", error);
    return NextResponse.json({ error: "Erro ao salvar perfil cognitivo" }, { status: 500 });
  }
}

/**
 * GET /api/user/profile — Retorna o perfil cognitivo do usuário logado.
 *
 * Resposta:
 *   {
 *     userId: number,
 *     emotionalScore: number,
 *     intellectualScore: number,
 *     moralScore: number,
 *     archetype: string,
 *     lastAgentId: string | null,
 *     updatedAt: string
 *   }
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = Number(payload.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "ID de usuário inválido" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Perfil cognitivo não encontrado", userId },
        { status: 404 },
      );
    }

    const row = existing[0];

    return NextResponse.json({
      userId: row.userId,
      emotionalScore: Number(row.emotionalDim),
      intellectualScore: Number(row.intellectualDim),
      moralScore: Number(row.moralDim),
      archetype: row.archetypeLabel,
      lastAgentId: row.lastAgentId,
      updatedAt: row.updatedAt,
    });
  } catch (error) {
    console.error("[USER/PROFILE/GET]", error);
    return NextResponse.json({ error: "Erro ao buscar perfil cognitivo" }, { status: 500 });
  }
}
