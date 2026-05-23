import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogReads } from "@/lib/db/schema-extensions";
import { awardXp } from "@/lib/xp-engine";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const body = await request.json() as { postId: string; completed?: boolean; choiceMade?: string };

    if (!body.postId) return NextResponse.json({ error: "postId obrigatório" }, { status: 400 });

    // Check if already read
    const [existing] = await db.select().from(blogReads)
      .where(and(eq(blogReads.userId, userId), eq(blogReads.postId, body.postId)))
      .limit(1);

    if (existing?.completed) {
      return NextResponse.json({ alreadyRead: true, xpAwarded: existing.xpAwarded });
    }

    let xpAmount = 0;
    if (body.completed) xpAmount += 5;
    if (body.choiceMade) xpAmount += 3;

    if (xpAmount > 0) {
      const result = await awardXp({ userId, amount: xpAmount, reason: "blog_read" });
      xpAmount = result.awarded;
    }

    if (existing) {
      await db.update(blogReads).set({
        completed: body.completed || existing.completed,
        choiceMade: body.choiceMade || existing.choiceMade,
        xpAwarded: xpAmount,
      }).where(eq(blogReads.id, existing.id));
    } else {
      await db.insert(blogReads).values({
        id: crypto.randomUUID(),
        userId,
        postId: body.postId,
        completed: body.completed || false,
        choiceMade: body.choiceMade || null,
        xpAwarded: xpAmount,
      });
    }

    return NextResponse.json({ success: true, xpAwarded: xpAmount });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
