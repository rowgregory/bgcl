'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { EventType } from '@prisma/client'
import { CreateEventInput } from '@/types/entities/event'

export async function createEvent(data: CreateEventInput) {
  try {
    const eventType =
      data.type && Object.values(EventType).includes(data.type as EventType) ? (data.type as EventType) : 'IN_PERSON'

    const event = await prisma.event.create({
      data: {
        title: data.title || 'Untitled Event',
        description: data.description || null,
        category: data.category || 'Other',
        type: eventType,
        dresscode: data.dresscode || null,
        date: data.date ? new Date(data.date) : new Date(),
        duration: data.duration || '',
        location: data.location || '',
        maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : null,
        host: data.host || null,
        requirements: data.requirements || null,
        materials: data.materials || null,
        registrationUrl: data.registrationUrl || null,
        meetingUrl: data.meetingUrl || null,
        isPublic: data.isPublic ?? true,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : new Date(),
        capacity: data.capacity ? Number(data.capacity) : 200,
        order: data.order ?? 0,

        // Raffle
        isRaffle: data.isRaffle ?? false,
        raffleDrawDate: data.raffleDrawDate ? new Date(data.raffleDrawDate) : null,
        raffleTerms: data.raffleTerms || null,
        raffleTicketsPerOrder: data.raffleTicketsPerOrder ? Number(data.raffleTicketsPerOrder) : 1,
        subtitle: data.subtitle || null,
        tagline: data.tagline || null,
        address: data.address || null,
        website: data.website || null,
        missionStatement: data.missionStatement || null,
        raffleTicketPrice: data.raffleTicketPrice || null,
        raffleGrandPrizeLabel: data.raffleGrandPrizeLabel || null,
        raffleOddsLabel: data.raffleOddsLabel || null,
        rafflePrizes: data.rafflePrizes ?? undefined,
        raffleSchedule: data.raffleSchedule ?? undefined,

        ticketSalesStartDate: data.ticketSalesStartDate ? new Date(data.ticketSalesStartDate) : null,
        ticketSalesEndDate: data.ticketSalesEndDate ? new Date(data.ticketSalesEndDate) : null,
        dressCodeHeadline: data.dressCodeHeadline || null,
        dressCodeNote: data.dressCodeNote || null,
        bestDressedPrizes: data.bestDressedPrizes || null,
        dressCodeItems: data.dressCodeItems?.length ? data.dressCodeItems : undefined,

        showTicketMarquee: data.showTicketMarquee,
        showRaffleTicketNumbers: data.showRaffleTicketNumbers
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
