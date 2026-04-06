import { NextRequest, NextResponse } from "next/server";
import { UNIVERSOS } from "@/data/universos";

export async function GET(_: NextRequest, context: { params: Promise<{ agente: string }> }) {
  const { agente } = await context.params;
  const id = (agente || "").toLowerCase();
  const universo = UNIVERSOS[id as keyof typeof UNIVERSOS];

  if (!universo) {
    return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    universo,
    agenteId: id,
  });
}

