import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

type ConversionEventName = "page_view" | "sign_up" | "paywall_hit" | "purchase";

const ALLOWED_EVENTS: ConversionEventName[] = ["page_view", "sign_up", "paywall_hit", "purchase"];

function isAllowedEventName(value: unknown): value is ConversionEventName {
  return typeof value === "string" && ALLOWED_EVENTS.includes(value as ConversionEventName);
}

async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const userId = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      event?: unknown;
      path?: unknown;
      source?: unknown;
      metadata?: unknown;
    };
    if (!isAllowedEventName(body.event)) {
      return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
    }

    const userId = await getUserIdFromRequest(request);
    console.info("[conversion]", {
      event: body.event,
      userId,
      path: typeof body.path === "string" ? body.path : null,
      source: typeof body.source === "string" ? body.source : "frontend",
      metadata: typeof body.metadata === "object" ? body.metadata : null,
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[conversion] erro ao registrar evento:", error);
    return NextResponse.json({ error: "Falha ao registrar evento" }, { status: 500 });
  }
}
