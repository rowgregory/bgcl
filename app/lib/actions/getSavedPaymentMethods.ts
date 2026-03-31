'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { auth } from '../auth'

export async function getSavedPaymentMethods() {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, data: [] }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        stripePaymentId: true,
        cardholderName: true,
        cardBrand: true,
        cardLast4: true,
        cardExpMonth: true,
        cardExpYear: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    })

    return {
      success: true,
      data: paymentMethods
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch saved payment methods', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to get saved payment methods.',
      data: []
    }
  }
}
