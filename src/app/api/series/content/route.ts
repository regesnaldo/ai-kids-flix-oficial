// ─── src/app/api/series/content/route.ts ────────────────────────────────────
//
// Knowledge Asset Layer — Content Resolution API
//
// GET /api/series/content?agent=nexus&season=1&ep=3
//
// Flow:
//   1. Check knowledge_asset table (TiDB) for published content
//   2. If found → return cached content with X-Content-Source: cached
//   3. If not found → generate via DeepSeek V4, save as draft, return
//      with X-Content-Source: generated

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgeAsset, knowledgeUnit } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

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

    // 1. Query knowledge_asset for published episode content
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
      // Query the associated knowledge unit for pedagogical metadata
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

    // 2. No published content found — generate via DeepSeek as fallback
    const latestDraft = assets[assets.length - 1];

    if (latestDraft) {
      // Return existing draft while generation happens
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

    // 3. Nothing at all — trigger generation
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Configuração de IA ausente" },
        { status: 503 },
      );
    }

    const deepseekResponse = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-pro",
          messages: [
            {
              role: "system",
              content: `Você é um roteirista de séries educativas do MENTE.AI.
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
}`,
            },
            {
              role: "user",
              content: `Agente: ${agentId}. Temporada ${seasonNum}, Episódio ${episodeNum}. Gere o roteiro.`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.9,
        }),
      },
    );

    if (!deepseekResponse.ok) {
      return NextResponse.json(
        { error: "Falha ao gerar conteúdo com IA" },
        { status: 502 },
      );
    }

    const raw = await deepseekResponse.json();
    const text = raw.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const screenplay = JSON.parse(clean);

    return NextResponse.json(
      {
        unit: null,
        asset: {
          type: "episode",
          content: screenplay,
          source: "deepseek",
          agentId,
          season: seasonNum,
          episode: episodeNum,
        },
        source: "deepseek",
      },
      {
        status: 200,
        headers: { "X-Content-Source": "generated" },
      },
    );
  } catch (error) {
    console.error("[SERIES/CONTENT]", error);
    return NextResponse.json(
      { error: "Erro interno ao resolver conteúdo" },
      { status: 500 },
    );
  }
}
