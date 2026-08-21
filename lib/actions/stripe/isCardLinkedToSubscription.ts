'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

/**
 * True when the card still backs an active recurring donation.
 * Fails closed: on error it reports linked, so a lookup failure can't be
 * mistaken for permission to remove the card.
 *
 * Takes the Stripe payment method id, matching Order.paymentMethodId.
 */
export async function isCardLinkedToSubscription(stripePaymentId: string): Promise<boolean> {
  const auth = await requireUser()
  if (!auth.user) return true

  if (!stripePaymentId) return false

  try {
    const activeOrder = await prisma.order.findFirst({
      where: {
        OR: [{ userId: auth.user.id }, ...(auth.user.email ? [{ customerEmail: auth.user.email }] : [])],
        type: 'RECURRING_DONATION',
        status: 'CONFIRMED',
        stripeSubscriptionId: { not: null },
        paymentMethodId: stripePaymentId
      },
      select: { id: true }
    })

    return Boolean(activeOrder)
  } catch (error) {
    await createLog('error', 'Failed to check card subscription link', {
      userId: auth.user.id,
      stripePaymentId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return true
  }
}
