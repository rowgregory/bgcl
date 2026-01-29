'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'
import { auth } from '../auth'
import { stripe } from '../stripe/stripeClient'

export async function deletePaymentMethod(paymentMethodId: string) {
  const session = await auth()
  try {
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Fetch payment method and verify ownership
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

    if (!paymentMethod) {
      return {
        success: false,
        error: 'Payment method not found'
      }
    }

    if (paymentMethod.userId !== session.user.id) {
      await createLog('warn', 'Unauthorized payment method deletion attempt', {
        userId: session.user.id,
        paymentMethodId,
        ownerId: paymentMethod.userId
      })
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Don't allow deleting default payment method
    if (paymentMethod.isDefault) {
      return {
        success: false,
        error: 'Cannot delete the default payment method. Set another as default first.'
      }
    }

    // Detach from Stripe
    try {
      await stripe.paymentMethods.detach(paymentMethod.stripePaymentId)
    } catch (stripeError: any) {
      // Payment method might already be detached, log but continue
      await createLog('warn', 'Stripe detach failed during payment method deletion', {
        paymentMethodId,
        stripePaymentId: paymentMethod.stripePaymentId,
        error: stripeError?.message
      })
    }

    // Delete from database
    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    })

    await createLog('info', 'Payment method deleted', {
      userId: session.user.id,
      paymentMethodId,
      cardBrand: paymentMethod.cardBrand,
      cardLast4: paymentMethod.cardLast4
    })

    revalidateTag('Payment-Method', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete payment method', {
      userId: session?.user?.id,
      paymentMethodId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to delete payment method. Please try again.'
    }
  }
}
