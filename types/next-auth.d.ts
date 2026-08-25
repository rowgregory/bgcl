import type { Role } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'

// Columns the adapter reads and writes beyond its own schema
declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: Role
    firstName?: string | null
    lastName?: string | null
  }
}

declare module 'next-auth' {
  /** Returned by the Google `profile()` mapping and handed to the adapter. */
  interface User extends DefaultUser {
    role?: Role
    firstName?: string | null
    lastName?: string | null
  }

  interface Session {
    user: {
      id: string
      role: Role
      firstName?: string | null
      lastName?: string | null
    } & DefaultSession['user']
  }
}
