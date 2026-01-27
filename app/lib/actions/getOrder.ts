'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getOrder = unstable_cache(
  async (id: string) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          event: {
            select: {
              title: true,
              date: true
            }
          },
          orderItems: {
            select: {
              ticketName: true,
              quantity: true,
              pricePerUnit: true,
              totalPrice: true
            }
          }
        }
      })

      if (!order) return null

      return order
    } catch (error) {
      console.error('Error fetching order:', error)
      throw new Error('Failed to fetch order')
    }
  },
  ['getOrder'],
  { tags: ['Order'], revalidate: 60 }
)
