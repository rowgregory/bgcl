import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export type UpcomingEventFlags = {
  id: string
  showAttendingToggle: boolean
} | null

/**
 * The club runs one event at a time, so checkout reads its display flags from
 * whichever published event is next. Returns null when nothing is upcoming,
 * and the caller treats that as every flag off.
 */
export async function getUpcomingEventFlags(): Promise<UpcomingEventFlags> {
  try {
    const event = await prisma.event.findFirst({
      where: { date: { gte: new Date() }, status: { in: ['UPCOMING', 'ONGOING'] } },
      orderBy: { date: 'asc' },
      select: { id: true, showAttendingToggle: true }
    })

    return event
  } catch (error) {
    await createLog('error', 'Could not load upcoming event flags', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return null
  }
}
