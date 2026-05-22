import { NextRequest, NextResponse } from "next/server";
import { awardXp, getUserXpData, XP } from "@/lib/xp-engine";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const body = await request.json() as {
      reason: string;
      agentId?: string;
      season?: number;
      episode?: number;
      choicesMade?: boolean;
      firstOfDay?: boolean;
    };

    if (!body.reason) return NextResponse.json({ error: "reason é obrigatório" }, { status: 400 });

    // Calculate XP based on reason
    let amount = 0;
    if (body.reason === "episode_complete") amount += XP.EPISODE_COMPLETE;
    if (body.choicesMade) amount += XP.ALL_CHOICES_MADE;
    if (body.firstOfDay) amount += XP.FIRST_EPISODE_DAY;

    if (amount <= 0) return NextResponse.json({ error: "Nenhum XP a conceder" }, { status: 400 });

    const result = await awardXp({
      userId,
      amount,
      reason: body.reason,
      agentId: body.agentId,
      season: body.season,
      episode: body.episode,
    });

    return NextResponse.json({
      success: true,
      ...result,
      dailyCeiling: XP.DAILY_CEILING,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const data = await getUserXpData(userId);

    return NextResponse.json({ ...data, dailyCeiling: XP.DAILY_CEILING });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
