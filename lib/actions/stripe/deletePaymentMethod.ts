'use server'

import prisma from '@/prisma/client'
import Stripe from 'stripe'
import { createLog } from '../log/createLog'
import { stripe } from '../../stripe/stripeClient'
import { requireUser } from '@/lib/utils/requireAdmin'
import { isCardLinkedToSubscription } from './isCardLinkedToSubscription'
import { getOrCreateStripeCustomer } from './getOrCreateStripeCustomer'

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

    const isLinked = await isCardLinkedToSubscription(paymentMethod.stripePaymentId)

    if (isLinked) {
      return {
        success: false,
        data: null,
        error: 'This card funds an active monthly donation. Update your donation before removing it.'
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

    // Delete and pick a successor together, so the user is never left with
    // cards but no default
    const promoted = await prisma.$transaction(async (tx) => {
      await tx.paymentMethod.delete({ where: { id: paymentMethodId } })

      if (!paymentMethod.isDefault) return null

      const next = await tx.paymentMethod.findFirst({
        where: { userId: auth.user!.id },
        orderBy: { createdAt: 'desc' },
        select: { id: true, stripePaymentId: true }
      })

      if (!next) return null

      await tx.paymentMethod.update({
        where: { id: next.id },
        data: { isDefault: true }
      })

      return next
    })

    // Keep Stripe in step. Outside the transaction: a rollback can't undo a
    // Stripe write, and a failure here shouldn't fail the delete.
    if (promoted) {
      try {
        const stripeCustomerId = await getOrCreateStripeCustomer(auth.user.id)

        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: { default_payment_method: promoted.stripePaymentId }
        })
      } catch (error) {
        await createLog('error', 'Failed to sync default payment method to Stripe', {
          userId: auth.user.id,
          stripePaymentId: promoted.stripePaymentId,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    await createLog('info', 'Payment method deleted', {
      userId: auth.user.id,
      paymentMethodId,
      cardBrand: paymentMethod.cardBrand,
      cardLast4: paymentMethod.cardLast4,
      promotedPaymentMethodId: promoted?.id ?? null
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
