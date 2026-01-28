import prisma from '@/prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

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
        userId: session.user.id,
        type: { in: ['ONE_TIME_DONATION', 'RECURRING_DONATION'] },
        status: 'CONFIRMED'
      },
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        customerName: true,
        customerEmail: true,
        status: true,
        type: true,
        recurringFrequency: true,
        campaign: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return donations
  } catch (error) {
    await createLog('error', 'Failed to fetch my donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
