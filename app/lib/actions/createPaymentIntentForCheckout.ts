'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'
import Stripe from 'stripe'
import { createLog } from './createLog'
import { OrderType } from '@prisma/client'

interface DonateCheckoutParams {
  userId?: string
  email: string
  name: string
  amount: number
  orderType: OrderType
  description: string
  saveCard?: boolean
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
  savedCardId?: string
  campaignId?: string
  notes?: string
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
  notes,
  campaignId,
  savedCardId
}: DonateCheckoutParams) {
  try {
    if (amount < 500) {
      throw new Error('Minimum purchase amount is $5')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    const customerId = user?.stripeCustomerId ?? undefined

    // Create payment intent
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      customer: customerId,
      receipt_email: email,
      description,
      setup_future_usage: saveCard ? 'on_session' : undefined,
      metadata: {
        userId,
        orderType,
        name,
        email,
        saveCard: saveCard ? 'true' : 'false',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: feesCovered.toString(),
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        state: address?.state || '',
        zipCode: address?.zipCode || '',
        country: 'US',
        notes: notes || '',
        campaignId: campaignId || ''
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
