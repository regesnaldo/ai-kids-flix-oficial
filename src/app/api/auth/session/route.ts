import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const auth = await verifyToken(token);

    const userId = auth?.userId ? Number(auth.userId) : NaN;
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const rows = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: rows[0].id,
        email: rows[0].email ?? null,
        name: rows[0].name ?? null,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
