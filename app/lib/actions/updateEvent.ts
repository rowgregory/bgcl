'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { convertDateToUTC } from '../utils/date-utils'
import { UpdateEventInput } from '@/types/entities/event'

export async function updateEvent(body: UpdateEventInput) {
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: body.id }
    })

    if (!existingEvent) {
      await createLog('warn', 'Event not found for update', {
        eventId: body.id
      })
      return { success: false, error: 'Event not found', status: 404 }
    }

    // Remove fields that shouldn't be updated
    delete body.status
    delete body.attendeeCount
    delete body.attendees
    delete body.isUpdating
    delete body.createdAt
    delete body.updatedAt
    delete body.tickets

    const { date, time, registrationDeadline, rsvpDeadline, ...restBody } = body

    const registrationDeadlineDate = registrationDeadline ? convertDateToUTC(registrationDeadline) : undefined
    const rsvpDeadlineDate = rsvpDeadline ? convertDateToUTC(rsvpDeadline) : undefined

    const event = await prisma.event.update({
      where: { id: body.id },
      data: {
        ...restBody,
        date: date ? new Date(date) : undefined,
        maxAttendees: body.maxAttendees ? Number(body.maxAttendees) : undefined,
        registrationDeadline: registrationDeadlineDate,
        rsvpDeadline: rsvpDeadlineDate
      },
      include: {
        tickets: true,
        orders: true
      }
    })

    await createLog('info', 'Event updated successfully', {
      eventId: event.id,
      eventTitle: event.title,
      updatedFields: Object.keys(body)
    })

    return { success: true, event }
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

    return {
      success: false,
      error: 'Failed to update event. Please try again.'
    }
  }
}
