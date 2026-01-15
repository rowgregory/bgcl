'use server'

import { stripe } from '../stripe/stripeClient'

interface CreateSubscriptionParams {
  setupIntentId: string
  frequency: 'monthly' | 'yearly'
  amount: number // in cents
}

export async function createSubscriptionAfterSetup({ setupIntentId, frequency, amount }: CreateSubscriptionParams) {
  try {
    // Get the confirmed setup intent
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== 'succeeded') {
      throw new Error('Card confirmation failed. Please try again.')
    }

    const customerId = setupIntent.customer as string
    const paymentMethodId = setupIntent.payment_method as string

    // Create product for this recurring donation
    const product = await stripe.products.create({
      name: `${frequency === 'monthly' ? 'Monthly' : 'Yearly'} Donation`,
      description: `Recurring donation of $${(amount / 100).toFixed(2)}/${frequency === 'monthly' ? 'month' : 'year'}`,
      metadata: {
        userId: setupIntent.metadata?.userId || 'guest',
        donorName: setupIntent.metadata?.name || ''
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
      default_payment_method: paymentMethodId,
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      metadata: {
        userId: setupIntent.metadata?.userId || 'guest',
        email: setupIntent.metadata?.email || '',
        name: setupIntent.metadata?.name || '',
        frequency
      }
    })

    return {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status
    }
  } catch (error) {
    console.error('Subscription creation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    }
  }
}
