'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getOrder = unstable_cache(
  async (id: string) => {
    try {
      // Mock order for testing
      if (id === 'test-order-123') {
        return {
          id: 'test-order-123',
          type: 'TICKET_PURCHASE',
          status: 'CONFIRMED',
          totalAmount: 149.99,
          customerEmail: 'john@example.com',
          customerName: 'John Doe',
          createdAt: new Date(),
          paidAt: new Date(),
          isRecurring: false,
          recurringFrequency: null,
          nextBillingDate: null,
          event: {
            name: 'Summer Music Festival',
            date: new Date('2026-06-15'),
            time: '6:00 PM'
          },
          orderItems: [
            {
              ticketName: 'VIP Pass',
              quantity: 2,
              pricePerUnit: 65.0,
              totalPrice: 130.0
            },
            {
              ticketName: 'General Admission',
              quantity: 1,
              pricePerUnit: 19.99,
              totalPrice: 19.99
            }
          ]
        }
      }

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
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
