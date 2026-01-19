import { auth } from '@/app/lib/auth'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const { role } = session.user
  const { pathname } = request.nextUrl

  // Admin routes - only ADMIN and SUPERUSER can access
  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN' && role !== 'SUPERUSER') {
      return NextResponse.redirect(new URL('/supporter/overview', request.url))
    }
  }

  // Supporter routes - only SUPPORTER can access
  if (pathname.startsWith('/supporter')) {
    if (role === 'ADMIN' || role === 'SUPERUSER') {
      return NextResponse.redirect(new URL('/admin/star-map/home', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supporter/:path*', '/admin/:path*']
}
