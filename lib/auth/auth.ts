import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

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
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      session.user.firstName = user.firstName
      session.user.lastName = user.lastName
      return session
    }
  }
})
