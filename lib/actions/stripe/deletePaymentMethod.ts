'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { createLog } from '../log/createLog'
import { stripe } from '../../stripe/stripeClient'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function deletePaymentMethod(paymentMethodId: string): Promise<{
  success: boolean
  data: null
  error: string | null
}> {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  if (!paymentMethodId) return { success: false, data: null, error: 'Payment method is required.' }

  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: {
        id: true,
        userId: true,
        isDefault: true,
        stripePaymentId: true,
        cardLast4: true,
        cardBrand: true
      }
    })

    // Same message for missing and unauthorized: a distinct error confirms it exists
    if (!paymentMethod || paymentMethod.userId !== auth.user.id) {
      if (paymentMethod) {
        await createLog('warn', 'Unauthorized payment method deletion attempt', {
          userId: auth.user.id,
          paymentMethodId,
          ownerId: paymentMethod.userId
        })
      }

      return { success: false, data: null, error: 'Payment method not found.' }
    }

    // Don't strand an active recurring donation without a card
    if (paymentMethod.isDefault) {
      const activeSubscription = await prisma.order.findFirst({
        where: {
          OR: [{ userId: auth.user.id }, ...(auth.user.email ? [{ customerEmail: auth.user.email }] : [])],
          type: 'RECURRING_DONATION',
          status: 'CONFIRMED',
          stripeSubscriptionId: { not: null },
          paymentMethodId: paymentMethod.stripePaymentId
        },
        select: { id: true }
      })

      if (activeSubscription) {
        return {
          success: false,
          data: null,
          error:
            'Cannot delete the default payment method while you have an active recurring donation. Please cancel your subscription first.'
        }
      }
    }

    try {
      await stripe.paymentMethods.detach(paymentMethod.stripePaymentId)
    } catch (stripeError) {
      // Already detached is fine; anything else should stop the delete
      const isAlreadyDetached =
        stripeError instanceof Stripe.errors.StripeInvalidRequestError && stripeError.message.includes('not attached')

      await createLog(isAlreadyDetached ? 'warn' : 'error', 'Stripe detach failed during payment method deletion', {
        userId: auth.user.id,
        paymentMethodId,
        stripePaymentId: paymentMethod.stripePaymentId,
        error: stripeError instanceof Error ? stripeError.message : 'Unknown error'
      })

      if (!isAlreadyDetached) {
        return { success: false, data: null, error: 'Could not remove the card. Please try again.' }
      }
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    })

    await createLog('info', 'Payment method deleted', {
      userId: auth.user.id,
      paymentMethodId,
      cardBrand: paymentMethod.cardBrand,
      cardLast4: paymentMethod.cardLast4
    })

    return { success: true, data: null, error: null }
  } catch (error) {
    await createLog('error', 'Failed to delete payment method', {
      userId: auth.user.id,
      paymentMethodId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to delete payment method. Please try again.' }
  }
}
