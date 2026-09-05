'use server'

import Stripe from 'stripe'
import { stripe } from '../../stripe/stripeClient'
import { createLog } from '../log/createLog'
import { trim } from '@/lib/stripe/metadata'
import { requireUser } from '@/lib/utils/requireAdmin'

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

const MIN_BASE_CENTS = 500

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
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: 'You must be signed in to set up a recurring donation.' }

  const userId = auth.user!.id

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

    // Amount, fee and frequency all come from the setup intent, not the caller,
    // so they can't be changed between confirming the card and creating the
    // subscription. The fee was derived server-side when the intent was made.
    const baseAmount = Number(setupIntent.metadata?.baseAmount ?? 0)
    const feeCents = Number(setupIntent.metadata?.feesCovered ?? 0)
    const chargeAmount = Number(setupIntent.metadata?.chargeAmount ?? 0)
    const coverFees = setupIntent.metadata?.coverFees === 'true'
    const frequency = setupIntent.metadata?.frequency === 'yearly' ? 'yearly' : 'monthly'

    if (!Number.isInteger(baseAmount) || baseAmount < MIN_BASE_CENTS) {
      return { success: false, data: null, error: 'Minimum donation is $5.' }
    }

    if (!Number.isInteger(feeCents) || feeCents < 0) {
      await createLog('warn', 'Setup intent carried an unusable fee', { userId, setupIntentId, feeCents })
      return { success: false, data: null, error: 'Could not set up the recurring donation. Please try again.' }
    }

    const interval = frequency === 'monthly' ? 'month' : 'year'
    const intervalLabel = interval === 'month' ? 'Monthly' : 'Yearly'

    const product = await stripe.products.create(
      {
        name: `${intervalLabel} Recurring Donation`,
        metadata: { type: 'RECURRING_DONATION', interval }
      },
      { idempotencyKey: `sub_product_${setupIntentId}` }
    )

    const price = await stripe.prices.create(
      {
        product: product.id,
        // The donor covers the fee on every cycle, so it rides in unit_amount
        unit_amount: chargeAmount,
        currency: 'usd',
        recurring: { interval, usage_type: 'licensed' },
        metadata: {
          frequency,
          baseAmount: String(baseAmount),
          feeCents: String(feeCents)
        }
      },
      { idempotencyKey: `sub_price_${setupIntentId}` }
    )

    const subscription = await stripe.subscriptions.create(
      {
        customer: customerId,
        items: [{ price: price.id }],
        default_payment_method: paymentMethodId,
        payment_settings: { save_default_payment_method: 'on_subscription' },
        // Nothing here can surface a second 3DS challenge, so a subscription
        // that lands in `incomplete` would silently never collect. Fail loudly
        // and let the StripeCardError branch below return the decline.
        payment_behavior: 'error_if_incomplete',
        off_session: true,
        metadata: {
          userId,
          email: trim(email),
          name: trim(name),
          orderType: 'RECURRING_DONATION',
          frequency,
          coverFees: coverFees ? 'true' : 'false',
          baseAmount: String(baseAmount),
          feesCovered: String(feeCents),
          chargeAmount: String(chargeAmount),
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
      baseAmount,
      feeCents,
      chargeAmount
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
