import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userAvatar } from "@/lib/db/schema-narrative";
import { eq } from "drizzle-orm";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { calculateAura } from "@/lib/aura/auraCalculator";

export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);

    const rows = await db
      .select()
      .from(userAvatar)
      .where(eq(userAvatar.userId, userId))
      .limit(1);

    const aura = await calculateAura(userId);

    if (rows.length === 0) {
      return NextResponse.json({
        shape: "sphere",
        color: "#00f0ff",
        auraColor: aura.auraColor,
        auraIntensity: aura.auraIntensity,
        auraLabel: aura.label,
        isNew: true,
      });
    }

    const avatar = rows[0];
    return NextResponse.json({
      shape: avatar.shape,
      color: avatar.color,
      auraColor: aura.auraColor,
      auraIntensity: aura.auraIntensity,
      auraLabel: aura.label,
      updatedAt: avatar.updatedAt,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

    const userId = parseInt(payload.userId, 10);
    const body = await request.json().catch(() => ({}));
    const { shape, color } = body as { shape?: string; color?: string };

    const aura = await calculateAura(userId);

    const existing = await db
      .select()
      .from(userAvatar)
      .where(eq(userAvatar.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userAvatar)
        .set({
          shape: shape || existing[0].shape,
          color: color || existing[0].color,
          auraColor: aura.auraColor,
          auraIntensity: String(aura.auraIntensity),
        })
        .where(eq(userAvatar.userId, userId));
    } else {
      await db.insert(userAvatar).values({
        userId,
        shape: shape || "sphere",
        color: color || "#00f0ff",
        auraColor: aura.auraColor,
        auraIntensity: String(aura.auraIntensity),
      });
    }

    return NextResponse.json({
      success: true,
      shape: shape || "sphere",
      color: color || "#00f0ff",
      auraColor: aura.auraColor,
      auraIntensity: aura.auraIntensity,
      auraLabel: aura.label,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
