import { NextRequest, NextResponse } from "next/server";
import {
  MASTER_CONFLICTS,
  MASTER_PHASES,
  MASTER_SEASONS,
  getMasterPhase,
  getMasterSeason,
  type FaseTematicaId,
} from "@/data/season-map";

export const runtime = "nodejs";

function parsePositiveInt(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function isFaseId(value: number): value is FaseTematicaId {
  return value >= 1 && value <= 5;
}

export async function GET(request: NextRequest) {
  const faseQuery = parsePositiveInt(request.nextUrl.searchParams.get("fase"));
  const temporadaQuery = parsePositiveInt(request.nextUrl.searchParams.get("temporada"));

  if (temporadaQuery) {
    const season = getMasterSeason(temporadaQuery);
    if (!season) {
      return NextResponse.json({ error: "Temporada não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      season,
      phase: getMasterPhase(season.fase),
      conflict: MASTER_CONFLICTS.find((c) => c.fase === season.fase) ?? null,
    });
  }

  if (faseQuery) {
    if (!isFaseId(faseQuery)) {
      return NextResponse.json({ error: "Fase inválida. Use 1-5." }, { status: 400 });
    }

    return NextResponse.json({
      phase: getMasterPhase(faseQuery),
      seasons: MASTER_SEASONS.filter((s) => s.fase === faseQuery),
      conflict: MASTER_CONFLICTS.find((c) => c.fase === faseQuery) ?? null,
    });
  }

  return NextResponse.json({
    phases: MASTER_PHASES,
    seasons: MASTER_SEASONS,
    conflicts: MASTER_CONFLICTS,
  });
}
