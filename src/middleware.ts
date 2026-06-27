import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const tokenValue = request.cookies.get('mente_ai_token')?.value ?? null
  const { pathname } = request.nextUrl

  const protectedRoutes = [
    '/home',
    '/lab',
    '/universo',
    '/dashboard',
    '/aulas',
    '/perfil',
    '/conta',
    '/player',
    '/explorar',
    '/agentes',
    '/avatar',
    '/series',
    '/logos',
    '/certificado',
    '/blog/admin',
    '/admin',
  ]

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Valida o JWT: token ausente, inválido ou expirado → redireciona para login
  const payload = tokenValue ? await verifyToken(tokenValue) : null

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Sentinel: acesso restrito a admin
  if (pathname.startsWith('/sentinel')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if ((payload as { role?: string }).role !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  if (pathname === '/' && payload) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/home/:path*',
    '/lab/:path*',
    '/universo/:path*',
    '/dashboard/:path*',
    '/aulas/:path*',
    '/perfil/:path*',
    '/conta/:path*',
    '/player/:path*',
    '/explorar/:path*',
    '/agentes/:path*',
    '/avatar/:path*',
    '/sentinel/:path*',
    '/series/:path*',
    '/logos/:path*',
    '/certificado/:path*',
    '/blog/admin/:path*',
    '/admin/:path*',
  ]
}
