/**
 * MENTE.AI — Health Check da API Anthropic
 * GET /api/health/anthropic
 *
 * Verifica conectividade com a API Anthropic e reporta o status de todas as
 * rotas que dependem dela: /api/chat, /api/interaction, /api/lab/transformer
 *
 * Uso recomendado:
 *  - Cron jobs de monitoramento (UptimeRobot, BetterStack, etc.)
 *  - Dashboard de admin da plataforma
 *  - Alertas automáticos em caso de degradação
 *
 * Respostas:
 *  200 → API acessível (todas as rotas operacionais)
 *  503 → API inacessível (com detalhes do tipo de falha)
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Timeout para health check — resposta rápida tem prioridade */
const HEALTH_TIMEOUT_MS = 8_000;

// ─── Rotas dependentes da Anthropic ──────────────────────────────────────────

const ROTAS_ANTHROPIC = [
  { rota: "/api/chat", descricao: "Chat com agentes (Laboratório)" },
  { rota: "/api/interaction", descricao: "Perguntas interativas dos episódios" },
  { rota: "/api/lab/transformer", descricao: "Simulador de transformer (tokens)" },
];

// ─── Teste de conectividade ───────────────────────────────────────────────────

async function testarConectividadeAnthropic(): Promise<{
  ok: boolean;
  latenciaMs: number;
  statusHttp?: number;
  erroTipo?: string;
  erroDetalhe?: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      latenciaMs: 0,
      erroTipo: "sem_chave",
      erroDetalhe: "ANTHROPIC_API_KEY não configurada no ambiente.",
    };
  }

  const inicio = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    // GET /v1/models: leve, sem consumir tokens, valida chave + conectividade
    const resposta = await fetch("https://api.anthropic.com/v1/models", {
      method: "GET",
      signal: controller.signal,
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    });

    clearTimeout(timer);
    const latenciaMs = Date.now() - inicio;

    if (resposta.ok) {
      return { ok: true, latenciaMs, statusHttp: resposta.status };
    }

    const corpo = await resposta.text().catch(() => "");
    let erroTipo = "servidor";
    if (resposta.status === 401) erroTipo = "autorizacao";
    else if (resposta.status === 429) erroTipo = "rate_limit";

    return { ok: false, latenciaMs, statusHttp: resposta.status, erroTipo, erroDetalhe: corpo.slice(0, 300) };

  } catch (err) {
    clearTimeout(timer);
    const latenciaMs = Date.now() - inicio;
    const msg = String(err).toLowerCase();

    let erroTipo = "desconhecido";
    if (msg.includes("abort") || msg.includes("timeout")) erroTipo = "timeout";
    else if (msg.includes("dns") || msg.includes("lookup") || msg.includes("enotfound") || msg.includes("i/o timeout")) erroTipo = "dns";

    return {
      ok: false,
      latenciaMs,
      erroTipo,
      erroDetalhe: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET() {
  const resultado = await testarConectividadeAnthropic();

  const statusGeral = resultado.ok ? "operacional" : "indisponivel";

  const payload = {
    servico: "anthropic",
    status: statusGeral,
    timestamp: new Date().toISOString(),
    regiao: process.env.VERCEL_REGION ?? process.env.VERCEL_ENV ?? "local",
    conectividade: {
      ok: resultado.ok,
      latenciaMs: resultado.latenciaMs,
      ...(resultado.statusHttp && { statusHttp: resultado.statusHttp }),
      ...(resultado.erroTipo && { erroTipo: resultado.erroTipo }),
      ...(resultado.erroDetalhe && { erroDetalhe: resultado.erroDetalhe }),
    },
    rotasAfetadas: ROTAS_ANTHROPIC.map((r) => ({
      ...r,
      status: resultado.ok ? "operacional" : "indisponivel",
    })),
    variaveis: {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "configurada" : "ausente",
      ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL ?? "usando padrão (claude-haiku-4-5-20251001)",
      LLM_PROVIDER: process.env.LLM_PROVIDER ?? "não definido (auto-detecção ativa)",
      OPENAI_FALLBACK: process.env.OPENAI_API_KEY ? "disponível" : "não configurado",
    },
  };

  if (!resultado.ok) {
    console.error("[health/anthropic] API inacessível:", JSON.stringify({
      erroTipo: resultado.erroTipo,
      latenciaMs: resultado.latenciaMs,
      detalhe: resultado.erroDetalhe,
    }));
  }

  return NextResponse.json(payload, { status: resultado.ok ? 200 : 503 });
}
