import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

async function getUserId(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return (payload as { userId: number }).userId;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  const userProfiles = await db.select().from(profiles).where(eq(profiles.userId, userId));
  return NextResponse.json(userProfiles);
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  const { name, ageGroup, isKids, avatar } = await request.json();
  if (!name) return NextResponse.json({ error: "Nome obrigatorio" }, { status: 400 });
  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId));
  if (existing.length >= 5) return NextResponse.json({ error: "Maximo de 5 perfis" }, { status: 400 });
  const result = await db.insert(profiles).values({ userId, name, ageGroup: ageGroup || "adults-18", isKids: isKids || false, avatar: avatar || "blue" });
  return NextResponse.json({ success: true, id: result[0].insertId });
}
