'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getDonations = async () => {
  try {
    const donations = await prisma.order.findMany({
      where: {
        type: {
          in: ['ONE_TIME_DONATION', 'RECURRING_DONATION']
        }
      },
      include: { campaign: true },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return donations
  } catch (error) {
    await createLog('error', 'Failed to fetch donations', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
