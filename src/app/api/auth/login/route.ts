import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { clearAuthCookie, getJwtSecretKey, setAuthCookie, signToken } from "@/lib/auth";
import { verifyPassword, hashPassword, needsMigration } from "@/lib/password";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

const NETWORK_CODES = new Set(["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ENETUNREACH"]);

function isDbNetworkError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Record<string, unknown>;
  if (typeof e.code === "string" && NETWORK_CODES.has(e.code)) return true;
  // Check if nested cause has the code (Drizzle wraps mysql2 errors)
  if (e.cause && typeof (e.cause as Record<string, unknown>).code === "string") {
    return NETWORK_CODES.has((e.cause as Record<string, unknown>).code as string);
  }
  // Fallback: check message string
  const msg = typeof e.message === "string" ? e.message : "";
  return NETWORK_CODES.has(msg.split(" ")[1] ?? "");
}

function mapSubscriptionPlanToJwtPlan(value: unknown): "free" | "premio" | "familiar" {
  if (value === "PREMIUM") return "premio";
  if (value === "FAMILY") return "familiar";
  return "free";
}

export async function POST(request: NextRequest) {
  // Validate required env vars upfront — prevents cryptic 500s
  try {
    getJwtSecretKey();
  } catch {
    console.error("[LOGIN] JWT_SECRET não configurado. Adicione JWT_SECRET ao .env.local.");
    return NextResponse.json(
      { error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  if (!process.env.DATABASE_URL) {
    console.error("[LOGIN] DATABASE_URL não configurado.");
    return NextResponse.json(
      { error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as { email?: unknown; senha?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const senha = typeof body.senha === "string" ? body.senha : "";

    if (!email || !senha) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    let rows: User[];
    try {
      rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    } catch (dbError) {
      console.error("[LOGIN] Erro na consulta ao banco:", dbError);
      const isNetworkError = isDbNetworkError(dbError);
      return NextResponse.json(
        { error: isNetworkError ? "Banco de dados indisponível. Tente novamente em instantes." : "Erro interno ao processar login." },
        { status: isNetworkError ? 503 : 500 }
      );
    }

    if (rows.length === 0 || !rows[0].password) {
      const response = NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
      return clearAuthCookie(response);
    }

    const user = rows[0];

    const isValid = await verifyPassword(senha, user.password ?? "");

    if (!isValid) {
      const response = NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
      return clearAuthCookie(response);
    }

    // Migrate legacy SHA-256 passwords to bcrypt on successful login
    if (needsMigration(user.password ?? "")) {
      try {
        const newHash = await hashPassword(senha);
        await db.update(users).set({ password: newHash }).where(eq(users.id, user.id));
      } catch (migErr) {
        // Non-fatal: log and continue — user is authenticated
        console.warn("[LOGIN] Falha ao migrar hash SHA-256 para bcrypt:", migErr);
      }
    }

    const token = await signToken({
      userId: String(user.id),
      email,
      plan: mapSubscriptionPlanToJwtPlan(user.subscriptionPlan),
    });

    const response = NextResponse.json({
      success: true,
      message: "Login realizado!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.subscriptionPlan,
      },
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error("[LOGIN] Erro inesperado:", error);
    const response = NextResponse.json({ error: "Erro ao fazer login." }, { status: 500 });
    return clearAuthCookie(response);
  }
}
