'use server'

import { cookies } from 'next/headers'

export async function setRedirectCookie(redirect: string) {
  const cookieStore = await cookies()
  cookieStore.set('bgcl_redirect', redirect, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 300
  })
}
