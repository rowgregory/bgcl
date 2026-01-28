'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

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

export async function getDonationOrders(): Promise<DonationOrder[]> {
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
    await createLog('error', 'Error fetching donations orders', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
