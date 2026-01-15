'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

interface CreateTicketData {
  name: string
  description?: string
  price: number
  totalQuantity: number
  isAvailable?: boolean
  sortOrder?: number
}

export async function createTicket(eventId: string, body: CreateTicketData) {
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
        name: body.name,
        description: body.description,
        price: Number(body.price),
        totalQuantity: Number(body.totalQuantity),
        isAvailable: body.isAvailable ?? true,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
        event: {
          connect: { id: eventId }
        }
      }
    })

    await createLog('info', 'Ticket created successfully', {
      ticketId: ticket.id,
      ticketName: ticket.name
    })

    revalidateTag('Event', 'default')

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event ticket'

    await createLog('error', 'Failed to create event ticket', {
      error: errorMessage,
      inputData: {
        name: body.name,
        price: body.price
      }
    })

    throw new Error(errorMessage)
  }
}
