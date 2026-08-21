'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteTicket(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    revalidatePath('/', 'layout')

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
