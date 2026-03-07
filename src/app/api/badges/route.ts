import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { explorers } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const total = await db.select().from(explorers);
    return NextResponse.json({
      langchain: { active: true, label: "MOVIDO POR IA", description: "Motor de decisão LangChain ativo" },
      adaptive: { total: total.length, label: "IA ADAPTATIVA", description: `${total.length} exploradores cadastrados` },
      filtered: { total: total.length, label: "CONTEÚDO FILTRADO", description: "Feito para formar pensadores, não seguidores" },
    });
  } catch {
    return NextResponse.json({
      langchain: { active: true, label: "MOVIDO POR IA", description: "Motor de decisão LangChain ativo" },
      adaptive: { total: 0, label: "IA ADAPTATIVA", description: "Banco conectando..." },
      filtered: { total: 0, label: "CONTEÚDO FILTRADO", description: "Feito para formar pensadores, não seguidores" },
    });
  }
}
