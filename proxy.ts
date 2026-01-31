import { NextResponse } from 'next/server'
import { auth } from './app/lib/auth'

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const session = await auth()

  // If authenticated and on login page, redirect to appropriate dashboard
  if (pathname === '/auth/login' && session?.user) {
    const { role } = session.user

    if (role === 'ADMIN' || role === 'SUPERUSER') {
      return NextResponse.redirect(new URL('/admin/mission-control', request.url))
    }

    if (role === 'PROGRAM') {
      return NextResponse.redirect(new URL('/program/airlock', request.url))
    }

    // SUPPORTER role
    return NextResponse.redirect(new URL('/supporter/overview', request.url))
  }

  // Protected routes - require authentication
  const protectedRoutes = ['/supporter/', '/admin/', '/program/']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Redirect unauthenticated users to login
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const { role } = session.user

    // Helper function to redirect to correct dashboard
    const redirectToDashboard = (userRole: string) => {
      if (userRole === 'ADMIN' || userRole === 'SUPERUSER') {
        return NextResponse.redirect(new URL('/admin/mission-control', request.url))
      }
      if (userRole === 'PROGRAM') {
        return NextResponse.redirect(new URL('/program/airlock', request.url))
      }
      return NextResponse.redirect(new URL('/supporter/overview', request.url))
    }

    // ADMIN/SUPERUSER access control
    if (pathname.startsWith('/admin/')) {
      if (role !== 'ADMIN' && role !== 'SUPERUSER') {
        return redirectToDashboard(role)
      }
      // Admin/Superuser can access admin routes - allow
      return NextResponse.next()
    }

    // PROGRAM access control
    if (pathname.startsWith('/program/')) {
      if (role !== 'PROGRAM') {
        return redirectToDashboard(role)
      }
      // Program can access program routes - allow
      return NextResponse.next()
    }

    // SUPPORTER access control - everyone can access /supporter/overview
    if (pathname.startsWith('/supporter/')) {
      // Allow all authenticated roles to access supporter routes
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supporter/:path*', '/admin/:path*', '/program/:path*', '/auth/login']
}
