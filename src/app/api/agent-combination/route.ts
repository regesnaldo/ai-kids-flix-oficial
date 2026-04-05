import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { combineAgents } from "@/services/agent-combination";

export const runtime = "nodejs";

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ─── POST /api/agent-combination ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── Autenticação ──────────────────────────────────────────────────────────
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json(
      { sucesso: false, erro: "Autenticação necessária." },
      { status: 401 },
    );
  }

  // ── Payload ───────────────────────────────────────────────────────────────
  let agentAId: string | undefined;
  let agentBId: string | undefined;

  try {
    const body = await request.json() as { agentAId?: unknown; agentBId?: unknown };
    if (typeof body.agentAId === "string") agentAId = body.agentAId.trim();
    if (typeof body.agentBId === "string") agentBId = body.agentBId.trim();
  } catch {
    return NextResponse.json(
      { sucesso: false, erro: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  if (!agentAId || !agentBId) {
    return NextResponse.json(
      { sucesso: false, erro: "agentAId e agentBId são obrigatórios." },
      { status: 400 },
    );
  }

  // ── Lógica de combinação ──────────────────────────────────────────────────
  try {
    const resultado = await combineAgents(userId, agentAId, agentBId);

    if (!resultado.sucesso) {
      // Mapear motivoErro para código HTTP semântico
      const statusMap: Record<string, number> = {
        COMBINACAO_NAO_EXISTE: 404,
        AGENTE_BLOQUEADO:      403,
        COMBINACAO_INATIVA:    409,
        INTERNO:               500,
      };
      const status = statusMap[resultado.motivoErro ?? "INTERNO"] ?? 400;
      return NextResponse.json(resultado, { status });
    }

    return NextResponse.json(resultado, { status: 200 });

  } catch (error) {
    console.error("[agent-combination] Erro inesperado:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Falha interna ao processar combinação." },
      { status: 500 },
    );
  }
}
