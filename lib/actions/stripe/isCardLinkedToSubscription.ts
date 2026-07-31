'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth/auth'

export async function isCardLinkedToSubscription(paymentMethodId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    const activeOrder = await prisma.order.findFirst({
      where: {
        OR: [{ userId: session.user.id }, { customerEmail: session.user.email }],
        type: 'RECURRING_DONATION',
        status: 'CONFIRMED',
        stripeSubscriptionId: { not: null },
        paymentMethodId
      },
      select: { id: true }
    })

    return !!activeOrder
  } catch {
    return false
  }
}
