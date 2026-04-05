import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { agentNotes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const agentId = request.nextUrl.searchParams.get("agentId");
  if (!agentId) return NextResponse.json({ error: "agentId obrigatório." }, { status: 400 });

  const notes = await db.select().from(agentNotes)
    .where(and(eq(agentNotes.userId, userId), eq(agentNotes.agentId, agentId)))
    .orderBy(agentNotes.createdAt);

  return NextResponse.json({ notes });
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { agentId, content } = await request.json();
  if (!agentId || !content?.trim()) return NextResponse.json({ error: "agentId e content obrigatórios." }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Nota muito longa. Máximo 2000 caracteres." }, { status: 400 });

  const id = randomUUID();
  await db.insert(agentNotes).values({ id, userId, agentId, content: content.trim() });

  const note = await db.select().from(agentNotes).where(eq(agentNotes.id, id)).limit(1);
  return NextResponse.json({ note: note[0] }, { status: 201 });
}
