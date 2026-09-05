'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { serialize } from '@/lib/utils/serializers.utils'

export async function getActiveEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { not: 'ARCHIVED' },
        isPublic: true
      },
      include: {
        // Unpublished tickets are not for sale, so they never reach the client
        tickets: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    return { success: true, data: serialize(events), error: null }
  } catch (error) {
    await createLog('error', 'Error fetching active events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Could not load active events', data: null }
  }
}
