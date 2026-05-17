import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('mente_ai_token')
  const { pathname } = request.nextUrl

  const protectedRoutes = [
    '/home',
    '/lab',
    '/universo',
    '/dashboard',
    '/aulas',
    '/perfil',
  ]

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/' && token) {
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
  ]
}
