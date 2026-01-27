'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

// app/actions/payment-methods.ts
export async function setDefaultPaymentMethod(paymentMethodId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Verify the payment method belongs to the user
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: { userId: true }
    })

    if (!paymentMethod || paymentMethod.userId !== session.user.id) {
      throw new Error('Payment method not found')
    }

    // Unset all other default payment methods
    await prisma.paymentMethod.updateMany({
      where: {
        userId: session.user.id,
        isDefault: true
      },
      data: { isDefault: false }
    })

    // Set this one as default
    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true }
    })

    // Revalidate cache
    revalidateTag('Payment-Method', 'default')

    await createLog('info', 'Default payment method updated', {
      paymentMethodId,
      userId: session.user.id
    })

    return {
      success: true,
      message: 'Default payment method updated'
    }
  } catch (error) {
    console.error('Error setting default payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update default payment method'
    }
  }
}
