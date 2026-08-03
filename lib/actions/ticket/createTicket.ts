'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { ticketSchema } from '@/lib/validations/ticket.validation'

export async function createTicket(eventId: string, input: unknown) {
  if (!eventId) {
    return { success: false, error: 'Event ID is required.' }
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
    const event = await prisma.event.findUnique({ where: { id: eventId } })

    if (!event) {
      await createLog('warn', 'Event not found for ticket creation', { eventId })
      return { success: false, error: 'Event not found', status: 404 }
    }

    // Place new tickets at the end of this event's list
    const lastTicket = await prisma.ticket.findFirst({
      where: { eventId },
      orderBy: { sortOrder: 'desc' }
    })

    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        description: data.description || null,
        sponsorImpact: data.sponsorImpact || null,
        sortOrder: (lastTicket?.sortOrder ?? -1) + 1,
        event: { connect: { id: eventId } }
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Ticket created successfully', {
      ticketId: ticket.id,
      ticketName: ticket.name,
      eventId
    })

    return { success: true, data: ticket }
  } catch (error) {
    await createLog('error', 'Failed to create ticket', {
      eventId,
      error: error instanceof Error ? error.message : 'Unknown error',
      name: data.name
    })

    return {
      success: false,
      error: 'Failed to create ticket. Please try again.'
    }
  }
}
