'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getEventById = async (id: string) => {
  if (!id) return { success: false, data: null, error: 'Missing event id' }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!event) return { success: false, data: null, error: 'Could not find event' }

    return { success: true, data: event, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })
    return { success: false, data: null, error: 'Could not load event by id' }
  }
}
