import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = [
  "/home",
  "/dashboard",
  "/aulas",
  "/perfil",
  "/perfis",
  "/conta",
  "/agentes",
  "/explorar",
  "/ranking",
  "/player",
  "/sucesso",
  "/laboratorio",
];

const apiProtectedRoutes = ["/api/profiles", "/api/notes", "/api/xp", "/api/badges", "/api/dashboard"];
const authRoutes = ["/login", "/onboarding"];
const publicRoutes = ["/logout"];
const PRIMARY_COOKIE_NAME = "mente_ai_token";
const LEGACY_COOKIE_NAME = "token";

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

function clearAuthCookie(response: NextResponse) {
  for (const cookieName of [PRIMARY_COOKIE_NAME, LEGACY_COOKIE_NAME]) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
  if (isPublic) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isProtected    = protectedRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const isApiProtected = apiProtectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute    = authRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));

  const token =
    request.cookies.get(PRIMARY_COOKIE_NAME)?.value ??
    request.cookies.get(LEGACY_COOKIE_NAME)?.value ??
    null;
  const payload         = token ? await verifyToken(token) : null;
  const isAuthenticated = !!payload;

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if ((isProtected || isApiProtected) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) clearAuthCookie(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)"],
};

