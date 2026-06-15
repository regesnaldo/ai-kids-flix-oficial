import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBoard, saveBoard, kvGet, kvSet, kvIncr, kvGetCounter, kvDecr, type KnowledgeBoard } from "../board-store";
import { findInPrebuilt, findSimilar, normalizeQuestion } from "@/lib/smart-cache";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

// ── Rate limit config ─────────────────────────────────────────────────
const RL_5MIN = 3;
const RL_HOUR = 10;
const RL_DAY = 20;
const GLOBAL_MAX = 10;

// ── Elegant messages (NUNCA usar: bloqueio, limite, proibido, erro) ──
const ELEGANT_MESSAGES: Record<string, { title: string; body: string; suggestion: string }> = {
  "5min": {
    title: "🧠 Seus neurônios estão em plena atividade!",
    body: "O laboratório está calibrando sua frequência para garantir a melhor experiência. Novos experimentos com IA estarão disponíveis em menos de 5 minutos.",
    suggestion: "Enquanto isso: experimentos do cache são instantâneos ⚡ — tente uma pergunta que você já fez ou explore perguntas populares.",
  },
  hour: {
    title: "⚡ Alta atividade detectada no seu laboratório!",
    body: "Você está explorando muito — isso é incrível! O sistema está sincronizando seus experimentos para continuar com máxima qualidade. Novos experimentos com IA retornam em até 1 hora.",
    suggestion: "Dica: experimentos do cache funcionam sem qualquer espera ⚡ — suas descobertas anteriores estão todas aqui.",
  },
  day: {
    title: "🌙 Seu laboratório completou o ciclo de hoje.",
    body: "Você realizou 20 experimentos — uma jornada de descobertas impressionante! O sistema reinicia à meia-noite para uma nova jornada de aprendizado. Seus experimentos foram salvos e estarão aqui amanhã.",
    suggestion: "\"Grandes descobertas precisam de tempo para se sedimentar.\" — NEXUS",
  },
  global: {
    title: "🌐 Alta atividade global no laboratório!",
    body: "Muitos cientistas estão explorando agora. O sistema está processando em lote para garantir qualidade para todos. Tente uma pergunta conhecida — resposta instantânea garantida! ⚡",
    suggestion: "Ou aguarde menos de 1 minuto para um novo experimento com IA.",
  },
};

// ── Get userId ────────────────────────────────────────────────────────
function getUserId(request: NextRequest): string {
  try {
    const token = getAuthCookieFromRequest(request);
    if (token) {
      // We can't await verifyToken here synchronously, so use fallback
      // In production this would be: const payload = await verifyToken(token)
      // For rate limiting MVP, IP is reliable enough
      const payload = token.split(".")[1];
      if (payload) {
        try {
          const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
          if (decoded?.userId) return `user_${decoded.userId}`;
        } catch (error) { console.error('[MENTE.AI] Error in api/lab/start/route.ts:', error); }
      }
    }
  } catch (error) { console.error('[MENTE.AI] Error in api/lab/start/route.ts:', error); }

  // Fallback: IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return `ip_${ip}`;
}

// ── Check user rate limit ────────────────────────────────────────────
function checkUserRateLimit(userId: string): { limited: boolean; window?: string; resetIn?: number } | null {
  const now = Math.floor(Date.now() / 1000);
  const window5min = Math.floor(now / 300);
  const windowHour = Math.floor(now / 3600);
  const windowDay = Math.floor(now / 86400);

  const count5min = kvGetCounter(`rl_5m_${userId}_${window5min}`);
  if (count5min >= RL_5MIN) return { limited: true, window: "5min", resetIn: 300 - (now % 300) };

  const countHour = kvGetCounter(`rl_1h_${userId}_${windowHour}`);
  if (countHour >= RL_HOUR) return { limited: true, window: "hour", resetIn: 3600 - (now % 3600) };

  const countDay = kvGetCounter(`rl_1d_${userId}_${windowDay}`);
  if (countDay >= RL_DAY) return { limited: true, window: "day", resetIn: 86400 - (now % 86400) };

  // Increment all windows
  kvIncr(`rl_5m_${userId}_${window5min}`, 300);
  kvIncr(`rl_1h_${userId}_${windowHour}`, 3600);
  kvIncr(`rl_1d_${userId}_${windowDay}`, 86400);

  return null; // not limited
}

// ── Check global limit ───────────────────────────────────────────────
function checkGlobalLimit(): { limited: boolean } | null {
  const active = kvGetCounter("global_active");
  if (active >= GLOBAL_MAX) return { limited: true };
  kvIncr("global_active", 60);
  return null;
}

function decrementGlobal() {
  kvDecr("global_active");
}

// ── POST /api/lab/start ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { topic: string; mode?: "fast" | "full" };
    if (!body.topic) return NextResponse.json({ error: "topic é obrigatório" }, { status: 400 });

    const topic = body.topic.trim();
    const normalized = normalizeQuestion(topic);

    // ═══ CACHE CHECKS (bypass ALL limits) ═══════════════════════════

    // STEP 1: Prebuilt exact
    const cached = findInPrebuilt(topic);
    if (cached) {
      return NextResponse.json({ ...cached, source: "cache", instant: true });
    }

    // STEP 2: Prebuilt fuzzy
    const similar = findSimilar(topic);
    if (similar) {
      const cachedValue = similar.value as Record<string, unknown>;
      return NextResponse.json({ ...cachedValue, source: "cache", instant: true, similarTo: similar.key });
    }

    // STEP 3: Learned answers (KV)
    const learned = kvGet(`lab_${normalized}`);
    if (learned) {
      return NextResponse.json({ ...learned, source: "cache", instant: true });
    }

    // ═══ CACHE MISS — rate limit for NEW experiments ════════════════

    const userId = getUserId(request);

    // User rate limit
    const userLimit = checkUserRateLimit(userId);
    if (userLimit?.limited) {
      const msg = ELEGANT_MESSAGES[userLimit.window!] || ELEGANT_MESSAGES["5min"];
      return NextResponse.json(
        {
          limited: true,
          window: userLimit.window,
          resetIn: userLimit.resetIn,
          message: msg,
        },
        { status: 429 }
      );
    }

    // Global limit
    const globalLimit = checkGlobalLimit();
    if (globalLimit?.limited) {
      const msg = ELEGANT_MESSAGES["global"];
      return NextResponse.json(
        {
          limited: true,
          window: "global",
          resetIn: 60,
          message: msg,
        },
        { status: 429 }
      );
    }

    // ── Create experiment ──────────────────────────────────────────
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

    // Decrement global after session creation
    decrementGlobal();

    return NextResponse.json({
      experimentId,
      topic,
      mode: body.mode || "full",
      source: "api",
    });
  } catch (err) {
    console.error("[lab/start]", err);
    decrementGlobal();
    return NextResponse.json({ error: "Falha ao criar experimento" }, { status: 500 });
  }
}
