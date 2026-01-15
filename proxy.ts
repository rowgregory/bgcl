import { auth } from '@/app/lib/auth'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const session = await auth()

  if (session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERUSER') {
    if (request.nextUrl.pathname === '/supporter/overview') {
      return NextResponse.redirect(new URL('/admin/mission-control', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/supporter/:path*', '/admin/:path*']
}
