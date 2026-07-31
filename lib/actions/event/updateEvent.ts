'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { UpdateEventInput } from '@/types/entities/event'
import { revalidatePath } from 'next/cache'

export async function updateEvent(body: UpdateEventInput) {
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: body.id }
    })

    if (!existingEvent) {
      await createLog('warn', 'Event not found for update', {
        source: 'updateEvent',
        eventId: body.id
      })
      return { success: false, error: 'Event not found', status: 404 }
    }

    const {
      date,
      time,
      registrationDeadline,
      ticketSalesStartDate,
      ticketSalesEndDate,
      isUpdating,
      tickets,
      ...restBody
    } = body

    const event = await prisma.event.update({
      where: { id: body.id },
      data: {
        ...restBody,
        date: date ? new Date(date) : undefined,
        maxAttendees: body.maxAttendees ? Number(body.maxAttendees) : undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        ticketSalesStartDate: ticketSalesStartDate ? new Date(ticketSalesStartDate) : null,
        ticketSalesEndDate: ticketSalesEndDate ? new Date(ticketSalesEndDate) : null
      },
      include: {
        tickets: true,
        orders: true
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Event updated successfully', {
      eventId: event.id,
      eventTitle: event.title,
      updatedFields: Object.keys(body)
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update event', {
      error: error instanceof Error ? error.message : 'Failed to update event',
      inputData: {
        eventId: body.id,
        title: body.title,
        type: body.type,
        category: body.category
      }
    })

    return { success: false, error: 'Failed to update event. Please try again.' }
  }
}
