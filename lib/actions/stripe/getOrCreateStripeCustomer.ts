'use server'

import { stripe } from '@/lib/stripe/stripeClient'
import prisma from '@/prisma/client'

export async function getOrCreateStripeCustomer(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, stripeCustomerId: true }
  })

  if (!user) throw new Error('User not found')
  if (user.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || undefined,
    metadata: { userId: user.id }
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id }
  })

  return customer.id
}
