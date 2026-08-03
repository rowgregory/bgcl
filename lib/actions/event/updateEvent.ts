'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { eventSchema } from '@/lib/validations/event.validation'

const toDate = (v: string | null | undefined) => (v ? new Date(v) : null)

export async function updateEvent(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Event ID is required.' }
  }

  const parsed = eventSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid event data'
    }
  }

  const v = parsed.data

  try {
    const existingEvent = await prisma.event.findUnique({ where: { id } })

    if (!existingEvent) {
      await createLog('warn', 'Event not found for update', {
        source: 'updateEvent',
        eventId: id
      })
      return { success: false, error: 'Event not found', status: 404 }
    }

    // `order`, `attendeeCount`, and `guestCount` are managed elsewhere and
    // deliberately left untouched.
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...v,
        date: new Date(v.date),
        registrationDeadline: toDate(v.registrationDeadline) ?? existingEvent.registrationDeadline,
        rsvpDeadline: toDate(v.rsvpDeadline) ?? existingEvent.rsvpDeadline,
        salesStartDate: toDate(v.salesStartDate),
        salesEndDate: toDate(v.salesEndDate),
        ticketSalesStartDate: toDate(v.ticketSalesStartDate),
        ticketSalesEndDate: toDate(v.ticketSalesEndDate),
        raffleDrawDate: toDate(v.raffleDrawDate),
        maxAttendees: v.maxAttendees || null,
        description: v.description || null,
        host: v.host || null,
        dresscode: v.dresscode || null,
        requirements: v.requirements || null,
        materials: v.materials || null,
        meetingUrl: v.meetingUrl || null,
        registrationUrl: v.registrationUrl || null,
        raffleTerms: v.raffleTerms || null,
        raffleTicketPrice: v.raffleTicketPrice || null,
        raffleGrandPrizeLabel: v.raffleGrandPrizeLabel || null,
        raffleOddsLabel: v.raffleOddsLabel || null,
        subtitle: v.subtitle || null,
        tagline: v.tagline || null,
        address: v.address || null,
        website: v.website || null,
        missionStatement: v.missionStatement || null,
        dressCodeHeadline: v.dressCodeHeadline || null,
        dressCodeNote: v.dressCodeNote || null,
        bestDressedPrizes: v.bestDressedPrizes || null
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Event updated successfully', {
      eventId: event.id,
      eventTitle: event.title
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update event', {
      eventId: id,
      error: error instanceof Error ? error.message : 'Failed to update event'
    })

    return { success: false, error: 'Failed to update event. Please try again.' }
  }
}
