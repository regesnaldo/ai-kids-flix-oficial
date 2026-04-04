import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { setAuthCookie, signToken } from "@/lib/auth";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha } = await request.json();

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });
    }

    const hashedPassword = hashPassword(senha);

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
      email: String(email),
      plan: "free",
    });

    const response = NextResponse.json({ success: true, message: "Cadastro realizado!" });
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: "Erro ao cadastrar.", details: String(error) }, { status: 500 });
  }
}
