'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { combineDateTimeToUTC } from '../utils/date-utils'
import { EventType } from '@prisma/client'

interface CreateEventData {
  title?: string
  category?: string
  type?: EventType
  date?: string | Date
  time?: string
  duration?: string
  location?: string

  description?: string
  capacity?: number
  dresscode?: string | null
  maxAttendees?: number | null
  host?: string | null

  featured?: boolean
  isPublic?: boolean
  requiresRSVP?: boolean
  allowMultipleTickets?: boolean

  requirements?: string | null
  materials?: string | null
  registrationUrl?: string | null
  meetingUrl?: string | null
  registrationDeadline?: string | null
  rsvpDeadline?: string | null

  salesStartDate?: string | null
  salesEndDate?: string | null

  [key: string]: any
}

export async function createEvent(data: CreateEventData) {
  try {
    const fullDateTime =
      data.date && data.time ? combineDateTimeToUTC(data.date as string, data.time as string) : undefined

    // Ensure type is a valid EventType enum
    const eventType =
      data.type && Object.values(EventType).includes(data.type as EventType) ? (data.type as EventType) : 'IN_PERSON'

    const event = await prisma.event.create({
      data: {
        title: data.title || 'Untitled Event',
        description: data.description || null,
        category: data.category || 'Other',
        type: eventType,
        dresscode: data.dresscode || null,
        date: fullDateTime || new Date(),
        duration: data.duration || '',
        location: data.location || '',
        maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : null,
        featured: data.featured ?? false,
        host: data.host || null,
        requirements: data.requirements || null,
        materials: data.materials || null,
        registrationUrl: data.registrationUrl || null,
        meetingUrl: data.meetingUrl || null,
        isPublic: data.isPublic ?? true,
        requiresRSVP: data.requiresRSVP ?? false,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : new Date(),
        rsvpDeadline: data.rsvpDeadline ? new Date(data.rsvpDeadline) : new Date(),
        allowMultipleTickets: data.allowMultipleTickets ?? false,
        capacity: data.capacity ? Number(data.capacity) : 200
      }
    })

    await createLog('info', 'Event created successfully', {
      eventId: event.id,
      title: event.title,
      type: event.type
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create event. Please try again.'
    }
  }
}
