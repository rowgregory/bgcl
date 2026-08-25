import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import type { Role } from '@prisma/client'

import googleProvider from '../providers/google.provider'
import magicLinkProvider from '../providers/magic-link.provider'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  debug: false,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },

  providers: [googleProvider, magicLinkProvider],

  callbacks: {
    // `user` is the database row, so no lookup needed
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = (user as { role: Role }).role
      return session
    }
  }
})
