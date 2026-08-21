'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { createLog } from '../log/createLog'
import { auth } from '@/lib/auth/auth'
import { stripe } from '@/lib/stripe/stripeClient'

interface CreateSubscriptionWithSavedCardParams {
  email: string
  name: string
  amount: number
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  feesCovered?: number
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

const MIN_AMOUNT_CENTS = 500
const MAX_METADATA_LENGTH = 450

const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)

export async function createSubscriptionWithSavedCard({
  email,
  name,
  amount,
  frequency,
  coverFees,
  feesCovered,
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

  if (!Number.isInteger(amount) || amount < MIN_AMOUNT_CENTS) {
    return { success: false, data: null, error: 'Minimum donation is $5.' }
  }

  if (!savedCardId) return { success: false, data: null, error: 'Choose a saved card to continue.' }

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

    const product = await stripe.products.create({
      name: `${intervalLabel} Recurring Donation`,
      metadata: { type: 'recurring_donation', interval }
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
        default_payment_method: savedCard.stripePaymentId,
        payment_settings: { save_default_payment_method: 'on_subscription' },
        metadata: {
          userId,
          email: trim(email),
          name: trim(name),
          frequency,
          orderType: 'RECURRING_DONATION',
          coverFees: coverFees ? 'true' : 'false',
          feesCovered: String(feesCovered ?? 0),
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
        // Stable within Stripe's 24h window, so a double submit can't create two
        idempotencyKey: `sub_${userId}_${amount}_${frequency}`
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
    await createLog('error', 'Subscription creation with saved card error', {
      userId,
      email,
      savedCardId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined
    })

    if (error instanceof Stripe.errors.StripeCardError) {
      return { success: false, data: null, error: error.message }
    }

    return { success: false, data: null, error: 'Could not set up the recurring donation. Please try again.' }
  }
}
