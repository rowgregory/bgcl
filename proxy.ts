import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const session = await auth()

  // If authenticated and on login page, redirect to appropriate dashboard
  if (pathname === '/auth/login' && session?.user) {
    const { role } = session.user

    if (role === 'ADMIN' || role === 'SUPERUSER') {
      return NextResponse.redirect(new URL('/admin/star-map/home', request.url))
    }

    if (role === 'PROGRAM') {
      return NextResponse.redirect(new URL('/program/airlock', request.url))
    }

    // SUPPORTER role
    return NextResponse.redirect(new URL('/supporter/overview', request.url))
  }

  // Redirect to login if not authenticated (for protected routes)
  if (pathname.startsWith('/supporter/') || pathname.startsWith('/admin/') || pathname.startsWith('/program/')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const { role } = session.user

    // ADMIN/SUPERUSER access control
    if (pathname.startsWith('/admin/')) {
      if (role !== 'ADMIN' && role !== 'SUPERUSER') {
        // Redirect non-admin users to their appropriate dashboard
        if (role === 'PROGRAM') {
          return NextResponse.redirect(new URL('/program/airlock', request.url))
        }
        return NextResponse.redirect(new URL('/supporter/overview', request.url))
      }
    }

    // PROGRAM access control
    if (pathname.startsWith('/program/')) {
      if (role !== 'PROGRAM') {
        // Redirect non-program users to their appropriate dashboard
        if (role === 'ADMIN' || role === 'SUPERUSER') {
          return NextResponse.redirect(new URL('/admin/star-map/home', request.url))
        }
        return NextResponse.redirect(new URL('/supporter/overview', request.url))
      }
    }

    // SUPPORTER access control
    if (pathname.startsWith('/supporter/')) {
      if (role === 'ADMIN' || role === 'SUPERUSER') {
        return NextResponse.redirect(new URL('/admin/star-map/home', request.url))
      }
      if (role === 'PROGRAM') {
        return NextResponse.redirect(new URL('/program/airlock', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supporter/:path*', '/admin/:path*', '/program/:path*', '/auth/login']
}
