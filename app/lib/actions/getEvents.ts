import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getEvents = async () => {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublic: true
      },
      include: {
        tickets: true
      }
    })

    return events
  } catch (error) {
    await createLog('error', 'Failed to fetch events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
