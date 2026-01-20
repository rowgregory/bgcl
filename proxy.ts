import { auth } from '@/app/lib/auth'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const session = await auth()

  // If authenticated and on login page, redirect away
  if (pathname === '/auth/login' && session?.user) {
    const { role } = session.user
    const redirectUrl = role === 'ADMIN' || role === 'SUPERUSER' ? '/admin/star-map/home' : '/supporter/overview'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Redirect to login if not authenticated (for protected routes)
  if (pathname.startsWith('/supporter') || pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const { role } = session.user

    if (pathname.startsWith('/admin') && role !== 'ADMIN' && role !== 'SUPERUSER') {
      return NextResponse.redirect(new URL('/supporter/overview', request.url))
    }

    if (pathname.startsWith('/supporter') && (role === 'ADMIN' || role === 'SUPERUSER')) {
      return NextResponse.redirect(new URL('/admin/star-map/home', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supporter/:path*', '/admin/:path*', '/auth/login']
}
