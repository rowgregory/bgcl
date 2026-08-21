'use'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getActiveEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { not: 'ARCHIVED' },
        isPublic: true
      },
      include: {
        tickets: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return { success: true, data: events, error: null }
  } catch (error) {
    await createLog('error', 'Error fetching active events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Could not load active events', data: null }
  }
}
