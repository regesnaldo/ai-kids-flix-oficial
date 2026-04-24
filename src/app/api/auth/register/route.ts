import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { clearAuthCookie, getJwtSecretKey, setAuthCookie, signToken } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

const NETWORK_CODES = new Set(["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ENETUNREACH"]);

function isDbNetworkError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Record<string, unknown>;
  if (typeof e.code === "string" && NETWORK_CODES.has(e.code)) return true;
  if (e.cause && typeof (e.cause as Record<string, unknown>).code === "string") {
    return NETWORK_CODES.has((e.cause as Record<string, unknown>).code as string);
  }
  const msg = typeof e.message === "string" ? e.message : "";
  return NETWORK_CODES.has(msg.split(" ")[1] ?? "");
}

export async function POST(request: NextRequest) {
  // Validate required env vars upfront
  try {
    getJwtSecretKey();
  } catch {
    console.error("[REGISTER] JWT_SECRET não configurado.");
    return NextResponse.json(
      { error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  if (!process.env.DATABASE_URL) {
    console.error("[REGISTER] DATABASE_URL não configurado.");
    return NextResponse.json(
      { error: "Serviço temporariamente indisponível." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { nome?: unknown; email?: unknown; senha?: unknown };
    const nome = typeof body.nome === "string" ? body.nome.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const senha = typeof body.senha === "string" ? body.senha : "";

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    if (senha.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    }

    let existing: User[];
    try {
      existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    } catch (dbError) {
      console.error("[REGISTER] Erro na consulta ao banco:", dbError);
      const isNetworkError = isDbNetworkError(dbError);
      return NextResponse.json(
        { error: isNetworkError ? "Banco de dados indisponível. Tente novamente em instantes." : "Erro interno ao processar cadastro." },
        { status: isNetworkError ? 503 : 500 }
      );
    }

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(senha);

    await db.insert(users).values({
      name: nome,
      email,
      password: hashedPassword,
      subscriptionPlan: "FREE",
      subscriptionStatus: "active",
    });

    const newUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    const token = await signToken({
      userId: String(newUser[0].id),
      email,
      plan: "free",
    });

    const response = NextResponse.json({ success: true, message: "Cadastro realizado!" });
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("[REGISTER] Erro inesperado:", error);
    const response = NextResponse.json({ error: "Erro ao cadastrar." }, { status: 500 });
    return clearAuthCookie(response);
  }
}
