'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { stripe } from '../stripe/stripeClient'
import { createLog } from './createLog'

interface TicketCheckoutParams {
  userId: string
  email: string
  name: string
  amount: number
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
  tickets: string
  eventId: string
  attendingEvent?: boolean
}

export async function createPaymentIntentForTicketCheckout({
  userId,
  email,
  name,
  amount,
  description,
  saveCard = false,
  coverFees = false,
  feesCovered = 0,
  address,
  savedCardId,
  tickets,
  eventId,
  attendingEvent
}: TicketCheckoutParams) {
  try {
    if (amount < 500) {
      throw new Error('Minimum purchase amount is $5')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })

    const customerId = user?.stripeCustomerId ?? undefined

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      customer: customerId,
      receipt_email: email,
      description,
      setup_future_usage: saveCard ? 'on_session' : undefined,
      metadata: {
        userId,
        orderType: 'TICKET_PURCHASE',
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
        tickets,
        eventId,
        attendingEvent: attendingEvent ? 'true' : 'false'
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
    await createLog('error', 'Ticket payment intent creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeError: error instanceof Error ? (error as any).code : undefined,
      name,
      email,
      savedCardId,
      userId,
      eventId
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment intent creation error. Please try again.'
    }
  }
}
