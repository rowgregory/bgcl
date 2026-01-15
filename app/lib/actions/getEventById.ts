'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getEventById = unstable_cache(
  async (id: string) => {
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
      return null
    }
  },
  ['getEventById'],
  { tags: ['Event'] }
)
