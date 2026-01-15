'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id }
    })

    if (!event) {
      await createLog('warn', 'Event not found for deletion', {
        eventId: id
      })
      return { success: false, error: 'Event not found', status: 404 }
    }

    await prisma.event.delete({
      where: { id }
    })

    await createLog('info', 'Event deleted successfully', {
      eventId: event.id,
      eventTitle: event.title
    })

    revalidateTag('Event', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event',
      status: 500
    }
  }
}
