'use server'

import prisma from '@/prisma/client'
import { stripe } from '../../stripe/stripeClient'
import Stripe from 'stripe'
import { createLog } from '../log/createLog'
import { OrderType } from '@prisma/client'
import { auth } from '@/lib/auth/auth'

interface DonateCheckoutParams {
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
    zipPostalCode?: string
    country?: string
  }
  savedCardId?: string
  campaignId?: string
  notes?: string
  phone?: string
}

const MIN_AMOUNT_CENTS = 500
const MAX_METADATA_LENGTH = 450

const trim = (value?: string | null) => (value ?? '').slice(0, MAX_METADATA_LENGTH)

export async function createPaymentIntentForCheckout({
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
  savedCardId,
  phone
}: DonateCheckoutParams): Promise<{
  success: boolean
  data: { clientSecret: string | null; paymentIntentId: string } | null
  error: string | null
}> {
  // The user comes from the session, never from the caller
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return { success: false, data: null, error: 'You must be signed in to complete this donation.' }

  if (!Number.isInteger(amount) || amount < MIN_AMOUNT_CENTS) {
    return { success: false, data: null, error: 'Minimum purchase amount is $5.' }
  }

  try {
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
      setup_future_usage: saveCard && customerId ? 'on_session' : undefined,
      metadata: {
        userId,
        orderType,
        name: trim(name),
        email: trim(email),
        saveCard: saveCard ? 'true' : 'false',
        coverFees: coverFees ? 'true' : 'false',
        feesCovered: String(feesCovered),
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
    }

    if (savedCardId) {
      const savedCard = await prisma.paymentMethod.findUnique({
        where: { stripePaymentId: savedCardId },
        select: { stripePaymentId: true, userId: true }
      })

      if (!savedCard || savedCard.userId !== userId) {
        await createLog('warn', 'Saved card ownership mismatch', { userId, savedCardId })
        return { success: false, data: null, error: 'That saved card is not available.' }
      }

      const paymentMethod = await stripe.paymentMethods.retrieve(savedCard.stripePaymentId)

      if (!customerId || paymentMethod.customer !== customerId) {
        await createLog('warn', 'Saved card customer mismatch', { userId, savedCardId })
        return { success: false, data: null, error: 'That saved card is not available.' }
      }

      paymentIntentParams.payment_method = savedCard.stripePaymentId
      paymentIntentParams.off_session = true
      paymentIntentParams.confirm = true
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)

    return {
      success: true,
      error: null,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    }
  } catch (error) {
    await createLog('error', 'Payment intent creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stripeCode: error instanceof Stripe.errors.StripeError ? error.code : undefined,
      name,
      email,
      phone,
      savedCardId,
      userId
    })

    // Stripe card errors are written for cardholders; anything else stays internal
    if (error instanceof Stripe.errors.StripeCardError) {
      return { success: false, data: null, error: error.message }
    }

    return { success: false, data: null, error: 'Could not start the payment. Please try again.' }
  }
}
