'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'

interface ChargeParams {
  userId: string
  paymentMethodId: string
  amount: number // in cents
  orderType: 'DONATION' | 'TICKET_PURCHASE'
  description: string
}

export async function chargeWithPaymentMethod({
  userId,
  paymentMethodId,
  amount,
  orderType,
  description
}: ChargeParams) {
  try {
    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    if (!user?.stripeCustomerId) {
      return {
        success: false,
        error: 'Customer not found'
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true, // Recurring/saved card
      confirm: true,
      description,
      metadata: {
        userId,
        orderType
      }
    })

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: 'succeeded'
      }
    } else if (paymentIntent.status === 'requires_action') {
      return {
        success: false,
        error: '3D Secure authentication required',
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      }
    } else {
      return {
        success: false,
        error: 'Payment failed',
        status: paymentIntent.status
      }
    }
  } catch (error) {
    console.error('Charge error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    }
  }
}
