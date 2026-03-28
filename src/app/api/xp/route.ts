import { NextRequest, NextResponse } from "next/server";
import { addXp, XP_REWARDS } from "@/lib/xp";
import { jwtVerify } from "jose";

async function getUserId(request: NextRequest): Promise<number | null> {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as number;
  } catch {
    return null;
  }
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
