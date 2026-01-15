'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'

interface DonationOrder {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  frequency: 'once' | 'monthly' | 'yearly'
  type: 'one-time' | 'recurring'
  status: 'active' | 'past_due' | 'canceled'
  startDate: string
  nextBillingDate: string
  stripeSubscriptionId: string
}

async function getDonationOrdersFn(): Promise<DonationOrder[]> {
  try {
    // Fetch all donation orders (one-time and recurring)
    const orders = await prisma.order.findMany({
      where: {
        type: {
          in: ['ONE_TIME_DONATION', 'RECURRING_DONATION']
        }
      },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        type: true,
        status: true,
        createdAt: true,
        nextBillingDate: true,
        stripeSubscriptionId: true,
        recurringFrequency: true,
        isRecurring: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format for frontend
    const formatted: DonationOrder[] = orders.map((order) => {
      const isRecurring = order.type === 'RECURRING_DONATION'

      return {
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        amount: order.totalAmount * 100, // Convert back to cents
        frequency: isRecurring ? (order.recurringFrequency as 'monthly' | 'yearly') : ('once' as const),
        type: order.type === 'ONE_TIME_DONATION' ? 'one-time' : 'recurring',
        status: order.status === 'CONFIRMED' ? 'active' : order.status === 'CANCELLED' ? 'canceled' : 'past_due',
        startDate: order.createdAt.toISOString(),
        nextBillingDate: order.nextBillingDate?.toISOString() || order.createdAt.toISOString(),
        stripeSubscriptionId: order.stripeSubscriptionId || 'N/A'
      }
    })

    return formatted
  } catch (error) {
    console.error('Error fetching donation orders:', error)
    throw new Error('Failed to fetch donation orders')
  }
}

export const getDonationOrders = unstable_cache(
  async () => {
    return getDonationOrdersFn()
  },
  ['donation-orders'],
  {
    tags: ['Order'],
    revalidate: 3600 // 1 hour
  }
)
