'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function unarchiveEvent(eventId: string) {
  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'COMPLETED' }
    })

    return { success: true, data: event }
  } catch (error) {
    await createLog('error', 'Error unarchiving event', {
      eventId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to unarchive event' }
  }
}
