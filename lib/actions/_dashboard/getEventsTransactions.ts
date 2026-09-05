import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'
import { serialize } from '@/lib/utils/serializers.utils'

export async function getEventsTransactions() {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  try {
    // Every ticket order, whatever its status. This is the transaction log, so
    // failed and refunded rows belong here.
    const orders = await prisma.order.findMany({
      where: { type: 'TICKET_PURCHASE' },
      include: {
        campaign: true,
        event: true,
        orderItems: {
          include: {
            ticket: { include: { event: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: serialize(orders), error: null }
  } catch (error) {
    await createLog('error', 'Error fetching events transactions', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load event transactions.' }
  }
}
