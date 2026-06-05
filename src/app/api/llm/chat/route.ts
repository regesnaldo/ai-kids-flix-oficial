import { NextRequest, NextResponse } from "next/server";
import { resolveProviderWithFallback } from "@/lib/llm/provider";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.system || !body.prompt) {
      return NextResponse.json({ error: "system e prompt são obrigatórios" }, { status: 400 });
    }

    const preferredProvider = (body.provider as string) ?? "auto";

    // 1. Resolve provider com fallback automático (ping DeepSeek → Groq se falhar)
    const { provider, name } = await resolveProviderWithFallback(preferredProvider);
    console.log(`[LLM] Using provider: ${name}`);

    // 2. Monta mensagens e chama o provider
    const messages = [
      { role: "system" as const, content: body.system },
      { role: "user" as const, content: body.prompt },
    ];

    const result = await provider.chat(messages);

    return NextResponse.json({ content: result.content, provider: result.provider });
  } catch (err: any) {
    console.error("[LLM] Fatal error:", err);

    const message = err instanceof Error ? err.message : String(err);

    return NextResponse.json(
      {
        error: "LLM_UNAVAILABLE",
        message: "Nenhum provedor de IA disponível no momento. Tente novamente em alguns segundos.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 503 },
    );
  }
}
