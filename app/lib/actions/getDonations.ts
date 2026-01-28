'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getDonations = unstable_cache(
  async () => {
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
      return []
    }
  },
  ['getDonations'],
  {
    tags: ['Order'],
    revalidate: 60
  }
)
