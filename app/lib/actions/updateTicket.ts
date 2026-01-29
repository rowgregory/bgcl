'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

interface UpdateTicketData {
  name?: string
  description?: string
  price?: number
  totalQuantity?: number
  isAvailable?: boolean
  sortOrder?: number
  [key: string]: any
}

export async function updateTicket(id: string, body: UpdateTicketData) {
  try {
    const existingEventTicket = await prisma.ticket.findUnique({
      where: { id }
    })

    if (!existingEventTicket) {
      await createLog('warn', 'Event ticket not found for update', {
        ticketId: id
      })
      return { success: false, error: 'Event ticket not found', status: 404 }
    }

    const { totalQuantity, price, sortOrder, ...rest } = body

    const totalQuantityNumber = Number(body.totalQuantity)
    const priceNumber = Number(body.price)
    const sortOrderNumber = Number(body.sortOrder)

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        totalQuantity: totalQuantityNumber,
        price: priceNumber,
        sortOrder: sortOrderNumber,
        ...rest
      }
    })

    await createLog('info', 'Event ticket updated successfully', {
      ticketId: ticket.id,
      ticketName: ticket.name,
      updatedFields: Object.keys(body)
    })

    revalidateTag('Event', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update event ticket', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ticketId: id
    })

    return {
      success: false,
      error: 'Failed to update ticket. Please try again.'
    }
  }
}
