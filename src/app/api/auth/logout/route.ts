import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return clearAuthCookie(response);
  } catch (error) {
    console.error('[LOGOUT] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    return clearAuthCookie(response);
  } catch (error) {
    console.error('[LOGOUT] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
