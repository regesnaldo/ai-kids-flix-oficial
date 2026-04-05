import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { agentNotes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function getUserId(request: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return null;
  const payload = await verifyToken(token);
  const id = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  const { content } = await request.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content obrigatório." }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Nota muito longa." }, { status: 400 });

  const existing = await db.select().from(agentNotes)
    .where(and(eq(agentNotes.id, id), eq(agentNotes.userId, userId))).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Nota não encontrada." }, { status: 404 });

  await db.update(agentNotes).set({ content: content.trim() }).where(eq(agentNotes.id, id));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  const existing = await db.select().from(agentNotes)
    .where(and(eq(agentNotes.id, id), eq(agentNotes.userId, userId))).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Nota não encontrada." }, { status: 404 });

  await db.delete(agentNotes).where(eq(agentNotes.id, id));
  return NextResponse.json({ success: true });
}
