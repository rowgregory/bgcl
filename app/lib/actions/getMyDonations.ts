'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'
import { auth } from '../auth'

const getCachedDonations = unstable_cache(
  async (userId: string) => {
    return await prisma.order.findMany({
      where: {
        userId,
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
  },
  ['getMyDonations'],
  {
    revalidate: 60,
    tags: ['Order']
  }
)

export const getMyDonations = async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const donations = await getCachedDonations(session.user.id)

    return donations
  } catch (error) {
    console.error('Error fetching donations:', error)
    return {
      success: false,
      error: 'Failed to fetch donations'
    }
  }
}
