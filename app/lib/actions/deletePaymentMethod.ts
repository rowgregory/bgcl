'use server'

import { revalidateTag } from 'next/cache'
import { auth } from '../auth'
import prisma from '@/prisma/client'
import { stripe } from '../stripe/stripeClient'

export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // 1️⃣ Fetch payment method and verify ownership
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    })

    if (!paymentMethod || paymentMethod.userId !== session.user.id) {
      throw new Error('Payment method not found')
    }

    // 2️⃣ Don't allow deleting default payment method
    if (paymentMethod.isDefault) {
      return {
        success: false,
        error: 'Cannot delete the default payment method. Set another as default first.'
      }
    }

    // 3️⃣ Detach from Stripe
    try {
      await stripe.paymentMethods.detach(paymentMethod.stripePaymentId)
    } catch (stripeError: any) {
      // Payment method might already be detached in Stripe, continue with DB delete
      console.warn('Stripe detach error:', stripeError?.message)
    }

    // 4️⃣ Delete from DB
    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    })

    // 5️⃣ Revalidate cache
    revalidateTag('Payment-Method', 'default') // Correct tag name from getCachedPaymentMethods

    return {
      success: true,
      message: 'Payment method deleted'
    }
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete payment method'
    }
  }
}
