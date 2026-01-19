'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getOneTimeDonations = unstable_cache(
  async () => {
    try {
      const donations = await prisma.order.findMany({
        where: {
          type: 'ONE_TIME_DONATION'
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
      console.error('Error fetching one-time donations:', error)
      return []
    }
  },
  ['getOneTimeDonations'],
  {
    tags: ['Order'],
    revalidate: 60
  }
)
