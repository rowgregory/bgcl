'use server'

import { auth } from '../auth'
import { createLog } from './createLog'
import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'

export async function createPaymentMethod(stripePaymentMethodId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) throw new Error('Stripe customer not found')

    // Attach to Stripe customer — webhook handles the rest
    await stripe.paymentMethods.attach(stripePaymentMethodId, {
      customer: user.stripeCustomerId
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to attach payment method', {
      stripePaymentMethodId,
      userId: session.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to save payment method. Please try again.' }
  }
}
