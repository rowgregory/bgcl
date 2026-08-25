import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { DEFAULT_HOME, PROGRAM_HOME, PROGRAM_PATHS, ROLE_HOME, URL_REDIRECTS } from './lib/constants/auth.constants'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static redirects run before the session lookup so they cost no query
  if (URL_REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(URL_REDIRECTS[pathname], request.url), { status: 301 })
  }

  const session = await auth()
  const role = session?.user?.role

  if (pathname === '/auth/login') {
    return role ? NextResponse.redirect(new URL(ROLE_HOME[role] ?? DEFAULT_HOME, request.url)) : NextResponse.next()
  }

  if (!role) return NextResponse.redirect(new URL('/auth/login', request.url))

  if (pathname.startsWith('/super')) {
    if (role !== 'SUPERUSER') {
      return NextResponse.redirect(new URL(ROLE_HOME[role] ?? DEFAULT_HOME, request.url))
    }

    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (role === 'PROGRAM') {
      return PROGRAM_PATHS.some((p) => pathname.startsWith(p))
        ? NextResponse.next()
        : NextResponse.redirect(new URL(PROGRAM_HOME, request.url))
    }

    if (role !== 'ADMIN' && role !== 'SUPERUSER') {
      return NextResponse.redirect(new URL('/supporter/overview', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/supporter/:path*',
    '/admin/:path*',
    '/super/:path*',
    '/our-team',
    '/join-our-team',
    '/our-history',
    '/contact-us',
    '/news-events/newsletter',
    '/auth/login'
  ]
}
