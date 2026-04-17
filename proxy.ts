import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

const URL_REDIRECTS: Record<string, string> = {
  '/our-team': '/team',
  '/join-our-team': '/get-involved',
  '/our-history': '/about#history',
  '/contact-us': '/contact',
  '/news-events/newsletter': '/latest-news'
}

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const session = await auth()
  const role = session?.user?.role

  // Handle URL redirects
  if (URL_REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(URL_REDIRECTS[pathname], request.url), { status: 301 })
  }

  if (pathname === '/auth/login' && role) {
    const redirect = request.cookies.get('bgcl_redirect')?.value

    if (role === 'ADMIN' || role === 'SUPERUSER') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'PROGRAM') return NextResponse.redirect(new URL('/program/job-applications', request.url))

    const response = NextResponse.redirect(new URL(redirect || '/supporter/overview', request.url))
    response.cookies.delete('bgcl_redirect')
    return response
  }

  // Protected routes
  const isProtected = ['/supporter/', '/admin/', '/program/'].some((r) => pathname.startsWith(r))
  if (!isProtected) return NextResponse.next()

  // Unauthenticated — send to login
  if (!role) return NextResponse.redirect(new URL('/auth/login', request.url))

  // Admin routes
  if (pathname.startsWith('/admin/')) {
    if (role !== 'ADMIN' && role !== 'SUPERUSER')
      return NextResponse.redirect(new URL('/supporter/overview', request.url))
    return NextResponse.next()
  }

  // Program routes
  if (pathname.startsWith('/program/')) {
    if (role !== 'PROGRAM') return NextResponse.redirect(new URL('/supporter/overview', request.url))
    return NextResponse.next()
  }

  // Supporter routes — redirect admins away from entry point
  if (pathname.startsWith('/supporter/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/supporter/:path*',
    '/admin/:path*',
    '/program/:path*',
    '/auth/login',

    // Add old URL paths to the matcher so middleware checks them
    '/our-team',
    '/join-our-team',
    '/our-history',
    '/contact-us',
    '/news-events/newsletter'
  ]
}
