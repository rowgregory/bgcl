'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { NOT: { status: 'ARCHIVED' } },
      include: {
        tickets: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return events.map((event) => ({
      ...event,
      tickets: event.tickets.map((ticket) => ({
        ...ticket,
        price: Number(ticket.price)
      }))
    }))
  } catch (error) {
    await createLog('error', 'Error fetching events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to fetch events' }
  }
}
