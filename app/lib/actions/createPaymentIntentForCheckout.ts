'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'
import Stripe from 'stripe'
import { createLog } from './createLog'

interface CheckoutParams {
  userId?: string
  email: string
  name: string
  amount: number // in cents
  orderType: 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE'
  description: string
  saveCard?: boolean
  coverFees?: boolean
  feesCovered?: number
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  notes?: string
  campaignId?: string
  savedCardId?: string
  tickets?: string
  eventId?: string
}

export async function createPaymentIntentForCheckout({
  userId,
  email,
  name,
  amount,
  orderType,
  description,
  saveCard = false,
  coverFees = false,
  feesCovered = 0,
  address,
  city,
  state,
  zipCode,
  country,
  notes,
  campaignId,
  savedCardId,
  tickets,
  eventId
}: CheckoutParams) {
  try {
    // VALIDATE MINIMUM AMOUNT
    if (amount < 500) {
      // Remember: Stripe uses cents, so $5 = 500
      throw new Error('Minimum donation is $5')
    }

    let customerId: string | undefined

    if (userId) {
      // Logged-in user - use their customer
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true }
      })

      if (user?.stripeCustomerId) {
        customerId = user.stripeCustomerId
      }
    } else {
      // Not logged in - check if user exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { stripeCustomerId: true }
      })

      if (existingUser?.stripeCustomerId) {
        // User has account and Stripe customer, use it
        customerId = existingUser.stripeCustomerId
      } else {
        // No user record - check Stripe for existing customer by email
        const stripeCustomers = await stripe.customers.search({
          query: `email:"${email}"`,
          limit: 1
        })

        if (stripeCustomers.data.length > 0) {
          // Reuse existing Stripe customer (from previous guest donation)
          customerId = stripeCustomers.data[0].id
        } else {
          // No Stripe customer - create guest customer
          const customer = await stripe.customers.create({
            email,
            metadata: {
              userId: 'guest',
              createdAt: new Date().toISOString()
            }
          })
          customerId = customer.id
        }
      }
    }

    // Create payment intent
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      customer: customerId,
      receipt_email: email,
      description,
      setup_future_usage: saveCard ? 'on_session' : undefined,
      metadata: {
        userId: userId || 'guest',
        orderType,
        name,
        email,
        saveCard: saveCard ? 'true' : 'false',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered.toString(),
        address: address || '',
        city: city || '',
        state: state || '',
        zipCode: zipCode || '',
        country: country || '',
        notes: notes || '',
        campaignId: campaignId || '',
        tickets,
        eventId
      }
    }

    if (savedCardId) {
      const savedCard = await prisma.paymentMethod.findUnique({
        where: { stripePaymentId: savedCardId },
        select: { stripePaymentId: true, userId: true }
      })

      if (!savedCard || savedCard.userId !== userId) {
        throw new Error('Saved card not found or unauthorized')
      }

      // Verify the payment method is attached to the customer
      const paymentMethod = await stripe.paymentMethods.retrieve(savedCard.stripePaymentId)

      if (paymentMethod.customer !== customerId) {
        throw new Error('Payment method does not belong to this customer')
      }

      paymentIntentParams.payment_method = savedCard.stripePaymentId
      paymentIntentParams.off_session = true
      paymentIntentParams.confirm = true
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Payment intent error details:', error)

    await createLog('error', 'Payment intent creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeError: error instanceof Error ? (error as any).code : undefined,
      name,
      email,
      savedCardId,
      userId
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment intent creation error. Please try again.'
    }
  }
}
