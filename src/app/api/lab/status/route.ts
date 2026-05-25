import { NextRequest, NextResponse } from "next/server";
import { kvGetCounter } from "../board-store";

// ── GET /api/lab/status ──────────────────────────────────────────────
export async function GET(_request: NextRequest) {
  try {
    const active = kvGetCounter("global_active");
    const status = active < 5 ? "green" : active < 8 ? "yellow" : "red";

    return NextResponse.json({
      status,
      active,
      message:
        status === "green"
          ? "Laboratório operando em plena capacidade"
          : status === "yellow"
          ? "Alta atividade — experimentos instantâneos recomendados"
          : "Laboratório sincronizando — use perguntas conhecidas",
    });
  } catch {
    return NextResponse.json({ status: "green", active: 0, message: "Operacional" });
  }
}
