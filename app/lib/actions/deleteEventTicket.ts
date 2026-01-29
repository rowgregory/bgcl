'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteTicket(id: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!ticket) {
      await createLog('warn', 'Ticket not found for deletion', {
        ticketId: id
      })
      return { success: false, error: 'Ticket not found', status: 404 }
    }

    await prisma.ticket.delete({
      where: { id }
    })

    await createLog('info', 'Ticket deleted successfully', {
      ticketId: ticket.id,
      ticketName: ticket.name
    })

    revalidateTag('Event', 'default')
    revalidateTag('Ticket', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete ticket', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ticketId: id
    })

    return {
      success: false,
      error: 'Failed to delete ticket. Please try again.'
    }
  }
}
