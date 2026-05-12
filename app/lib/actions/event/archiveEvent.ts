'use server'

import prisma from '@/prisma/client'
import { createLog } from '../createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'

export async function archiveEvent(eventId: string) {
  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'ARCHIVED' }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('archived an event', actor, context)

    await createLog('info', message, {
      eventId: event.id,
      eventName: event.title,
      ...context
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
