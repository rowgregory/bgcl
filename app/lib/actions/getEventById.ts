'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getEventById = async (id: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: {
          where: { isAvailable: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!event) {
      await createLog('warn', 'Event not found', {
        eventId: id
      })
      return null
    }

    return event
  } catch (error) {
    await createLog('error', 'Failed to fetch event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })
    throw error
  }
}
