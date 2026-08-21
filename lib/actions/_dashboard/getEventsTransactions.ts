import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function getEventsTransactions() {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    return {
      success: true,
      data: orders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        feesCovered: Number(order.feesCovered),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          pricePerUnit: item.pricePerUnit ? Number(item.pricePerUnit) : null,
          totalPrice: item.totalPrice ? Number(item.totalPrice) : null,
          ticket: {
            ...item.ticket,
            ticketSalesStartDate: item.ticket.event?.ticketSalesStartDate ?? null,
            ticketSalesEndDate: item.ticket.event?.ticketSalesEndDate ?? null,
            event: {
              ...item.ticket.event,
              rafflePrizes: (item.ticket.event?.rafflePrizes as { place: string; amount: string }[] | null) ?? [],
              raffleSchedule: (item.ticket.event?.raffleSchedule as { time: string; label: string }[] | null) ?? [],
              dressCodeItems:
                (item.ticket.event?.dressCodeItems as { label: string; description: string }[] | null) ?? []
            }
          }
        }))
      })),
      error: null
    }
  } catch (error) {
    await createLog('error', 'Error fetching events transactions', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load event transactions.' }
  }
}
