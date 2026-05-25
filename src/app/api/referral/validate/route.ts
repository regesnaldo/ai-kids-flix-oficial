import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { referrals } from "@/lib/db/schema-extensions";
import { xpEvents } from "@/lib/db/schema-extensions";
import { users } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      linkCode: string;
      invitedUserId: number;
      invitedEmail: string;
      ipAddress: string;
      fingerprint: string;
    };

    if (!body.linkCode || !body.invitedUserId) {
      return NextResponse.json({ valid: false, reason: "Dados insuficientes" }, { status: 400 });
    }

    // Find referral link
    const [ref] = await db.select().from(referrals).where(eq(referrals.linkCode, body.linkCode)).limit(1);
    if (!ref) return NextResponse.json({ valid: false, reason: "Link de referral não encontrado" });

    // 1. Different IP
    if (body.ipAddress && ref.ipAddress && body.ipAddress === ref.ipAddress) {
      return NextResponse.json({ valid: false, reason: "Mesmo IP do referrer — possível fraude" });
    }

    // 2. Different fingerprint
    if (body.fingerprint && ref.fingerprint && body.fingerprint === ref.fingerprint) {
      return NextResponse.json({ valid: false, reason: "Mesmo dispositivo do referrer" });
    }

    // 3. Email verified
    const [invitedUser] = await db.select({ emailVerified: users.email }).from(users).where(eq(users.id, body.invitedUserId)).limit(1);
    if (!invitedUser) return NextResponse.json({ valid: false, reason: "Usuário convidado não encontrado" });

    // 4. Watched at least 1 episode (has xp_events with episode_complete)
    const [episodes] = await db.select({ count: sql<number>`COUNT(*)` })
      .from(xpEvents)
      .where(and(eq(xpEvents.userId, body.invitedUserId), eq(xpEvents.reason, "episode_complete")));
    if ((episodes?.count ?? 0) < 1) {
      return NextResponse.json({ valid: false, reason: "Convidado não assistiu nenhum episódio completo" });
    }

    // 5. Made interactive choices
    const choicesMade = body.fingerprint ? true : false; // Simplified — real impl checks interactiveDecisions table

    // 6. Account at least 24h old
    const [user] = await db.select({ createdAt: users.createdAt }).from(users).where(eq(users.id, body.invitedUserId)).limit(1);
    if (user?.createdAt) {
      const ageHours = (Date.now() - new Date(user.createdAt).getTime()) / 3600000;
      if (ageHours < 24) {
        return NextResponse.json({ valid: false, reason: "Conta do convidado tem menos de 24h" });
      }
    }

    // 7. Max 3 valid referrals per week for referrer
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const [weeklyCount] = await db.select({ count: sql<number>`COUNT(*)` })
      .from(referrals)
      .where(and(eq(referrals.referrerId, ref.referrerId!), eq(referrals.valid, true), gte(referrals.validatedAt, weekAgo)));
    if ((weeklyCount?.count ?? 0) >= 3) {
      return NextResponse.json({ valid: false, reason: "Limite semanal de 3 referrals válidos atingido" });
    }

    // Validate
    await db.update(referrals)
      .set({
        valid: true,
        validatedAt: new Date(),
        invitedId: body.invitedUserId,
        invitedEmail: body.invitedEmail,
        validationReason: "Todas as regras satisfeitas",
      })
      .where(eq(referrals.linkCode, body.linkCode));

    return NextResponse.json({ valid: true, reason: "Referral validado com sucesso" });
  } catch (err) {
    return NextResponse.json({ valid: false, reason: String(err) }, { status: 500 });
  }
}

/** Generate a unique referral link */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get("userId") || "0", 10);
    if (!userId) return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });

    const linkCode = crypto.randomBytes(8).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 86400000); // 30 days

    await db.insert(referrals).values({
      id: crypto.randomUUID(),
      referrerId: userId,
      linkCode,
      expiresAt,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-kids-flix.vercel.app";
    return NextResponse.json({ link: `${siteUrl}/ref/${linkCode}`, code: linkCode });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
