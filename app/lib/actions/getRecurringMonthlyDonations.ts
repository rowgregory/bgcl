'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getRecurringMonthlyDonations = unstable_cache(
  async () => {
    try {
      const donations = await prisma.order.findMany({
        where: {
          type: 'RECURRING_DONATION',
          recurringFrequency: 'monthly'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return donations
    } catch (error) {
      console.error('Error fetching recurring monthly donations:', error)
      return []
    }
  },
  ['getRecurringMonthlyDonations'],
  {
    tags: ['Order'],
    revalidate: 60
  }
)
