import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { createHash } from "crypto";

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
      return NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ userId: user[0].id, email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      message: "Login realizado!",
      user: { id: user[0].id, name: user[0].name, email: user[0].email, plan: user[0].subscriptionPlan },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: "Erro ao fazer login.", details: String(error) }, { status: 500 });
  }
}