'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function getTicketOrders() {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ userId: auth.user.id }, { customerEmail: auth.user.email }],
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

    const serialized = orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      feesCovered: Number(order.feesCovered),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : null
      }))
    }))

    return { success: true, data: serialized, error: null }

    return {
      success: true,
      data: serialized,
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch ticket orders', {
      userId: auth.user.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, data: null, error: 'Could not load ticket orders' }
  }
}
