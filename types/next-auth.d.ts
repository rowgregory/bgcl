import { DefaultSession, DefaultUser } from 'next-auth'

declare module '@auth/core/adapters' {
  interface AdapterUser {
    callbackUrl?: string
    role: 'STAFF' | 'VOLUNTEER' | 'ADMIN' | 'SUPERUSER' | 'SUPPORTER' | 'PROGRAM'
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'STAFF' | 'VOLUNTEER' | 'ADMIN' | 'SUPERUSER' | 'SUPPORTER' | 'PROGRAM'
      callbackUrl?: string
    } & DefaultSession['user']
  }
}

interface User extends DefaultUser {
  id: string
  role: 'STAFF' | 'VOLUNTEER' | 'ADMIN' | 'SUPERUSER' | 'SUPPORTER' | 'PROGRAM'
  callbackUrl?: string
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    role: 'STAFF' | 'VOLUNTEER' | 'ADMIN' | 'SUPERUSER' | 'SUPPORTER' | 'PROGRAM'
    callbackUrl?: string
  }
}
