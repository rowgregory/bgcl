'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { BillingAddress } from '@/app/(authenticated)/admin/donations/_types/donation.types'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export type SubscriptionState = 'ACTIVE' | 'CANCELLING' | 'CANCELLED' | null

/**
 * Order.status answers "did this charge collect", so it stays CONFIRMED on a
 * cancelled subscription's historic cycles. Whether the subscription itself is
 * still running comes from the two subscription columns instead.
 */
const subscriptionState = (donation: {
  type: string
  stripeSubscriptionId?: string | null
  subscriptionCanceledAt?: Date | null
  subscriptionCancelsAt?: Date | null
}): SubscriptionState => {
  if (donation.type !== 'RECURRING_DONATION' || !donation.stripeSubscriptionId) return null
  if (donation.subscriptionCanceledAt) return 'CANCELLED'
  if (donation.subscriptionCancelsAt) return 'CANCELLING'

  return 'ACTIVE'
}

export async function getDonations() {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const donations = await prisma.order.findMany({
      where: { type: { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] } },
      include: { campaign: true },
      orderBy: { createdAt: 'desc' }
    })

    const serialized = donations.map((donation) => ({
      ...donation,
      totalAmount: Number(donation.totalAmount),
      feesCovered: Number(donation.feesCovered),
      billingAddress: (donation.billingAddress as BillingAddress | null) ?? null
    }))

    // One row per subscription, not per billing cycle. Orders arrive newest
    // first, so the first one seen for a subscription is the current cycle.
    const bySubscription = new Map<
      string,
      (typeof serialized)[number] & {
        cycleCount: number
        lifetimeAmount: number
        lifetimeFeesCovered: number
        firstPaidAt: Date
        subscriptionState: SubscriptionState
        cycles: { id: string; totalAmount: number; status: string; createdAt: Date; paidAt: Date | null }[]
      }
    >()

    const rows: typeof serialized = []

    for (const donation of serialized) {
      if (donation.type !== 'RECURRING_DONATION' || !donation.stripeSubscriptionId) {
        rows.push(donation)
        continue
      }

      const existing = bySubscription.get(donation.stripeSubscriptionId)

      const cycle = {
        id: donation.id,
        totalAmount: donation.totalAmount,
        status: donation.status,
        createdAt: donation.createdAt,
        paidAt: donation.paidAt
      }

      if (!existing) {
        bySubscription.set(donation.stripeSubscriptionId, {
          ...donation,
          // totalAmount stays the current per-cycle amount
          cycleCount: donation.status === 'CONFIRMED' ? 1 : 0,
          lifetimeAmount: donation.status === 'CONFIRMED' ? donation.totalAmount : 0,
          lifetimeFeesCovered: donation.status === 'CONFIRMED' ? donation.feesCovered : 0,
          firstPaidAt: donation.createdAt,
          subscriptionState: subscriptionState(donation),
          cycles: [cycle]
        })
        continue
      }

      if (donation.status === 'CONFIRMED') {
        existing.cycleCount += 1
        existing.lifetimeAmount += donation.totalAmount
        existing.lifetimeFeesCovered += donation.feesCovered
      }

      // Cancellation is written to whichever cycle rows the webhook touched, so
      // any cycle reporting a cancellation settles it for the whole subscription
      if (existing.subscriptionState === 'ACTIVE' || existing.subscriptionState === 'CANCELLING') {
        const state = subscriptionState(donation)
        if (state === 'CANCELLED' || (state === 'CANCELLING' && existing.subscriptionState === 'ACTIVE')) {
          existing.subscriptionState = state
          existing.subscriptionCanceledAt = donation.subscriptionCanceledAt
          existing.subscriptionCancelsAt = donation.subscriptionCancelsAt
        }
      }

      existing.firstPaidAt = donation.createdAt
      existing.cycles.push(cycle)
    }

    const merged = [
      ...rows.map((r) => ({
        ...r,
        cycleCount: r.status === 'CONFIRMED' ? 1 : 0,
        lifetimeAmount: r.status === 'CONFIRMED' ? r.totalAmount : 0,
        lifetimeFeesCovered: r.status === 'CONFIRMED' ? r.feesCovered : 0,
        firstPaidAt: r.createdAt,
        subscriptionState: subscriptionState(r),
        cycles: []
      })),
      ...bySubscription.values()
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { success: true, data: merged, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load donations' }
  }
}
