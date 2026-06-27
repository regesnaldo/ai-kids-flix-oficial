import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Auth
    const token = getAuthCookieFromRequest(req);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    // MVP: sem query ao banco — retorna progresso zerado.
    // A integração real com explorerProgress será ativada após o seed.
    return NextResponse.json({
      eligible: false,
      completed: 0,
      total: 100,
      progress: "0/100",
    });
  } catch (error) {
    console.error("[certificate]", error);
    return NextResponse.json({ eligible: false, completed: 0, total: 100, progress: "0/100" });
  }
}
