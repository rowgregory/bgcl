import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function getCapsuleTransactions() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        type: 'TICKET_PURCHASE'
      },
      include: {
        campaign: true,
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

    return orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      feesCovered: Number(order.feesCovered),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : null
      }))
    }))
  } catch (error) {
    await createLog('error', 'Error fetching capsule transactions', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
