'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { ticketSchema } from '@/lib/validations/ticket.validation'

export async function updateTicket(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Ticket ID is required.' }
  }

  const parsed = ticketSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid ticket data'
    }
  }

  const data = parsed.data

  try {
    const existingTicket = await prisma.ticket.findUnique({ where: { id } })

    if (!existingTicket) {
      await createLog('warn', 'Ticket not found for update', { ticketId: id })
      return { success: false, error: 'Ticket not found', status: 404 }
    }

    // `sortOrder`, `quantitySold`, and `quantityReserved` are managed elsewhere
    // and deliberately left untouched.
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...data,
        description: data.description || null,
        sponsorImpact: data.sponsorImpact || null
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Ticket updated successfully', {
      ticketId: ticket.id,
      ticketName: ticket.name
    })

    return { success: true, data: ticket }
  } catch (error) {
    await createLog('error', 'Failed to update ticket', {
      ticketId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update ticket. Please try again.'
    }
  }
}
