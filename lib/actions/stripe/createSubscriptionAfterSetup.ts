'use server'

import Stripe from 'stripe'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { auth } from '@/lib/auth/auth'

interface CreateSubscriptionParams {
  setupIntentId: string
  name: string
  email: string
  address?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipPostalCode?: string
    country?: string
  }
  notes?: string
  campaignId?: string
  phone?: string
}

const MIN_AMOUNT_CENTS = 500
const MAX_METADATA_LENGTH = 450

const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)

export async function createSubscriptionAfterSetup({
  setupIntentId,
  email,
  name,
  address,
  notes,
  campaignId,
  phone
}: CreateSubscriptionParams): Promise<{
  success: boolean
  data: { subscriptionId: string; status: string } | null
  error: string | null
}> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return { success: false, data: null, error: 'You must be signed in to set up a recurring donation.' }

  try {
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== 'succeeded') {
      return { success: false, data: null, error: 'Card confirmation failed. Please try again.' }
    }

    // The setup intent must be the one this user created
    if (setupIntent.metadata?.userId !== userId) {
      await createLog('warn', 'Setup intent ownership mismatch', { userId, setupIntentId })
      return { success: false, data: null, error: 'That setup could not be found.' }
    }

    const customerId = setupIntent.customer as string | null
    const paymentMethodId = setupIntent.payment_method as string | null

    if (!customerId || !paymentMethodId) {
      return { success: false, data: null, error: 'Card setup is incomplete. Please try again.' }
    }

    // Amount and frequency come from the setup intent, not the caller, so they
    // can't be changed between confirming the card and creating the subscription
    const amount = Number(setupIntent.metadata?.amount ?? 0)
    const frequency = setupIntent.metadata?.frequency === 'yearly' ? 'yearly' : 'monthly'

    if (!Number.isInteger(amount) || amount < MIN_AMOUNT_CENTS) {
      return { success: false, data: null, error: 'Minimum donation is $5.' }
    }

    const interval = frequency === 'monthly' ? 'month' : 'year'
    const intervalLabel = interval === 'month' ? 'Monthly' : 'Yearly'

    const product = await stripe.products.create({
      name: `${intervalLabel} Recurring Donation`,
      metadata: { type: 'RECURRING_DONATION', interval }
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      recurring: { interval, usage_type: 'licensed' },
      metadata: { frequency }
    })

    const subscription = await stripe.subscriptions.create(
      {
        customer: customerId,
        items: [{ price: price.id }],
        default_payment_method: paymentMethodId,
        payment_settings: { save_default_payment_method: 'on_subscription' },
        metadata: {
          userId,
          email: trim(email),
          name: trim(name),
          orderType: 'RECURRING_DONATION',
          frequency,
          coverFees: setupIntent.metadata?.coverFees ?? 'false',
          feesCovered: setupIntent.metadata?.feesCovered ?? '0',
          addressLine1: trim(address?.addressLine1),
          addressLine2: trim(address?.addressLine2),
          city: trim(address?.city),
          state: trim(address?.state),
          zipPostalCode: trim(address?.zipPostalCode),
          country: trim(address?.country) || 'US',
          notes: trim(notes),
          campaignId: trim(campaignId),
          phone: trim(phone)
        }
      },
      {
        // Keyed to the setup intent so a retry can't create a second subscription
        idempotencyKey: `sub_${setupIntentId}`
      }
    )

    await createLog('info', 'Recurring donation created', {
      userId,
      subscriptionId: subscription.id,
      frequency,
      amount
    })

    return {
      success: true,
      error: null,
      data: { subscriptionId: subscription.id, status: subscription.status }
    }
  } catch (error) {
    await createLog('error', 'Subscription creation error', {
      userId,
      email,
      setupIntentId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    if (error instanceof Stripe.errors.StripeCardError) {
      return { success: false, data: null, error: error.message }
    }

    return { success: false, data: null, error: 'Could not set up the recurring donation. Please try again.' }
  }
}
