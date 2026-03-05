'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function reorderEvents(
  events: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const eventsData = await Promise.all(
      events.map((event, index) =>
        prisma.event.update({
          where: { id: event.id },
          data: { order: index + 1 }
        })
      )
    )

    console.log(
      'events data: ',
      eventsData.map((event) => ({ order: event.order, title: event.title }))
    )

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder events. Please try again.' }
  }
}
