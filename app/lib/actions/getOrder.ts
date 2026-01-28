import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getOrder = async (id: string) => {
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
    await createLog('error', 'Failed to fetch order', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
