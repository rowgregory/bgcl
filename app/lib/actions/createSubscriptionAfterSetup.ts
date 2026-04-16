'use server'

import { stripe } from '../stripe/stripeClient'
import { createLog } from './createLog'

interface CreateSubscriptionParams {
  setupIntentId: string
  name: string
  email: string
  frequency: 'monthly' | 'yearly'
  amount: number
  coverFees?: boolean
  feesCovered?: number
  address?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  notes?: string
  campaignId?: string
  phone?: string
}

export async function createSubscriptionAfterSetup({
  setupIntentId,
  email,
  name,
  frequency,
  amount,
  coverFees,
  feesCovered,
  address,
  notes,
  campaignId,
  phone
}: CreateSubscriptionParams) {
  try {
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== 'succeeded') {
      throw new Error('Card confirmation failed. Please try again.')
    }

    const customerId = setupIntent.customer as string
    const paymentMethodId = setupIntent.payment_method as string
    const userId = setupIntent.metadata?.userId

    if (!userId) throw new Error('User ID not found in setup intent metadata')

    const interval = frequency === 'monthly' ? 'month' : 'year'

    const product = await stripe.products.create({
      name: `${interval === 'month' ? 'Monthly' : 'Yearly'} Recurring Donation`,
      metadata: { type: 'RECURRING_DONATION' }
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
          email,
          name,
          orderType: 'RECURRING_DONATION',
          frequency,
          coverFees: coverFees ? 'true' : 'false',
          feesCovered: feesCovered?.toString() || '0',
          addressLine1: address?.addressLine1 || '',
          addressLine2: address?.addressLine2 || '',
          city: address?.city || '',
          state: address?.state || '',
          zipCode: address?.zipCode || '',
          country: address?.country || 'US',
          notes: notes || '',
          campaignId: campaignId || '',
          phone
        }
      },
      {
        idempotencyKey: `sub_${customerId}_${campaignId || 'general'}_${Date.now()}`
      }
    )

    return {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status
    }
  } catch (error) {
    await createLog('error', 'Subscription creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email,
      name
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    }
  }
}
