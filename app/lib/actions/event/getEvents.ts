'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { NOT: { status: 'ARCHIVED' } },
      include: { tickets: true },
      orderBy: { order: 'asc' }
    })

    return {
      success: true,
      data: JSON.parse(
        JSON.stringify(events, (_, value) => (value?.constructor?.name === 'Decimal' ? Number(value) : value))
      )
    }
  } catch (error) {
    await createLog('error', 'Error fetching events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to fetch events' }
  }
}
