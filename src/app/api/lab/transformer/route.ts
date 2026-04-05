import { NextRequest, NextResponse } from "next/server";
import { anthropicCompletionText } from "@/lib/anthropic";

// ─── Pool de palavras PT-BR para alternativas do simulador ───────────────────
const PT_WORDS = [
  "que", "com", "para", "uma", "dos", "nas", "por", "mais", "como", "mas",
  "foi", "ele", "ela", "seu", "sua", "isso", "esta", "pode", "tem", "ser",
  "fazer", "muito", "bem", "grande", "novo", "mundo", "vida", "tempo", "pessoa",
];

function gerarAlternativas(escolhido: string, restante: number) {
  const pool = PT_WORDS.filter((w) => w !== escolhido);
  const embaralhado = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const probs = [restante * 0.5, restante * 0.3, restante * 0.2];
  return embaralhado.map((token, i) => ({
    token,
    probability: Math.round(probs[i] * 100) / 100,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, maxTokens = 20 } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt obrigatório." }, { status: 400 });
    }

    const clampedTokens = Math.min(Math.max(Number(maxTokens), 1), 50);

    // Usa o utilitário central (cliente lazy + retry + timeout correto)
    const textoCompleto = await anthropicCompletionText({
      modelo: "claude-haiku-4-5-20251001",
      maxTokens: clampedTokens,
      mensagens: [
        {
          role: "user",
          content: `Continue esta frase em português de forma natural: "${prompt}"`,
        },
      ],
    });

    const tokens = textoCompleto.split(" ").filter((t) => t.length > 0);

    const tokenSteps = tokens.map((token, index) => {
      const probability = Math.round((0.45 + Math.random() * 0.5) * 100) / 100;
      const restante = Math.round((1 - probability) * 100) / 100;
      return {
        token,
        probability,
        alternatives: gerarAlternativas(token, restante),
        tokenIndex: index,
      };
    });

    return NextResponse.json({ tokens: tokenSteps, fullText: textoCompleto });

  } catch (error: unknown) {
    // Classificação de erro para logging e resposta semântica
    const err = error as { tipo?: string; mensagem?: string; tentativas?: number };

    if (err?.tipo === "sem_chave") {
      return NextResponse.json({ error: "API Anthropic não configurada." }, { status: 503 });
    }
    if (err?.tipo === "autorizacao") {
      return NextResponse.json({ error: "Chave Anthropic inválida ou sem permissão." }, { status: 401 });
    }
    if (err?.tipo === "rate_limit") {
      return NextResponse.json({ error: "Limite de requisições atingido. Tente em breve." }, { status: 429 });
    }
    if (err?.tipo === "dns" || err?.tipo === "timeout") {
      console.error(`[transformer] Falha de conectividade Anthropic (${err.tipo}) após ${err.tentativas} tentativa(s):`, err.mensagem);
      return NextResponse.json(
        { error: "Serviço de IA temporariamente indisponível. Tente novamente." },
        { status: 503 }
      );
    }

    console.error("[transformer] Erro inesperado:", error);
    return NextResponse.json({ error: "Erro ao gerar tokens." }, { status: 500 });
  }
}
