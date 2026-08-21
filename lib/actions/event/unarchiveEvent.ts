'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function unarchiveEvent(eventId: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'COMPLETED' }
    })

    revalidatePath('/', 'layout')

    return { success: true, data: event, error: null }
  } catch (error) {
    await createLog('error', 'Error unarchiving event', {
      eventId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not unarchive event' }
  }
}
