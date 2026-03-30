import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function getUpcomingOrOngoingEvent() {
  try {
    const now = new Date()

    const event = await prisma.event.findFirst({
      where: {
        status: { in: ['UPCOMING', 'ONGOING'] },
        date: { gte: now }
      },
      orderBy: {
        date: 'asc' // closest to today first
      },
      include: {
        tickets: true
      }
    })

    return { success: true, data: event }
  } catch (error) {
    await createLog('error', 'Failed to fetch upcoming or active event', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, event: null }
  }
}
