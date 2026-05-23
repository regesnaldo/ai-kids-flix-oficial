import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBoard, saveBoard, kvGet, kvSet, type KnowledgeBoard } from "../board-store";
import { findInPrebuilt, findSimilar, normalizeQuestion } from "@/lib/smart-cache";

// ── POST /api/lab/start ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { topic: string; mode?: "fast" | "full" };
    if (!body.topic) return NextResponse.json({ error: "topic é obrigatório" }, { status: 400 });

    const topic = body.topic.trim();
    const normalized = normalizeQuestion(topic);

    // STEP 1: Check prebuilt cache (exact match)
    let cached = findInPrebuilt(topic);
    if (cached) {
      console.log("[lab/start] Cache HIT (prebuilt exact)", { topic: topic.slice(0, 40) });
      return NextResponse.json({ ...cached, source: "cache", instant: true });
    }

    // STEP 2: Check prebuilt cache (fuzzy match)
    const similar = findSimilar(topic);
    if (similar) {
      console.log("[lab/start] Cache HIT (prebuilt fuzzy)", {
        asked: topic.slice(0, 40),
        matched: similar.key,
        score: similar.score.toFixed(2),
      });
      return NextResponse.json({ ...similar.value, source: "cache", instant: true, similarTo: similar.key });
    }

    // STEP 3: Check learned answers (Vercel KV simulado)
    const learned = kvGet(`lab_${normalized}`);
    if (learned) {
      console.log("[lab/start] Cache HIT (learned/KV)", { topic: topic.slice(0, 40) });
      return NextResponse.json({ ...learned, source: "cache", instant: true });
    }

    // STEP 4: No cache → create new experiment session
    console.log("[lab/start] Cache MISS — criando novo experimento", { topic: topic.slice(0, 40) });

    const experimentId = randomUUID();
    const board: KnowledgeBoard = {
      experimentId,
      topic,
      facts: [],
      currentAgent: "",
      completedAgents: [],
      agentOutputs: {},
      history: [],
    };

    saveBoard(board);

    return NextResponse.json({
      experimentId,
      topic,
      mode: body.mode || "full",
      source: "api",
    });
  } catch (err) {
    console.error("[lab/start]", err);
    return NextResponse.json({ error: "Falha ao criar experimento" }, { status: 500 });
  }
}
