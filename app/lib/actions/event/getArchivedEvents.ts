import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { ArchivedEvent } from '@/app/components/pages/CapsuleArchiveClient'

export async function getArchivedEvents() {
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

    return events.map((event) => ({
      ...event,
      rafflePrizes: (event.rafflePrizes as { place: string; amount: string }[] | null) ?? [],
      raffleSchedule: (event.raffleSchedule as { time: string; label: string }[] | null) ?? [],
      dressCodeItems: (event.dressCodeItems as { label: string; description: string }[] | null) ?? []
    })) as ArchivedEvent[]
  } catch (error) {
    await createLog('error', 'Error fetching archived events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
