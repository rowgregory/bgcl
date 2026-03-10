'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function archiveEvent(eventId: string) {
  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'ARCHIVED' }
    })

    return { success: true, data: event }
  } catch (error) {
    await createLog('error', 'Error archiving event', {
      eventId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to archive event' }
  }
}
