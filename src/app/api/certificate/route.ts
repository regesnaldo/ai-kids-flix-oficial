import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
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
