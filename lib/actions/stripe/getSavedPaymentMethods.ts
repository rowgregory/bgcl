'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function getSavedPaymentMethods() {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: [], error: auth.error }

  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: auth.user.id },
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
        createdAt: true
      }
    })

    return { success: true, data: paymentMethods, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch saved payment methods', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: [], error: 'Could not load your saved cards.' }
  }
}
