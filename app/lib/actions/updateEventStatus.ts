'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { EventStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function updateEventStatus(id: string, status: EventStatus) {
  try {
    const event = await prisma.event.findUnique({
      where: { id }
    })

    if (!event) {
      await createLog('warn', 'Event not found for status update', {
        source: 'updateEventStatus',
        eventId: id
      })
      return { success: false, error: 'Event not found', status: 404 }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { status }
    })

    await createLog('info', 'Event status updated successfully', {
      eventId: updatedEvent.id,
      eventTitle: updatedEvent.title,
      previousStatus: event.status,
      newStatus: updatedEvent.status
    })

    revalidatePath('/', 'layout')

    return { success: true, event: updatedEvent }
  } catch (error) {
    await createLog('error', 'Failed to update event status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      eventId: id
    })

    return {
      success: false,
      error: 'Failed to update event status. Please try again.'
    }
  }
}
