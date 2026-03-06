'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export async function getTicketOrders() {
  const session = await auth()

  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ userId: session.user.id }, { customerEmail: session.user.email }],
        type: 'TICKET_PURCHASE',
        status: 'CONFIRMED'
      },
      include: {
        event: true,
        orderItems: {
          include: {
            ticket: {
              include: {
                event: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return orders
  } catch (error) {
    await createLog('error', 'Failed to fetch ticket orders', {
      userId: session.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to fetch ticket orders' }
  }
}
