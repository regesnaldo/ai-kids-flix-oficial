import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { userAgentProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { agents } from "@/data/agents";

export const runtime = "nodejs";

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ─── GET /api/agent-combination/available ────────────────────────────────────
//
// Retorna a lista de agentes desbloqueados do usuário autenticado,
// enriquecida com os dados estáticos de @/data/agents.
//
// Response 200: { agentes: Agent[] }
// Response 401: { erro: string }

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ erro: "Autenticação necessária." }, { status: 401 });
  }

  try {
    // Buscar IDs dos agentes desbloqueados no banco
    const progressRows = await db
      .select({ agentId: userAgentProgress.agentId })
      .from(userAgentProgress)
      .where(
        and(
          eq(userAgentProgress.userId, userId),
          eq(userAgentProgress.desbloqueado, true),
        ),
      );

    const idsDesbloqueados = new Set(progressRows.map((r) => r.agentId));

    // Para usuários novos sem registros no banco, os 6 agentes de Fase 1
    // (ids 1-6) são desbloqueados por padrão (seed do migrate-fase2.js)
    const agentesDesbloqueados = progressRows.length === 0
      ? agents.filter((a) => parseInt(a.id) <= 6)
      : agents.filter((a) => idsDesbloqueados.has(a.id));

    return NextResponse.json({ agentes: agentesDesbloqueados }, { status: 200 });

  } catch (error) {
    console.error("[agent-combination/available] Erro:", error);
    return NextResponse.json(
      { erro: "Falha ao buscar agentes disponíveis.", agentes: [] },
      { status: 500 },
    );
  }
}
