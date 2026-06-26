import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

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
            date: true,
            location: true
          }
        },
        orderItems: {
          select: {
            ticketName: true,
            quantity: true,
            pricePerUnit: true,
            totalPrice: true,
            raffleTicketCode: true,
            raffleTicketNumber: true,
            ticketDescription: true
          }
        }
      }
    })

    if (!order) return null

    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      feesCovered: Number(order.feesCovered),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
        totalPrice: item.totalPrice ? Number(item.totalPrice) : null
      }))
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch order', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
