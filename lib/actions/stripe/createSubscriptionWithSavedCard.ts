'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { createLog } from '../log/createLog'
import { auth } from '@/lib/auth/auth'
import { stripe } from '@/lib/stripe/stripeClient'
import { grossUpCents } from '@/lib/utils/stripeFees'

interface CreateSubscriptionWithSavedCardParams {
  email: string
  name: string
  baseAmount: number
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  address?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipPostalCode?: string
    country?: string
  }
  notes?: string
  savedCardId: string
  campaignId?: string
  phone?: string
}

const MIN_BASE_CENTS = 500
const MAX_METADATA_LENGTH = 450

const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)

export async function createSubscriptionWithSavedCard({
  email,
  name,
  baseAmount,
  frequency,
  coverFees,
  address,
  notes,
  savedCardId,
  campaignId,
  phone
}: CreateSubscriptionWithSavedCardParams): Promise<{
  success: boolean
  data: { subscriptionId: string; status: string } | null
  error: string | null
}> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return { success: false, data: null, error: 'You must be signed in to set up a recurring donation.' }

  if (!Number.isInteger(baseAmount) || baseAmount < MIN_BASE_CENTS) {
    return { success: false, data: null, error: 'Minimum donation is $5.' }
  }

  if (!savedCardId) return { success: false, data: null, error: 'Choose a saved card to continue.' }

  // Fee is derived here and never accepted from the client. The donor covers it
  // on every cycle, so it belongs in unit_amount rather than a one-time add-on.
  const feeCents = coverFees ? grossUpCents(baseAmount) : 0
  const chargeAmount = baseAmount + feeCents

  try {
    // The card must belong to this user in our records, not just exist in Stripe
    const savedCard = await prisma.paymentMethod.findUnique({
      where: { stripePaymentId: savedCardId },
      select: { stripePaymentId: true, userId: true }
    })

    if (!savedCard || savedCard.userId !== userId) {
      await createLog('warn', 'Saved card ownership mismatch on subscription', { userId, savedCardId })
      return { success: false, data: null, error: 'That saved card is not available.' }
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(savedCard.stripePaymentId)
    const customerId = typeof paymentMethod.customer === 'string' ? paymentMethod.customer : null

    if (!customerId) {
      return { success: false, data: null, error: 'That saved card is not attached to a billing profile.' }
    }

    const interval = frequency === 'monthly' ? 'month' : 'year'
    const intervalLabel = interval === 'month' ? 'Monthly' : 'Yearly'

    const product = await stripe.products.create(
      {
        name: `${intervalLabel} Recurring Donation`,
        metadata: { type: 'recurring_donation', interval }
      },
      { idempotencyKey: `sub_product_${userId}_${interval}_${chargeAmount}` }
    )

    const price = await stripe.prices.create(
      {
        product: product.id,
        unit_amount: chargeAmount,
        currency: 'usd',
        recurring: { interval, usage_type: 'licensed' },
        metadata: {
          frequency,
          baseAmount: String(baseAmount),
          feeCents: String(feeCents)
        }
      },
      { idempotencyKey: `sub_price_${userId}_${interval}_${chargeAmount}` }
    )

    const subscription = await stripe.subscriptions.create(
      {
        customer: customerId,
        items: [{ price: price.id }],
        default_payment_method: savedCard.stripePaymentId,
        payment_settings: { save_default_payment_method: 'on_subscription' },
        // Nothing here can surface a 3DS challenge, so a subscription that lands
        // in `incomplete` would silently never collect. Fail loudly instead and
        // let the StripeCardError branch below return the decline to the donor.
        payment_behavior: 'error_if_incomplete',
        off_session: true,
        metadata: {
          userId,
          email: trim(email),
          name: trim(name),
          frequency,
          orderType: 'RECURRING_DONATION',
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
        // Stable within Stripe's 24h window, so a double submit can't create two.
        // Keyed on chargeAmount, not baseAmount, so toggling cover-fees and
        // resubmitting is treated as a different intent.
        idempotencyKey: `sub_${userId}_${frequency}_${chargeAmount}`
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
    await createLog('error', 'Subscription creation with saved card error', {
      userId,
      email,
      savedCardId,
      baseAmount,
      chargeAmount,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    if (error instanceof Stripe.errors.StripeCardError) {
      return { success: false, data: null, error: error.message }
    }

    return { success: false, data: null, error: 'Could not set up the recurring donation. Please try again.' }
  }
}
