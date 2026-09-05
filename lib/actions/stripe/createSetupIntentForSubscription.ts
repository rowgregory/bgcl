'use server'

import Stripe from 'stripe'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { getOrCreateStripeCustomer } from './getOrCreateStripeCustomer'
import { grossUpCents } from '@/lib/utils/stripeFees'
import { trim } from '@/lib/stripe/metadata'
import { requireUser } from '@/lib/utils/requireAdmin'

interface SetupIntentParams {
  email: string
  name: string
  /** The donation itself, in cents. The fee is added downstream when covered. */
  baseAmount: number
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  phone?: string
}

const MIN_BASE_CENTS = 500

export async function createSetupIntentForSubscription({
  email,
  name,
  baseAmount,
  frequency,
  coverFees = false,
  phone
}: SetupIntentParams): Promise<{
  success: boolean
  data: { clientSecret: string | null; setupIntentId: string } | null
  error: string | null
}> {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: 'You must be signed in to set up a recurring donation.' }

  const userId = auth.user!.id

  if (!Number.isInteger(baseAmount) || baseAmount < MIN_BASE_CENTS) {
    return { success: false, data: null, error: 'Minimum donation is $5.' }
  }

  // The fee is derived here, never taken from the caller. It is carried on the
  // intent so createSubscriptionAfterSetup prices the subscription from what
  // was agreed at card confirmation rather than recomputing it.
  const feeCents = coverFees ? grossUpCents(baseAmount) : 0
  const chargeAmount = baseAmount + feeCents

  try {
    const stripeCustomerId = await getOrCreateStripeCustomer(userId)

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        userId,
        email: trim(email),
        name: trim(name),
        frequency,
        type: 'RECURRING_DONATION',
        coverFees: coverFees ? 'true' : 'false',
        baseAmount: String(baseAmount),
        feesCovered: String(feeCents),
        chargeAmount: String(chargeAmount),
        phone: trim(phone)
      }
    })

    return {
      success: true,
      error: null,
      data: {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      }
    }
  } catch (error) {
    await createLog('error', 'SetupIntent creation error', {
      userId,
      email,
      baseAmount,
      chargeAmount,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    return { success: false, data: null, error: 'Could not start the setup. Please try again.' }
  }
}
