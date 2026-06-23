/**
 * Teste de banco de dados para o endpoint /api/home/journey
 *
 * Verifica:
 * 1. Conexão com TiDB via Drizzle ORM
 * 2. Estrutura/colunas da tabela user_profile
 * 3. Estrutura/colunas da tabela watchProgress
 * 4. Fluxo completo: consulta user_profile + contagem watchProgress
 *
 * Uso: npx tsx scripts/test-journey-db.ts
 *
 * NOTA: Copia a lógica de conexão do db/index.ts mas sem o `server-only` guard,
 * pois este script é executado fora do contexto Next.js.
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq, count, and, sql } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { userProfile } from "../src/lib/db/schema-narrative";
import { watchProgress } from "../src/lib/db/schema";

// Load .env.local manually for standalone script
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

async function getTestDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "[TEST] DATABASE_URL não definida. Certifique-se de que .env.local existe."
    );
  }

  const parsed = new URL(url);

  const pool = mysql.createPool({
    host: parsed.hostname,
    port: parseInt(parsed.port || "4000"),
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace("/", ""),
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  });

  return drizzle(pool, { schema, mode: "default" });
}

async function main() {
  console.log("=".repeat(60));
  console.log("🧪 TESTE: Jornada — Consulta de Perfil Cognitivo + WatchProgress");
  console.log("=".repeat(60));

  const db = await getTestDb();

  // ─── 1. Verificar user_profile ───────────────────────────────────────────
  console.log("\n📋 1. Verificando tabela user_profile...\n");

  try {
    const allProfiles = await db
      .select({
        userId: userProfile.userId,
        emotionalDim: userProfile.emotionalDim,
        intellectualDim: userProfile.intellectualDim,
        moralDim: userProfile.moralDim,
        archetypeLabel: userProfile.archetypeLabel,
        lastAgentId: userProfile.lastAgentId,
      })
      .from(userProfile)
      .limit(10);

    console.log(`   ✅ user_profile acessível! Registros encontrados: ${allProfiles.length}`);
    if (allProfiles.length > 0) {
      console.log(`   📊 Amostra do primeiro registro:`);
      console.log(`      userId:           ${allProfiles[0].userId}`);
      console.log(`      emotionalDim:     ${allProfiles[0].emotionalDim}`);
      console.log(`      intellectualDim:  ${allProfiles[0].intellectualDim}`);
      console.log(`      moralDim:         ${allProfiles[0].moralDim}`);
      console.log(`      archetypeLabel:   ${allProfiles[0].archetypeLabel}`);
      console.log(`      lastAgentId:      ${allProfiles[0].lastAgentId}`);
    } else {
      console.log(`   ℹ️  Nenhum registro encontrado em user_profile.`);
      console.log(`      (Isso é esperado se nenhum onboarding foi concluído.)`);
    }
  } catch (err) {
    console.error(`   ❌ Erro ao consultar user_profile:`, err);
    process.exit(1);
  }

  // ─── 2. Verificar watchProgress ──────────────────────────────────────────
  console.log("\n📋 2. Verificando tabela watchProgress...\n");

  try {
    const allProgress = await db
      .select({
        userId: watchProgress.userId,
        isCompleted: watchProgress.isCompleted,
      })
      .from(watchProgress)
      .limit(10);

    console.log(`   ✅ watchProgress acessível! Registros encontrados: ${allProgress.length}`);
    if (allProgress.length > 0) {
      console.log(`   📊 Amostra do primeiro registro:`);
      console.log(`      userId:       ${allProgress[0].userId}`);
      console.log(`      isCompleted:  ${allProgress[0].isCompleted}`);
    } else {
      console.log(`   ℹ️  Nenhum registro encontrado em watchProgress.`);
    }
  } catch (err) {
    console.error(`   ❌ Erro ao consultar watchProgress:`, err);
    process.exit(1);
  }

  // ─── 3. Simular o fluxo completo da journey ─────────────────────────────
  console.log("\n📋 3. Simulando fluxo completo da journey para cada userId em user_profile...\n");

  try {
    const profiles = await db
      .select()
      .from(userProfile)
      .limit(10);

    const DESTINATIONS: Record<string, string[]> = {
      analytical: ["NEXUS", "AXIOM"],
      rebel: ["KAOS", "ETHOS"],
      paralyzed: ["VOLT"],
      empathetic: ["TERRA", "LYRA"],
      strategic: ["STRATOS"],
      creative: ["PRISM", "AURORA"],
    };

    for (const row of profiles) {
      const uid = row.userId;

      const completedResult = await db
        .select({ value: count() })
        .from(watchProgress)
        .where(and(eq(watchProgress.userId, uid), eq(watchProgress.isCompleted, true)));

      const completedCount = completedResult[0]?.value ?? 0;
      const archetype = row.archetypeLabel ?? "creative";
      const recommended = (DESTINATIONS[archetype]?.[0] ?? "NEXUS").toUpperCase();

      console.log(`   👤 userId=${uid}:`);
      console.log(`      archetype:       ${archetype}`);
      console.log(`      recommended:     ${recommended}`);
      console.log(`      emotionalDim:    ${row.emotionalDim}`);
      console.log(`      intellectualDim: ${row.intellectualDim}`);
      console.log(`      moralDim:        ${row.moralDim}`);
      console.log(`      completed:       ${completedCount}`);
      console.log(`      needsOnboarding: false`);
      console.log("");
    }

    if (profiles.length === 0) {
      console.log(`   ℹ️  Nenhum perfil para simular. Fluxo de onboarding seria:`);
      console.log(`      {`);
      console.log(`        archetype: null,`);
      console.log(`        recommended: "NEXUS",`);
      console.log(`        needsOnboarding: true,`);
      console.log(`        completed: 0,`);
      console.log(`        userId: <id_do_usuario>`);
      console.log(`      }`);
      console.log(``);
    }
  } catch (err) {
    console.error(`   ❌ Erro ao simular fluxo:`, err);
    process.exit(1);
  }

  // ─── 4. Verificar colunas reais via INFORMATION_SCHEMA ────────────────────
  console.log("📋 4. Verificando estrutura real das tabelas via INFORMATION_SCHEMA...\n");

  for (const tableName of ["user_profile", "watchProgress"]) {
    try {
      const result = await db.execute(
        sql`SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ${tableName}
              AND TABLE_SCHEMA = 'mente_ai'
            ORDER BY ORDINAL_POSITION`
      );

      console.log(`   📊 Colunas reais de ${tableName}:`);
      const rawRows = Array.isArray(result) ? result : (result as any)[0] ?? [];

      // Debug: show raw structure
      if (rawRows.length > 0) {
        const first = rawRows[0];
        console.log(`      (tipo do resultado: ${typeof first}, é array: ${Array.isArray(first)})`);
        console.log(`      chaves: ${Object.keys(first).join(", ")}`);
        for (const key of Object.keys(first)) {
          const val = first[key as keyof typeof first];
          if (typeof val === "object" && val !== null) {
            console.log(`      ${key} = ${JSON.stringify(val)}`);
          } else {
            console.log(`      ${key} = ${String(val)}`);
          }
        }
      } else {
        console.log(`      (nenhuma coluna encontrada — tabela pode não existir)`);
      }
      console.log();
    } catch (err) {
      console.log(`   ⚠️  Não foi possível descrever ${tableName}: ${(err as Error).message}`);
      console.log();
    }
  }

  // ─── Conclusão ──────────────────────────────────────────────────────────
  console.log("=".repeat(60));
  console.log("✅ TESTE CONCLUÍDO");
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
