import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'
import { serialize } from '@/lib/utils/serializers.utils'

export async function getEventsManifest() {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    // Confirmed only. A declined or refunded order is not a seat to set, so it
    // has no place on a manifest. The transactions page is where those live.
    const orders = await prisma.order.findMany({
      where: { type: 'TICKET_PURCHASE', status: 'CONFIRMED' },
      select: {
        id: true,
        createdAt: true,
        customerName: true,
        customerEmail: true,
        attendingEvent: true,
        eventId: true,
        event: { select: { id: true, title: true, date: true } },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            ticket: {
              select: {
                name: true,
                guestCount: true,
                event: { select: { id: true, title: true, date: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: serialize(orders), error: null }
  } catch (error) {
    await createLog('error', 'Error fetching events manifest', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load the manifest.' }
  }
}
