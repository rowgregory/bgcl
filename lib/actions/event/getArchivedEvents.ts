import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { ArchivedEvent } from '@/app/(authenticated)/admin/events/archive/EventsArchiveClient'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function getArchivedEvents() {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const events = await prisma.event.findMany({
      where: { status: 'ARCHIVED' },
      include: {
        orders: {
          where: { status: 'CONFIRMED', type: 'TICKET_PURCHASE' },
          select: {
            totalAmount: true,
            orderItems: { select: { quantity: true } }
          }
        },
        _count: { select: { attendees: true } }
      },
      orderBy: { date: 'desc' }
    })

    const serializedEvents = events.map((event) => ({
      ...event,
      rafflePrizes: (event.rafflePrizes as { place: string; amount: string }[] | null) ?? [],
      raffleSchedule: (event.raffleSchedule as { time: string; label: string }[] | null) ?? [],
      dressCodeItems: (event.dressCodeItems as { label: string; description: string }[] | null) ?? []
    })) as ArchivedEvent[]

    return { success: true, data: serializedEvents, error: null }
  } catch (error) {
    await createLog('error', 'Error fetching archived events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, errror: 'Could not load archived events' }
  }
}
