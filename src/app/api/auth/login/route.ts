import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { clearAuthCookie, setAuthCookie, signToken } from "@/lib/auth";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    const hashedPassword = hashPassword(senha);

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0 || user[0].password !== hashedPassword) {
      const response = NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
      return clearAuthCookie(response);
    }

    const token = await signToken({
      userId: String(user[0].id),
      email: String(email),
      plan: "free",
    });

    const response = NextResponse.json({
      success: true,
      message: "Login realizado!",
      user: { id: user[0].id, name: user[0].name, email: user[0].email, plan: user[0].subscriptionPlan },
    });

    for (const path of ["/", "/api", "/api/auth", "/api/auth/login"]) {
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path,
      });
    }

    return setAuthCookie(response, token);

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    const response = NextResponse.json({ error: "Erro ao fazer login.", details: String(error) }, { status: 500 });
    return clearAuthCookie(response);
  }
}
