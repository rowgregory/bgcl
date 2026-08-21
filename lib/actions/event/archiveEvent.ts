'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function archiveEvent(eventId: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    revalidatePath('/', 'layout')

    return { success: true, data: event, error: null }
  } catch (error) {
    await createLog('error', 'Error archiving event', {
      eventId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, dat: null, error: 'Failed to archive event' }
  }
}
