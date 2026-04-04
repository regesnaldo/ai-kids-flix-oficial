import { NextRequest, NextResponse } from "next/server";
import { addXp, XP_REWARDS } from "@/lib/xp";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { reason } = await request.json();
  if (!reason || !(reason in XP_REWARDS)) {
    return NextResponse.json({ error: "Reason inválido." }, { status: 400 });
  }

  const xpAdded = XP_REWARDS[reason as keyof typeof XP_REWARDS];
  await addXp(userId, xpAdded, reason);

  return NextResponse.json({ success: true, xpAdded });
}
