import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { anthropicCompletionText } from "@/lib/anthropic";
import { emitXpEvent } from "@/lib/xp-webhook";

export const runtime = "nodejs";

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface QuizItem {
  question: string;
  options: string[];
}

interface QuizPayload {
  series: string;
  episode: string;
  content: QuizItem[];
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPromptInteracao(args: {
  seriesTitle: string;
  episodeTitle: string;
  ageGroup: string;
  seed?: string;
}): string {
  const persona =
    args.ageGroup === "child"
      ? "Você é um amigo animado explicando IA para crianças. Use analogias do dia a dia, linguagem simples e divertida."
      : args.ageGroup === "teen"
      ? "Você é um mentor jovem explicando IA. Use linguagem natural e exemplos do mundo real. Termos técnicos com explicação entre parênteses."
      : "Você é um guia descontraído para adultos curiosos. Use linguagem simples, misture cotidiano com IA. Termos técnicos com explicação entre parênteses.";

  const seedPart = args.seed ? ` Seed: ${args.seed}.` : "";

  return [
    persona + seedPart,
    `Série: ${args.seriesTitle}. Episódio: ${args.episodeTitle}.`,
    "Gere 4 perguntas diferentes sobre o tema.",
    'Responda APENAS em JSON válido sem markdown neste formato exato: {"series":"titulo","episode":"episodio","content":[{"question":"pergunta","options":["a","b","c"]}]}',
  ].join(" ");
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { seriesTitle, episodeTitle, ageGroup, seed } = await request.json();

    if (!seriesTitle || !episodeTitle) {
      return NextResponse.json(
        { error: "seriesTitle e episodeTitle são obrigatórios." },
        { status: 400 }
      );
    }

    const userMessage = buildPromptInteracao({ seriesTitle, episodeTitle, ageGroup, seed });

    // ✅ Usa utilitário central: lazy client + retry + timeout + logs semânticos
    const textoResposta = await anthropicCompletionText({
      modelo: "claude-haiku-4-5-20251001",
      maxTokens: 1_500,
      mensagens: [{ role: "user", content: userMessage }],
    });

    // Limpeza defensiva do markdown que a IA ocasionalmente insere
    const textoLimpo = textoResposta.replace(/```json|```/g, "").trim();

    let quiz: QuizPayload;
    try {
      quiz = JSON.parse(textoLimpo) as QuizPayload;
    } catch {
      console.error("[interaction] JSON inválido retornado pela IA:", textoLimpo.slice(0, 200));
      return NextResponse.json(
        { error: "Resposta da IA fora do formato esperado. Tente novamente." },
        { status: 502 }
      );
    }

    // ── Fase 2: emitir evento XP por interação concluída ────────────────────
    // fire-and-forget: não bloqueia a resposta se o XP falhar
    const userId = await getUserId(request).catch(() => null);
    if (userId) {
      emitXpEvent({
        userId,
        tipo: "EXPERIMENTO_CONCLUIDO",
        metadata: { duracaoSegundos: 0 },
      }).catch((e) => console.error("[interaction] Falha ao emitir XP:", e));
    }

    return NextResponse.json(quiz);

  } catch (error: unknown) {
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
      console.error(`[interaction] Falha de conectividade Anthropic (${err.tipo}) após ${err.tentativas} tentativa(s):`, err.mensagem);
      return NextResponse.json(
        { error: "Serviço de IA temporariamente indisponível. Tente novamente." },
        { status: 503 }
      );
    }

    console.error("[interaction] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Falha ao gerar pergunta interativa", details: String(error) },
      { status: 500 }
    );
  }
}
