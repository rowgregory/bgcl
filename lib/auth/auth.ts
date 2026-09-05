import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import googleProvider from '../providers/google.provider'
import magicLinkProvider from '../providers/magic-link.provider'
import { createLog } from '../actions/log/createLog'

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
  },

  events: {
    // Fires on authentication, not on session resume, so this is the last time
    // they signed in rather than the last time they used the site. Wrapped
    // because a failed write here must never block the sign-in itself.
    async signIn({ user }) {
      if (!user?.id) return

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })
      } catch (error) {
        await createLog('warn', 'Could not record lastLoginAt', {
          userId: user.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }
})
