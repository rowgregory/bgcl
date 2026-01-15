import prisma from '@/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import { createLog } from './actions/createLog'
import { Role } from '@prisma/client'
import googleProvider from './auth/googleProvider'
import magicLinkProvider from './auth/magicLinkProvider'
import { handleEmailProvider } from './auth/handlers/handleEmailProvider'
import { handleGoogleProvider } from './auth/handlers/handleGoogleProvider'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: false,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },

  providers: [googleProvider, magicLinkProvider],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Route to appropriate provider handler
      try {
        switch (account?.provider) {
          case 'email':
            console.log('HANDLE EMAIL PROVIDER')
            return await handleEmailProvider(user)

          case 'google':
            return await handleGoogleProvider(user, account, profile)

          default:
            return true
        }
      } catch (error) {
        console.error(`❌ Sign-in error for ${account?.provider}:`, error)
        return false
      }
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              role: true,
              firstName: true,
              lastName: true
            }
          })

          if (dbUser) {
            token.userId = dbUser.id
            token.role = dbUser.role
            if (dbUser.firstName && dbUser.lastName) {
              token.name = `${dbUser.firstName} ${dbUser.lastName}`.trim()
            }
            // Store the redirect path in the token
            if (dbUser.role === 'ADMIN' || dbUser.role === 'SUPERUSER') {
              token.redirectPath = '/admin/mission-control'
            } else {
              token.redirectPath = '/supporter/overview'
            }
          }
        } catch (error) {
          await createLog('error', 'JWT callback error', {
            error: error instanceof Error ? error.message : 'Unknown error',
            email: user.email
          })
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token.userId && typeof token.userId === 'string') {
        session.user.id = token.userId
        session.user.role = token.role as Role
      } else {
        await createLog('error', 'Session callback error - missing userId', {
          email: session.user.email
        })
      }

      return session
    }
  }
})
