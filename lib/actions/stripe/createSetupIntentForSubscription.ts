'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { auth } from '@/lib/auth/auth'
import { getOrCreateStripeCustomer } from './getOrCreateStripeCustomer'

interface SetupIntentParams {
  email: string
  name: string
  amount: number // in cents
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  feesCovered?: number
  phone?: string
}

const MIN_AMOUNT_CENTS = 500
const MAX_METADATA_LENGTH = 450

const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)

export async function createSetupIntentForSubscription({
  email,
  name,
  amount,
  frequency,
  coverFees,
  feesCovered,
  phone
}: SetupIntentParams): Promise<{
  success: boolean
  data: { clientSecret: string | null; setupIntentId: string } | null
  error: string | null
}> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return { success: false, data: null, error: 'You must be signed in to set up a recurring donation.' }

  if (!Number.isInteger(amount) || amount < MIN_AMOUNT_CENTS) {
    return { success: false, data: null, error: 'Minimum donation is $5.' }
  }

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
        amount: String(amount),
        type: 'RECURRING_DONATION',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: String(feesCovered ?? 0),
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
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    return { success: false, data: null, error: 'Could not start the setup. Please try again.' }
  }
}
