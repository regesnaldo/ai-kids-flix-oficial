// ─── src/app/api/series/content/route.ts ────────────────────────────────────
//
// Knowledge Asset Layer — Content Resolution API
//
// GET /api/series/content?agent=nexus&season=1&ep=3
//
// Flow:
//   1. Check knowledge_asset table (TiDB) for published content
//   2. If found → return cached content with X-Content-Source: cached
//   3. If not found → check for draft → return draft with X-Content-Source: draft
//   4. If nothing exists → resolveProviderWithFallback() → DeepSeek → Groq
//   5. Generate screenplay, save to knowledge_unit + knowledge_asset, return
//      with X-Content-Source: generated

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgeAsset, knowledgeUnit } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { resolveProviderWithFallback, chat } from "@/lib/llm/provider";
import crypto from "crypto";

export const runtime = "nodejs";

const SCREENPLAY_SYSTEM_PROMPT = `Você é um roteirista de séries educativas do MENTE.AI.
Gere um roteiro cinematográfico interativo em português brasileiro.
Responda APENAS com JSON válido neste formato:
{
  "abertura": "cena de abertura (150-300 caracteres)",
  "narrativa": "conteúdo educacional (400-800 caracteres)",
  "pausas": [
    { "pergunta": "...", "opcoes": ["A", "B", "C"], "continuacoes": ["...", "...", "..."] },
    { "pergunta": "...", "opcoes": ["A", "B", "C"], "continuacoes": ["...", "...", "..."] }
  ],
  "encerramento": "gancho para próximo episódio (150-250 caracteres)"
}`;

function uuid() {
  return crypto.randomUUID();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agent");
    const season = searchParams.get("season");
    const episode = searchParams.get("ep");

    if (!agentId || !season || !episode) {
      return NextResponse.json(
        { error: "agent, season, ep são obrigatórios" },
        { status: 400 },
      );
    }

    const seasonNum = parseInt(season, 10);
    const episodeNum = parseInt(episode, 10);

    if (isNaN(seasonNum) || isNaN(episodeNum)) {
      return NextResponse.json(
        { error: "season e ep devem ser números" },
        { status: 400 },
      );
    }

    // ─── Step 1: Check cache ──────────────────────────────────────────

    const assets = await db
      .select()
      .from(knowledgeAsset)
      .where(
        and(
          eq(knowledgeAsset.agentId, agentId),
          eq(knowledgeAsset.season, seasonNum),
          eq(knowledgeAsset.episode, episodeNum),
          eq(knowledgeAsset.type, "episode"),
        ),
      )
      .orderBy(knowledgeAsset.updatedAt);

    const published = assets.find((a) => a.status === "published");

    if (published) {
      console.log("[SERIES/CONTENT] CACHE HIT —", agentId, seasonNum, episodeNum);

      const units = await db
        .select()
        .from(knowledgeUnit)
        .where(eq(knowledgeUnit.id, published.knowledgeUnitId));

      return NextResponse.json(
        {
          unit: units[0] ?? null,
          asset: published,
          source: published.source,
        },
        {
          status: 200,
          headers: {
            "X-Content-Source": "cached",
            ETag: published.cacheKey ?? published.id,
          },
        },
      );
    }

    console.log("[SERIES/CONTENT] CACHE MISS —", agentId, seasonNum, episodeNum);

    // ─── Step 2: Check draft ──────────────────────────────────────────

    const latestDraft = assets[assets.length - 1];

    if (latestDraft) {
      console.log("[SERIES/CONTENT] DRAFT HIT — returning existing draft");
      return NextResponse.json(
        {
          unit: null,
          asset: latestDraft,
          source: latestDraft.source,
        },
        {
          status: 200,
          headers: { "X-Content-Source": "draft" },
        },
      );
    }

    console.log("[SERIES/CONTENT] DRAFT MISS — triggering generation");

    // ─── Step 3: Generate via resolveProviderWithFallback() ───────────

    const resolved = await resolveProviderWithFallback();

    if (resolved.provider === "deepseek") {
      console.log("[SERIES/CONTENT] GENERATING VIA DEEPSEEK");
    } else {
      console.log("[SERIES/CONTENT] GENERATING VIA GROQ (fallback)");
    }

    const userPrompt = `Agente: ${agentId}. Temporada ${seasonNum}, Episódio ${episodeNum}. Gere o roteiro.`;

    const rawText = await chat(
      resolved,
      [
        { role: "system", content: SCREENPLAY_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { maxTokens: 2000, temperature: 0.9 },
    );

    const clean = rawText.replace(/```json|```/g, "").trim();
    const screenplay = JSON.parse(clean);

    // ─── Step 4: Save to cache ────────────────────────────────────────

    const unitId = uuid();
    const assetId = uuid();
    const slug = `${agentId}-s${String(seasonNum).padStart(2, "0")}e${String(episodeNum).padStart(2, "0")}`;
    const cacheKey = `${slug}-v1`;

    await db.insert(knowledgeUnit).values({
      id: unitId,
      title: `${agentId.toUpperCase()} — Episódio ${episodeNum}`,
      slug,
      learningObjective: `Compreender os conceitos apresentados no episódio ${episodeNum} de ${agentId}.`,
      cognitiveLevel: "understand",
      difficulty: "beginner",
      tags: [agentId],
      agentDomain: agentId,
      version: 1,
      status: "published",
    });

    await db.insert(knowledgeAsset).values({
      id: assetId,
      knowledgeUnitId: unitId,
      agentId,
      season: seasonNum,
      episode: episodeNum,
      type: "episode",
      content: screenplay,
      source: resolved.provider,
      generatedBy: `api/series/content (${resolved.provider})`,
      generatedAt: new Date(),
      version: 1,
      status: "published",
      cacheKey,
    });

    console.log(
      `[SERIES/CONTENT] SAVED TO CACHE — asset ${assetId}, unit ${unitId}, provider ${resolved.provider}`,
    );

    return NextResponse.json(
      {
        unit: {
          id: unitId,
          slug,
          title: `${agentId.toUpperCase()} — Episódio ${episodeNum}`,
          learningObjective: `Compreender os conceitos apresentados no episódio ${episodeNum} de ${agentId}.`,
          cognitiveLevel: "understand",
          difficulty: "beginner",
          tags: [agentId],
          agentDomain: agentId,
          version: 1,
          status: "published",
        },
        asset: {
          id: assetId,
          knowledgeUnitId: unitId,
          type: "episode",
          content: screenplay,
          source: resolved.provider,
          agentId,
          season: seasonNum,
          episode: episodeNum,
          version: 1,
          status: "published",
          cacheKey,
        },
        source: resolved.provider,
      },
      {
        status: 200,
        headers: { "X-Content-Source": "generated" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("Nenhum provedor")) {
      console.log("[SERIES/CONTENT] DEEPSEEK FAILED");
      console.log("[SERIES/CONTENT] FALLBACK TO GROQ — também falhou");
      console.log("[SERIES/CONTENT] GROQ FAILED");
      return NextResponse.json(
        { error: "Nenhum provedor LLM disponível no momento" },
        { status: 503 },
      );
    }

    console.error("[SERIES/CONTENT] error:", message);
    return NextResponse.json(
      { error: "Erro interno ao resolver conteúdo" },
      { status: 500 },
    );
  }
}
