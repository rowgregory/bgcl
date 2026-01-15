'use server'

import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'

export async function savePaymentMethod(userId: string, paymentMethodId: string, isDefault: boolean = false) {
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

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId
    })

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    // If setting as default, unset previous default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    // Save to database
    const savedMethod = await prisma.paymentMethod.upsert({
      where: { stripePaymentId: paymentMethodId },
      update: { isDefault },
      create: {
        stripePaymentId: paymentMethodId,
        cardBrand: paymentMethod.card?.brand || 'unknown',
        cardLast4: paymentMethod.card?.last4 || '0000',
        cardExpMonth: paymentMethod.card?.exp_month || 0,
        cardExpYear: paymentMethod.card?.exp_year || 0,
        isDefault,
        userId
      }
    })

    return {
      success: true,
      paymentMethod: {
        id: savedMethod.id,
        brand: savedMethod.cardBrand,
        last4: savedMethod.cardLast4,
        expMonth: savedMethod.cardExpMonth,
        expYear: savedMethod.cardExpYear,
        isDefault: savedMethod.isDefault
      }
    }
  } catch (error) {
    console.error('Error saving payment method:', error)
    return {
      success: false,
      error: 'Failed to save payment method'
    }
  }
}
