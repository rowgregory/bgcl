import prisma from '@/prisma/client'
import type { User } from 'next-auth'
import { createStripeCustomer } from '../../actions/stripe/createStripeCustomer'

export async function handleMagicLinkCallback(user: User) {
  const dbUser = await findOrCreateUser(user)
  await ensureEmailAccount(dbUser.id, user.email!)

  // NEW: Create Stripe customer if new user
  if (!dbUser.stripeCustomerId) {
    await createStripeCustomer(dbUser.id, dbUser.email, `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim())
  }

  return true
}

async function findOrCreateUser(user: User) {
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email!,
        role: 'SUPPORTER'
      },
      include: { accounts: true }
    })
  }

  return dbUser
}

async function ensureEmailAccount(userId: string, email: string) {
  const existing = await prisma.account.findFirst({
    where: { userId, provider: 'email' }
  })

  if (!existing) {
    await prisma.account.create({
      data: {
        userId,
        type: 'email',
        provider: 'email',
        providerAccountId: email
      }
    })
  }
}
