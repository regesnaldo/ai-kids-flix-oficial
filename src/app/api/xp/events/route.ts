/**
 * MENTE.AI — SSE: Atualizações de XP em Tempo Real
 * GET /api/xp/events
 *
 * Abre um stream Server-Sent Events por usuário autenticado.
 * Envia o estado atual de XP imediatamente na conexão e mantém
 * o canal aberto com heartbeats a cada 20s.
 *
 * DESIGN para Vercel serverless:
 *   - Envia estado atual na abertura (pull inicial)
 *   - Heartbeat garante que proxies não fechem a conexão
 *   - Timeout máximo: limitado pelo plano Vercel (30s Hobby / 300s Pro)
 *   - Cliente deve reconectar via EventSource automático (built-in do browser)
 *
 * Payload de evento "xp_update":
 *   { xpTotal, xpSemana, streakDias, badgesDesbloqueadas, timestamp }
 */

import { NextRequest } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { userXp } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ─── Serialização SSE ─────────────────────────────────────────────────────────

function sseEvent(evento: string, dados: unknown): string {
  return `event: ${evento}\ndata: ${JSON.stringify(dados)}\n\n`;
}

function sseHeartbeat(): string {
  return `: heartbeat ${Date.now()}\n\n`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) {
    return new Response("Não autorizado", { status: 401 });
  }

  // Busca estado inicial de XP do usuário
  const [xpAtual] = await db
    .select()
    .from(userXp)
    .where(eq(userXp.userId, userId))
    .limit(1);

  const estadoInicial = {
    xpTotal:    xpAtual?.xpTotal    ?? 0,
    xpSemana:   xpAtual?.xpThisWeek ?? 0,
    streakDias: xpAtual?.streakDays ?? 0,
    badgesDesbloqueadas: [] as string[],
    timestamp: new Date().toISOString(),
  };

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const enviar = (texto: string) => {
        try {
          controller.enqueue(encoder.encode(texto));
        } catch {
          // Controller já fechado — ignora silenciosamente
        }
      };

      // Envio imediato do estado atual ao conectar
      enviar(sseEvent("xp_update", estadoInicial));

      // Heartbeat periódico para manter conexão viva
      const intervalo = setInterval(() => enviar(sseHeartbeat()), 20_000);

      // Limpeza quando o cliente desconectar
      request.signal.addEventListener("abort", () => {
        clearInterval(intervalo);
        try { controller.close(); } catch { /* já fechado */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      // Permite que o browser feche e reconecte automaticamente
      "X-Accel-Buffering": "no",
    },
  });
}
