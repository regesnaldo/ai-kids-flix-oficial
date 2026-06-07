// ─── scripts/seed-knowledge-model.ts ─────────────────────────────────────────
//
// Seed script — insere os episódios no TiDB via Drizzle.
// Executar: npx tsx scripts/seed-knowledge-model.ts
//
// ⚠️ Requer DATABASE_URL configurada no .env.local
// ⚠️ As tabelas knowledge_unit, knowledge_asset, knowledge_graph_edge
//    precisam existir (rode drizzle/0004_knowledge_model.sql primeiro)

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../src/lib/db/schema";

// Importa todos os seeds
import {
  NEXUS_T01E01_UNIT, NEXUS_T01E01_ASSET, NEXUS_T01E01_EDGES,
  NEXUS_T01E02_UNIT, NEXUS_T01E02_ASSET, NEXUS_T01E02_EDGES,
  NEXUS_T01E03_UNIT, NEXUS_T01E03_ASSET, NEXUS_T01E03_EDGES,
  NEXUS_T01E04_UNIT, NEXUS_T01E04_ASSET, NEXUS_T01E04_EDGES,
  NEXUS_T01E05_UNIT, NEXUS_T01E05_ASSET, NEXUS_T01E05_EDGES,
} from "../src/data/seed/season-01-nexus";

import {
  VOLT_T01E01_UNIT, VOLT_T01E01_ASSET, VOLT_T01E01_EDGES,
  VOLT_T01E02_UNIT, VOLT_T01E02_ASSET, VOLT_T01E02_EDGES,
  VOLT_T01E03_UNIT, VOLT_T01E03_ASSET, VOLT_T01E03_EDGES,
  VOLT_T01E04_UNIT, VOLT_T01E04_ASSET, VOLT_T01E04_EDGES,
  VOLT_T01E05_UNIT, VOLT_T01E05_ASSET, VOLT_T01E05_EDGES,
  VOLT_T01E06_UNIT, VOLT_T01E06_ASSET, VOLT_T01E06_EDGES,
  VOLT_T01E07_UNIT, VOLT_T01E07_ASSET, VOLT_T01E07_EDGES,
  VOLT_T01E08_UNIT, VOLT_T01E08_ASSET, VOLT_T01E08_EDGES,
  VOLT_T01E09_UNIT, VOLT_T01E09_ASSET, VOLT_T01E09_EDGES,
  VOLT_T01E10_UNIT, VOLT_T01E10_ASSET, VOLT_T01E10_EDGES,
} from "../src/data/seed/season-01-volt";

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });

  console.log("🌱 Iniciando seed do Knowledge Model...\n");

  // Coleção de todos os units + assets + edges
  const units = [
    NEXUS_T01E01_UNIT, NEXUS_T01E02_UNIT, NEXUS_T01E03_UNIT,
    NEXUS_T01E04_UNIT, NEXUS_T01E05_UNIT,
    VOLT_T01E01_UNIT, VOLT_T01E02_UNIT, VOLT_T01E03_UNIT,
    VOLT_T01E04_UNIT, VOLT_T01E05_UNIT, VOLT_T01E06_UNIT,
    VOLT_T01E07_UNIT, VOLT_T01E08_UNIT, VOLT_T01E09_UNIT,
    VOLT_T01E10_UNIT,
  ];
  const assets = [
    NEXUS_T01E01_ASSET, NEXUS_T01E02_ASSET, NEXUS_T01E03_ASSET,
    NEXUS_T01E04_ASSET, NEXUS_T01E05_ASSET,
    VOLT_T01E01_ASSET, VOLT_T01E02_ASSET, VOLT_T01E03_ASSET,
    VOLT_T01E04_ASSET, VOLT_T01E05_ASSET, VOLT_T01E06_ASSET,
    VOLT_T01E07_ASSET, VOLT_T01E08_ASSET, VOLT_T01E09_ASSET,
    VOLT_T01E10_ASSET,
  ];
  const edges = [
    ...NEXUS_T01E01_EDGES, ...NEXUS_T01E02_EDGES, ...NEXUS_T01E03_EDGES,
    ...NEXUS_T01E04_EDGES, ...NEXUS_T01E05_EDGES,
    ...VOLT_T01E01_EDGES, ...VOLT_T01E02_EDGES, ...VOLT_T01E03_EDGES,
    ...VOLT_T01E04_EDGES, ...VOLT_T01E05_EDGES, ...VOLT_T01E06_EDGES,
    ...VOLT_T01E07_EDGES, ...VOLT_T01E08_EDGES, ...VOLT_T01E09_EDGES,
    ...VOLT_T01E10_EDGES,
  ];

  // Insert units
  for (const unit of units) {
    await db.insert(schema.knowledgeUnit).values(unit).onDuplicateKeyUpdate({
      set: { title: unit.title, status: unit.status, version: unit.version },
    });
    console.log(`  ✅ unit: ${unit.title}`);
  }

  // Insert assets
  for (const asset of assets) {
    await db.insert(schema.knowledgeAsset).values(asset).onDuplicateKeyUpdate({
      set: { content: asset.content, status: asset.status, version: asset.version },
    });
    console.log(`  ✅ asset: ${asset.id}`);
  }

  // Insert edges — try/catch to ignore duplicates (MySQL error 1062)
  for (const edge of edges) {
    try {
      await db.insert(schema.knowledgeGraphEdge).values(edge);
      console.log(`  ✅ edge: ${edge.fromUnitId} → ${edge.toUnitId}`);
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
        console.log(`  ⏭ edge já existe: ${edge.fromUnitId} → ${edge.toUnitId}`);
      } else {
        throw err;
      }
    }
  }

  console.log(`\n🎉 Seed concluído: ${units.length} units, ${assets.length} assets, ${edges.length} edges`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err.message);
  process.exit(1);
});
