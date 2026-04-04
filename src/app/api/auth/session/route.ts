import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

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

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userId,
        email: auth?.email ?? null,
        name: null,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
