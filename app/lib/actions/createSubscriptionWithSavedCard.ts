'use server'

import { stripe } from '../stripe/stripeClient'
import { createLog } from './createLog'

interface CreateSubscriptionWithSavedCardParams {
  userId: string
  email: string
  name: string
  amount: number // in cents
  frequency: 'monthly' | 'yearly'
  coverFees?: boolean
  feesCovered?: number
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  notes?: string
  savedCardId?: string
  campaignId?: string
}

export async function createSubscriptionWithSavedCard({
  userId,
  email,
  name,
  amount,
  frequency,
  coverFees,
  feesCovered,
  address,
  city,
  state,
  zipCode,
  country,
  notes,
  savedCardId,
  campaignId
}: CreateSubscriptionWithSavedCardParams) {
  try {
    // VALIDATE MINIMUM AMOUNT
    if (amount < 500) {
      // Stripe uses cents, so $5 = 500
      throw new Error('Minimum donation is $5')
    }

    // Get the payment method to find the customer
    const paymentMethod = await stripe.paymentMethods.retrieve(savedCardId)

    if (!paymentMethod.customer) {
      throw new Error('Payment method is not attached to a customer')
    }

    const customerId = paymentMethod.customer as string

    // Create product for this recurring donation
    const product = await stripe.products.create({
      name: `${frequency === 'monthly' ? 'Monthly' : 'Yearly'} Donation`,
      description: `Recurring donation of $${(amount / 100).toFixed(2)}/${frequency === 'monthly' ? 'month' : 'year'}`,
      metadata: {
        userId: userId || 'guest',
        donorName: name || ''
      }
    })

    // Create price for the subscription
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: 'usd',
      recurring: {
        interval: frequency === 'monthly' ? 'month' : 'year',
        usage_type: 'licensed'
      },
      metadata: {
        frequency
      }
    })

    // Create subscription with the saved payment method
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
      default_payment_method: savedCardId,
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      metadata: {
        userId: userId || 'guest',
        email: email || '',
        name: name || '',
        frequency,
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered?.toString() || '0',
        address: address || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        country: country || '',
        notes: notes || '',
        campaignId: campaignId || ''
      }
    })

    return {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status
    }
  } catch (error) {
    await createLog('error', 'Subscription creation with saved card error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription with saved card'
    }
  }
}
