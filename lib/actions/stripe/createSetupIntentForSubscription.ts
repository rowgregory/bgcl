'use server'

import prisma from '@/prisma/client'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'

interface SetupIntentParams {
  userId?: string
  email: string
  name: string
  amount: number // in cents
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  feesCovered?: number
  phone?: string
}

export async function createSetupIntentForSubscription({
  userId,
  email,
  name,
  amount,
  frequency,
  coverFees,
  feesCovered,
  phone
}: SetupIntentParams) {
  try {
    if (amount < 500) throw new Error('Minimum donation is $5')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      throw new Error('Stripe customer not found for this user')
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId,
        email,
        name,
        frequency,
        amount: amount.toString(),
        type: 'RECURRING_DONATION',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered?.toString() || '0',
        phone
      }
    })

    return {
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    }
  } catch (error) {
    await createLog('error', 'SetupIntent creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      email
    })

    return {
      success: false,
      error: 'Failed to create setup intent'
    }
  }
}
