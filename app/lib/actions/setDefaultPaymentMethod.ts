'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function setDefaultPaymentMethod(paymentMethodId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
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

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to set default payment method', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update default payment method. Please try again.'
    }
  }
}
