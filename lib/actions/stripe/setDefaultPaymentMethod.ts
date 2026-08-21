'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<{
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
      select: { userId: true, isDefault: true }
    })

    // Same message for missing and unauthorized: a distinct error confirms it exists
    if (!paymentMethod || paymentMethod.userId !== auth.user.id) {
      if (paymentMethod) {
        await createLog('warn', 'Unauthorized default payment method change', {
          userId: auth.user.id,
          paymentMethodId,
          ownerId: paymentMethod.userId
        })
      }

      return { success: false, data: null, error: 'Payment method not found.' }
    }

    if (paymentMethod.isDefault) return { success: true, data: null, error: null }

    // Both writes together, so a failure can't leave the user with no default
    await prisma.$transaction([
      prisma.paymentMethod.updateMany({
        where: { userId: auth.user.id, isDefault: true },
        data: { isDefault: false }
      }),
      prisma.paymentMethod.update({
        where: { id: paymentMethodId },
        data: { isDefault: true }
      })
    ])

    await createLog('info', 'Default payment method updated', {
      paymentMethodId,
      userId: auth.user.id
    })

    return { success: true, data: null, error: null }
  } catch (error) {
    await createLog('error', 'Failed to set default payment method', {
      userId: auth.user.id,
      paymentMethodId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to update default payment method. Please try again.' }
  }
}
