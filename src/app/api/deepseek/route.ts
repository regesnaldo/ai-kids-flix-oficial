import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const TIMEOUT_MS = 45_000;

interface DeepSeekRequest {
  system: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as DeepSeekRequest;

    if (!body.system || !body.prompt) {
      return NextResponse.json(
        { error: "system e prompt são obrigatórios" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          temperature: body.temperature ?? 0.8,
          max_tokens: body.maxTokens ?? 2048,
          response_format: body.jsonMode ? { type: "json_object" } : undefined,
          messages: [
            { role: "system", content: body.system },
            { role: "user", content: body.prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `DeepSeek HTTP ${response.status}: ${errText.slice(0, 500)}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      const content: string | undefined =
        data?.choices?.[0]?.message?.content;

      if (typeof content !== "string" || !content.trim()) {
        return NextResponse.json(
          { error: "Resposta vazia do DeepSeek" },
          { status: 502 }
        );
      }

      return NextResponse.json({ content });
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "DeepSeek timeout" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: `Erro interno: ${String(err).slice(0, 500)}` },
      { status: 500 }
    );
  }
}
