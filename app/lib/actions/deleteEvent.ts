'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, title: true }
    })

    if (!event) {
      return {
        success: false,
        error: 'Event not found'
      }
    }

    await prisma.event.delete({
      where: { id }
    })

    await createLog('info', 'Event deleted', {
      eventId: id,
      eventTitle: event.title
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })

    return {
      success: false,
      error: 'Failed to delete event. Please try again.'
    }
  }
}
