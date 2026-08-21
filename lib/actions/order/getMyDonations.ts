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
      include: {
        campaign: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const serializedDonations = donations.map((donation) => ({
      ...donation,
      totalAmount: Number(donation.totalAmount),
      feesCovered: Number(donation.feesCovered)
    }))

    return { success: true, data: serializedDonations, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch my donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load donations' }
  }
}
