import { and, eq } from "drizzle-orm";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { AGE_GROUPS, TRACKS, type AgeGroup, type TrackId, explorers } from "@/lib/db/schema";

export const runtime = "nodejs";

type UniverseDefinitions = {
  ageGroups: readonly string[];
  tracks: readonly string[];
};

function parseSlashSeparatedItems(markdown: string, sectionTitle: string): string[] {
  const escapedTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`## ${escapedTitle}\\s*\\r?\\n-\\s*(.+)`, "i");
  const match = markdown.match(regex);
  if (!match?.[1]) {
    return [];
  }

  return match[1]
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadUniverseDefinitions(): Promise<UniverseDefinitions> {
  const fallback = { ageGroups: AGE_GROUPS, tracks: TRACKS };
  const filePath = path.join(process.cwd(), "universe-core", "AI_KIDS_FLIX_UNIVERSE_BASE.md");

  try {
    const content = await readFile(filePath, "utf8");
    const parsedAgeGroups = parseSlashSeparatedItems(content, "Faixas Etarias");
    const parsedTracks = parseSlashSeparatedItems(content, "Trilhas");

    return {
      ageGroups: parsedAgeGroups.length > 0 ? parsedAgeGroups : fallback.ageGroups,
      tracks: parsedTracks.length > 0 ? parsedTracks : fallback.tracks,
    };
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  const ageFilter = request.nextUrl.searchParams.get("idade") ?? request.nextUrl.searchParams.get("age");
  const trackFilter =
    request.nextUrl.searchParams.get("trilha") ?? request.nextUrl.searchParams.get("track");

  const universe = await loadUniverseDefinitions();

  if (ageFilter && !universe.ageGroups.includes(ageFilter)) {
    return NextResponse.json(
      {
        error: "Parametro idade invalido.",
        allowedAgeGroups: universe.ageGroups,
      },
      { status: 400 },
    );
  }

  if (trackFilter && !universe.tracks.includes(trackFilter)) {
    return NextResponse.json(
      {
        error: "Parametro trilha invalido.",
        allowedTracks: universe.tracks,
      },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        error: "DATABASE_URL nao configurada.",
      },
      { status: 503 },
    );
  }

  try {
    const conditions = [];

    if (ageFilter) {
      conditions.push(eq(explorers.ageGroup, ageFilter as AgeGroup));
    }

    if (trackFilter) {
      conditions.push(eq(explorers.track, trackFilter as TrackId));
    }

    const query = db.select().from(explorers);
    const data =
      conditions.length === 0
        ? await query
        : conditions.length === 1
          ? await query.where(conditions[0]!)
          : await query.where(and(conditions[0]!, conditions[1]!));

    return NextResponse.json({
      filters: {
        idade: ageFilter ?? null,
        trilha: trackFilter ?? null,
      },
      universe,
      total: data.length,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao listar videos no explorer.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
