'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { combineDateTimeToUTC, convertDateToUTC } from '../utils/date-utils'
import { EventType } from '@prisma/client'

interface UpdateEventData {
  id?: string
  title?: string
  description?: string
  category?: string
  type?: EventType
  date?: string | Date
  time?: string
  duration?: string
  location?: string
  featured?: boolean
  isPublic?: boolean
  requiresRSVP?: boolean
  [key: string]: any // Catch everything else
}

export async function updateEvent(id: string, body: UpdateEventData) {
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      await createLog('warn', 'Event not found for update', {
        eventId: id
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

    const fullDateTime = date && time ? combineDateTimeToUTC(date as string, time as string) : undefined
    const registrationDeadlineDate = registrationDeadline ? convertDateToUTC(registrationDeadline) : undefined
    const rsvpDeadlineDate = rsvpDeadline ? convertDateToUTC(rsvpDeadline) : undefined

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...restBody,
        date: fullDateTime,
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

    revalidateTag('Event', 'default')

    return { success: true, event }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update event'

    await createLog('error', 'Failed to update event', {
      error: errorMessage,
      inputData: {
        eventId: body.id,
        title: body.title,
        type: body.type,
        category: body.category
      }
    })

    throw new Error(errorMessage)
  }
}
