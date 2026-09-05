'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { serialize } from '@/lib/utils/serializers.utils'

/** Public lookup. Private and archived events are not reachable by id. */
export const getEventById = async (id: string) => {
  if (!id) return { success: false, data: null, error: 'Missing event id' }

  try {
    const event = await prisma.event.findFirst({
      where: {
        id,
        isPublic: true,
        status: { not: 'ARCHIVED' }
      },
      include: {
        tickets: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    if (!event) return { success: false, data: null, error: 'Could not find event' }

    return { success: true, data: serialize(event), error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })

    return { success: false, data: null, error: 'Could not load event by id' }
  }
}
