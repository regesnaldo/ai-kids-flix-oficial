import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgeUnit, knowledgeAsset } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  NEXUS_T01E02_UNIT, NEXUS_T01E02_ASSET,
  NEXUS_T01E03_UNIT, NEXUS_T01E03_ASSET,
  NEXUS_T01E04_UNIT, NEXUS_T01E04_ASSET,
  NEXUS_T01E05_UNIT, NEXUS_T01E05_ASSET,
} from "@/data/seed/season-01-nexus";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const episodes = [
      { unit: NEXUS_T01E02_UNIT, asset: NEXUS_T01E02_ASSET },
      { unit: NEXUS_T01E03_UNIT, asset: NEXUS_T01E03_ASSET },
      { unit: NEXUS_T01E04_UNIT, asset: NEXUS_T01E04_ASSET },
      { unit: NEXUS_T01E05_UNIT, asset: NEXUS_T01E05_ASSET },
    ];

    const results: string[] = [];

    for (const { unit, asset } of episodes) {
      const agentId = asset.agentId!;
      const season = asset.season!;
      const episode = asset.episode!;

      // Upsert knowledge_unit
      const existingUnit = await db
        .select()
        .from(knowledgeUnit)
        .where(eq(knowledgeUnit.id, unit.id!))
        .limit(1);

      if (existingUnit.length === 0) {
        await db.insert(knowledgeUnit).values(unit as any);
        results.push(`✅ Unit created: ${unit.title} (S01E${episode})`);
      } else {
        await db.update(knowledgeUnit).set(unit as any).where(eq(knowledgeUnit.id, unit.id!));
        results.push(`🔄 Unit updated: ${unit.title} (S01E${episode})`);
      }

      // Upsert knowledge_asset
      const existingAsset = await db
        .select()
        .from(knowledgeAsset)
        .where(
          and(
            eq(knowledgeAsset.agentId, agentId),
            eq(knowledgeAsset.season, season),
            eq(knowledgeAsset.episode, episode),
          )
        )
        .limit(1);

      if (existingAsset.length === 0) {
        await db.insert(knowledgeAsset).values(asset as any);
        results.push(`✅ Asset created: S01E${episode}`);
      } else {
        await db
          .update(knowledgeAsset)
          .set(asset as any)
          .where(
            and(
              eq(knowledgeAsset.agentId, agentId),
              eq(knowledgeAsset.season, season),
              eq(knowledgeAsset.episode, episode),
            )
          );
        results.push(`🔄 Asset updated: S01E${episode}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `4 episodes processed`,
      results,
      episodes: episodes.map((e) => ({
        title: e.unit.title,
        season: e.asset.season,
        episode: e.asset.episode,
      })),
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      { error: "Seed failed", details: err.message },
      { status: 500 }
    );
  }
}
