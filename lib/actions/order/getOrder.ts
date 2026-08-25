import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export const getOrder = async (id: string) => {
  const auth = await requireUser()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

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

    if (!order) return { success: true, data: null, error: null }

    return {
      success: true,
      data: {
        ...order,
        totalAmount: Number(order.totalAmount),
        feesCovered: Number(order.feesCovered),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : null
        }))
      },
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch order', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load order' }
  }
}
