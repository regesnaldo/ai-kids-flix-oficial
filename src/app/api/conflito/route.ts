import { NextRequest, NextResponse } from "next/server";
import { avaliarConflito, gerarIntervencaoNexus, listarConflitos } from "@/lib/conflito/conflict-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resultado = avaliarConflito({
      conflitoId: body?.conflitoId,
      agente1: body?.agente1,
      agente2: body?.agente2,
      interacoesSemResolucao: Number(body?.interacoesSemResolucao ?? 0),
    });

    if (!resultado.conflito) {
      return NextResponse.json(resultado, { status: 404 });
    }

    // Ação: intervenção direta de NEXUS
    if (resultado.intervencaoNecessaria) {
      return NextResponse.json({
        ...resultado,
        tipo: "NEXUS_INTERVENCAO",
        respostaNexus: gerarIntervencaoNexus(resultado.conflito),
      });
    }

    return NextResponse.json({
      ...resultado,
      tipo: "CONFLITO_ATIVO",
    });
  } catch (error) {
    console.error("[API /api/conflito] erro:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    conflitos: listarConflitos(),
  });
}

