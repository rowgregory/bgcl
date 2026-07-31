import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getOneTimeDonations = async () => {
  try {
    const donations = await prisma.order.findMany({
      where: {
        type: 'ONE_TIME_DONATION',
        isRecurring: false, // Explicitly exclude recurring
        stripeSubscriptionId: null // Make sure no subscription ID
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return donations
  } catch (error) {
    await createLog('error', 'Failed to fetch one time donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
