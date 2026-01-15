'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteEventTicket(id: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!ticket) {
      await createLog('warn', 'Event ticket not found for deletion', {
        ticketId: id
      })
      return { success: false, error: 'Event ticket not found', status: 404 }
    }

    await prisma.ticket.delete({
      where: { id }
    })

    await createLog('info', 'Event ticket deleted successfully', {
      eventTicketId: ticket.id,
      eventTicketName: ticket.name
    })

    revalidateTag('Event', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete event ticket', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ticketId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event ticket',
      status: 500
    }
  }
}
