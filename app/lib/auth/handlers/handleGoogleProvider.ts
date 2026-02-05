import prisma from '@/prisma/client'
import type { Account, Profile, User } from 'next-auth'
import { createLog } from '../../actions/createLog'
import { createStripeCustomer } from '../../actions/createStripeCustomer'

export async function handleGoogleProvider(user: User, account: Account, profile?: any) {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (existingUser) {
    await linkGoogleAccount(existingUser, account)
    await updateUserFromProfile(existingUser, profile)
    user.id = existingUser.id
  } else {
    // Create new user with SUPPORTER role
    const newUser = await prisma.user.create({
      data: {
        email: user.email!,
        firstName: profile?.given_name || '',
        lastName: profile?.family_name || '',
        role: 'SUPPORTER'
      }
    })

    await linkGoogleAccount(newUser as any, account)

    await createStripeCustomer(newUser.id, newUser.email, `${newUser.firstName} ${newUser.lastName}`.trim())

    user.id = newUser.id

    await logNewGoogleUser(user, account)
  }

  return true
}

async function linkGoogleAccount(existingUser: any, account: Account) {
  // Handle case where accounts might not be loaded (new user)
  const hasGoogleAccount =
    existingUser.accounts?.some(
      (acc: any) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId
    ) || false

  if (!hasGoogleAccount) {
    await prisma.account.create({
      data: {
        userId: existingUser.id,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        access_token: account.access_token,
        expires_at: account.expires_at,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        scope: account.scope,
        token_type: account.token_type
      }
    })
  }
}

async function updateUserFromProfile(user: any, profile?: Profile) {
  if (profile?.name && (!user.firstName || !user.lastName)) {
    const [firstName, lastName] = profile.name.split(' ')

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName
      }
    })
  }
}

async function logNewGoogleUser(user: User, account: Account) {
  await createLog('info', 'New Google user - will be handled in JWT callback', {
    location: ['googleProvider.ts'],
    provider: 'google',
    userEmail: user.email,
    accountId: account.providerAccountId
  })
}
