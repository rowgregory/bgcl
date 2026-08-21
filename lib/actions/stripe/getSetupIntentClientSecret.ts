'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function getSetupIntentClientSecret(): Promise<{
  success: boolean
  data: { clientSecret: string | null } | null
  error: string | null
}> {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      return { success: false, data: null, error: 'No billing profile found for your account.' }
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card']
    })

    return { success: true, data: { clientSecret: setupIntent.client_secret }, error: null }
  } catch (error) {
    await createLog('error', 'Failed to create setup intent', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    return { success: false, data: null, error: 'Could not start card setup. Please try again.' }
  }
}
