import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/", "/home"];
const protectedRoutes = ["/player", "/sucesso", "/perfis", "/conta"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some((route) => pathname === route);
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isPublic || !isProtected) return NextResponse.next();
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*", "/player/:path*", "/sucesso/:path*", "/perfis/:path*", "/conta/:path*"],
};
