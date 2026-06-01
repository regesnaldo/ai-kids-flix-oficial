/**
 * API Route — Universe Progression
 *
 * GET  /api/universe/progression      → getOrCreateProgression(userId from JWT)
 * POST /api/universe/progression      → activatePlanet or completePlanet
 *        body: { action: "activate" | "complete", planetId: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import {
  getOrCreateProgression,
  activatePlanet,
  completePlanet,
} from "@/lib/universe/progression-engine.server";

// ─── Helper: extrai userId do cookie JWT ─────────────────────────────────

async function getUserIdFromRequest(request: NextRequest): Promise<number> {
  const token = getAuthCookieFromRequest(request);
  if (!token) throw new AuthError("Token não encontrado");
  const payload = await verifyToken(token);
  if (!payload) throw new AuthError("Token inválido");
  const userId = Number(payload.userId);
  if (!Number.isInteger(userId) || userId <= 0) throw new AuthError("userId inválido no token");
  return userId;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// ─── GET: carrega estado do usuário autenticado ────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    const progression = await getOrCreateProgression(userId);
    return NextResponse.json(progression);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Falha ao carregar progressão" },
      { status: 500 }
    );
  }
}

// ─── POST: ativa ou completa planeta ──────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    const body = await request.json();
    const { action, planetId } = body;

    if (!planetId || typeof planetId !== "string") {
      return NextResponse.json(
        { error: "planetId é obrigatório" },
        { status: 400 }
      );
    }

    if (action === "activate") {
      const result = await activatePlanet(planetId as any, userId);
      return NextResponse.json(result);
    }

    if (action === "complete") {
      const result = await completePlanet(planetId as any, userId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: `Ação desconhecida: ${action}. Use 'activate' ou 'complete'.` },
      { status: 400 }
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Falha ao processar ação" },
      { status: 500 }
    );
  }
}
