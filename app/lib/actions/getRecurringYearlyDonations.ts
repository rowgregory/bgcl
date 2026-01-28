import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getRecurringYearlyDonations = async () => {
  try {
    const donations = await prisma.order.findMany({
      where: {
        type: 'RECURRING_DONATION',
        recurringFrequency: 'yearly'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return donations
  } catch (error) {
    await createLog('error', 'Failed to fetch recurring yearly donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
