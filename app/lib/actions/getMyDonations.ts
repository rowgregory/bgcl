import prisma from '@/prisma/client'
import { auth } from '../auth'
import { createLog } from './log/createLog'

export const getMyDonations = async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const donations = await prisma.order.findMany({
      where: {
        OR: [{ userId: session.user.id }, { customerEmail: session.user.email }],
        type: { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] }
      },
      include: {
        campaign: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return donations.map((donation) => ({
      ...donation,
      totalAmount: Number(donation.totalAmount),
      feesCovered: Number(donation.feesCovered)
    }))
  } catch (error) {
    await createLog('error', 'Failed to fetch my donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
