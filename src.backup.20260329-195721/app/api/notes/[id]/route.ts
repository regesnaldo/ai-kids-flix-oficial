import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { agentNotes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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
