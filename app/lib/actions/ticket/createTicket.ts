'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { CreateTicketInput } from '@/types/entities/ticket'
import { revalidatePath } from 'next/cache'

export async function createTicket(eventId: string, data: CreateTicketInput) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      await createLog('warn', 'Event not found for ticket creation', {
        eventId
      })
      return { success: false, error: 'Event not found', status: 404 }
    }

    const ticket = await prisma.ticket.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        totalQuantity: Number(data.totalQuantity),
        sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
        ticketType: data.ticketType,
        sponsorImpact: data.sponsorImpact,
        sponsorPerks: data.sponsorPerks,
        guestCount: data.guestCount,
        isPublished: data.isPublished,
        event: {
          connect: { id: eventId }
        }
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Ticket created successfully', {
      ticketId: ticket.id,
      ticketName: ticket.name
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create ticket', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: data.name
    })

    return {
      success: false,
      error: 'Failed to create ticket. Please try again.'
    }
  }
}
