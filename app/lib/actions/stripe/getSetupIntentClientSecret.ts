'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth/auth'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'

export async function getSetupIntentClientSecret() {
  try {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) throw new Error('Stripe customer not found for this user')

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card']
    })

    return { success: true, clientSecret: setupIntent.client_secret }
  } catch (error) {
    await createLog('error', 'Failed to create setup intent', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get client secret'
    }
  }
}
