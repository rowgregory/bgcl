'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getRecurringYearlyDonations = unstable_cache(
  async () => {
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
      console.error('Error fetching recurring yearly donations:', error)
      return []
    }
  },
  ['getRecurringYearlyDonations'],
  {
    tags: ['Order'],
    revalidate: 60
  }
)
