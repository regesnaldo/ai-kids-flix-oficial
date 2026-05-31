/**
 * ─── POST /api/llm/chat ────────────────────────────────────────────────
 *
 * Unified LLM chat endpoint. Replaces the misnamed /api/deepseek route.
 *
 * Accepts { provider?, model?, temperature?, system, prompt }.
 * Uses the provider abstraction (createLLM) — never calls raw fetch.
 */

import { NextRequest, NextResponse } from "next/server";
import { createLLM, type LLMProviderMode } from "@/lib/llm/provider";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.system || !body.prompt) {
      return NextResponse.json(
        { error: "system e prompt são obrigatórios" },
        { status: 400 }
      );
    }

    const provider = (body.provider as LLMProviderMode) ?? "auto";

    const llm = createLLM({
      provider,
      model: body.model,
      temperature: body.temperature ?? 0.8,
      maxTokens: body.maxTokens ?? 2048,
    });

    const response = await llm.invoke([
      new SystemMessage(body.system),
      new HumanMessage(body.prompt),
    ]);

    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return NextResponse.json({ content });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Specific provider errors
    if (message.includes("DEEPSEEK_API_KEY") || message.includes("GROQ_API_KEY")) {
      return NextResponse.json(
        { error: message },
        { status: 503 }
      );
    }

    console.error("[llm/chat] error:", message);
    return NextResponse.json(
      { error: `Erro interno: ${message.slice(0, 500)}` },
      { status: 500 }
    );
  }
}
