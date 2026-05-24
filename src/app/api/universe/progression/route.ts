/**
 * API Route — Universe Progression
 *
 * GET  /api/universe/progression      → getOrCreateProgression(userId=1)
 * POST /api/universe/progression      → activatePlanet or completePlanet
 *        body: { action: "activate" | "complete", planetId: string }
 */

import { NextResponse } from "next/server";
import {
  getOrCreateProgression,
  activatePlanet,
  completePlanet,
} from "@/lib/universe/progression-engine.server";

// ─── GET: carrega estado do usuário ───────────────────────────────────────────

export async function GET() {
  try {
    const progression = await getOrCreateProgression(1);
    return NextResponse.json(progression);
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao carregar progressão" },
      { status: 500 }
    );
  }
}

// ─── POST: ativa ou completa planeta ──────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, planetId } = body;

    if (!planetId || typeof planetId !== "string") {
      return NextResponse.json(
        { error: "planetId é obrigatório" },
        { status: 400 }
      );
    }

    if (action === "activate") {
      const result = await activatePlanet(planetId as any, 1);
      return NextResponse.json(result);
    }

    if (action === "complete") {
      const result = await completePlanet(planetId as any, 1);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: `Ação desconhecida: ${action}. Use 'activate' ou 'complete'.` },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao processar ação" },
      { status: 500 }
    );
  }
}
