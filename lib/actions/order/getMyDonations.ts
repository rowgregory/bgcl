import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export const getMyDonations = async () => {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const donations = await prisma.order.findMany({
      where: {
        OR: [{ userId: auth.user.id }, { customerEmail: auth.user.email }],
        type: { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] }
      },
      include: { campaign: true },
      orderBy: { createdAt: 'desc' }
    })

    const serialized = donations.map((donation) => ({
      ...donation,
      totalAmount: Number(donation.totalAmount),
      feesCovered: Number(donation.feesCovered)
    }))

    // One row per subscription rather than per billing cycle. Orders arrive
    // newest first, so the first one seen carries the current amount.
    const bySubscription = new Map<string, any>()
    const rows: any[] = []

    // Cancelling stops future charges; it doesn't undo the ones already collected
    // A charge only counts once it actually collected
    const wasCollected = (status: string) => status === 'CONFIRMED'

    for (const donation of serialized) {
      const cycle = {
        id: donation.id,
        stripeInvoiceId: donation.stripeInvoiceId,
        totalAmount: donation.totalAmount,
        status: donation.status,
        createdAt: donation.createdAt,
        paidAt: donation.paidAt
      }

      if (donation.type !== 'RECURRING_DONATION' || !donation.stripeSubscriptionId) {
        rows.push({
          ...donation,
          cycleCount: wasCollected(donation.status) ? 1 : 0,
          lifetimeAmount: wasCollected(donation.status) ? donation.totalAmount : 0,
          firstPaidAt: donation.createdAt,
          cycles: [cycle]
        })
        continue
      }

      const existing = bySubscription.get(donation.stripeSubscriptionId)

      if (!existing) {
        bySubscription.set(donation.stripeSubscriptionId, {
          ...donation,
          cycleCount: wasCollected(donation.status) ? 1 : 0,
          lifetimeAmount: wasCollected(donation.status) ? donation.totalAmount : 0,
          firstPaidAt: donation.createdAt,
          cycles: [cycle]
        })
        continue
      }

      if (wasCollected(donation.status)) {
        existing.cycleCount += 1
        existing.lifetimeAmount += donation.totalAmount
      }

      existing.firstPaidAt = donation.createdAt
      existing.cycles.push(cycle)
    }

    const merged = [...rows, ...bySubscription.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return { success: true, data: merged, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch my donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load donations' }
  }
}
