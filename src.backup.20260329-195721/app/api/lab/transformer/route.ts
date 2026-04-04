import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PT_WORDS = ["que", "com", "para", "uma", "dos", "nas", "por", "mais", "como", "mas",
  "foi", "ele", "ela", "seu", "sua", "isso", "esta", "pode", "tem", "ser",
  "fazer", "muito", "bem", "grande", "novo", "mundo", "vida", "tempo", "pessoa"];

function generateAlternatives(chosen: string, remaining: number) {
  const pool = PT_WORDS.filter(w => w !== chosen);
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const probs = [remaining * 0.5, remaining * 0.3, remaining * 0.2];
  return shuffled.map((token, i) => ({ token, probability: Math.round(probs[i] * 100) / 100 }));
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, maxTokens = 20 } = await request.json();

    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt obrigatório." }, { status: 400 });
    const clampedTokens = Math.min(Math.max(Number(maxTokens), 1), 50);

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: clampedTokens,
      messages: [{ role: "user", content: `Continue esta frase em português de forma natural: "${prompt}"` }],
    });

    const fullText = message.content[0].type === "text" ? message.content[0].text : "";
    const tokens = fullText.split(" ").filter(t => t.length > 0);

    const tokenSteps = tokens.map((token, index) => {
      const probability = Math.round((0.45 + Math.random() * 0.5) * 100) / 100;
      const remaining = Math.round((1 - probability) * 100) / 100;
      return {
        token,
        probability,
        alternatives: generateAlternatives(token, remaining),
        tokenIndex: index,
      };
    });

    return NextResponse.json({ tokens: tokenSteps, fullText });
  } catch (error) {
    console.error("TRANSFORMER ERROR:", error);
    return NextResponse.json({ error: "Erro ao gerar tokens." }, { status: 500 });
  }
}
