'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { BillingAddress } from '@/app/(authenticated)/admin/donations/_types/donation.types'
import { requireAdmin } from '@/lib/utils/requireAdmin'

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
          cycles: [cycle]
        })
        continue
      }

      if (donation.status === 'CONFIRMED') {
        existing.cycleCount += 1
        existing.lifetimeAmount += donation.totalAmount
        existing.lifetimeFeesCovered += donation.feesCovered
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
