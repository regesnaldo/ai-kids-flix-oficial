// ============================================================
// MENTE.AI — src/lib/auth.ts
// Fonte única de verdade para JWT + cookies de autenticação.
// Importado pelo Middleware, pelas Route Handlers e pelo cliente.
// ============================================================

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export const COOKIE_NAME = "mente_ai_token" as const;
export const LEGACY_COOKIE_NAME = "token" as const;

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function getJwtSecretKey(): Uint8Array {
  const raw = process.env.JWT_SECRET;

  if (!raw || raw.trim() === "") {
    throw new Error(
      "[MENTE.AI] JWT_SECRET não definido. Adicione-o no .env.local:\nJWT_SECRET=sua_chave_secreta_aqui"
    );
  }

  return new TextEncoder().encode(raw.trim());
}

export interface MenteAiJwtPayload extends JWTPayload {
  userId: string;
  email: string;
  plan: "free" | "premio" | "familiar";
}

export async function signToken(payload: MenteAiJwtPayload): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secretKey);
}

export async function verifyToken(token: string): Promise<MenteAiJwtPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as MenteAiJwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}

export async function getAuthCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? store.get(LEGACY_COOKIE_NAME)?.value ?? null;
}

export function getAuthCookieFromRequest(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? request.cookies.get(LEGACY_COOKIE_NAME)?.value ?? null;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  for (const cookieName of [COOKIE_NAME, LEGACY_COOKIE_NAME]) {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
  return response;
}

export async function getSessionUser(): Promise<MenteAiJwtPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}
