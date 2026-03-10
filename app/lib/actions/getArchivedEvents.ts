import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function getArchivedEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'ARCHIVED' },
      include: {
        orders: {
          where: { status: 'CONFIRMED', type: 'TICKET_PURCHASE' },
          select: {
            totalAmount: true,
            orderItems: { select: { quantity: true } }
          }
        },
        _count: { select: { attendees: true } }
      },
      orderBy: { date: 'desc' }
    })

    return events
  } catch (error) {
    await createLog('error', 'Error fetching archived events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
