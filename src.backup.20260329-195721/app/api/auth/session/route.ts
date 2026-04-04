import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const auth = payload as { userId?: number; email?: string; name?: string };

    if (!auth.userId || !Number.isInteger(auth.userId) || auth.userId <= 0) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: auth.userId,
        email: auth.email ?? null,
        name: auth.name ?? null,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
