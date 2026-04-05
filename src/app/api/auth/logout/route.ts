import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  return clearAuthCookie(response);
}
