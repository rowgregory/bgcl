'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import { eventSchema } from '@/lib/validations/event.validation'
import { emptyToNull } from '@/lib/utils/emptyToNull'
import { requireAdmin } from '@/lib/utils/requireAdmin'

const toDate = (v: string | null | undefined) => (v ? new Date(v) : null)

export async function createEvent(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = eventSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      data: null,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid event data'
    }
  }

  const v = parsed.data

  try {
    // Place new events at the end of the list
    const lastEvent = await prisma.event.findFirst({ orderBy: { order: 'desc' } })

    const NULLABLE_FIELDS = [
      'description',
      'host',
      'dresscode',
      'requirements',
      'materials',
      'meetingUrl',
      'registrationUrl',
      'raffleTerms',
      'raffleTicketPrice',
      'raffleGrandPrizeLabel',
      'raffleOddsLabel',
      'subtitle',
      'tagline',
      'address',
      'website',
      'missionStatement',
      'dressCodeHeadline',
      'dressCodeNote',
      'bestDressedPrizes'
    ] as const

    const event = await prisma.event.create({
      data: {
        ...emptyToNull(v, NULLABLE_FIELDS),

        order: (lastEvent?.order ?? -1) + 1,

        // Dates
        date: new Date(v.date),
        registrationDeadline: toDate(v.registrationDeadline) ?? new Date(),
        rsvpDeadline: toDate(v.rsvpDeadline) ?? new Date(),
        salesStartDate: toDate(v.salesStartDate),
        salesEndDate: toDate(v.salesEndDate),
        ticketSalesStartDate: toDate(v.ticketSalesStartDate),
        ticketSalesEndDate: toDate(v.ticketSalesEndDate),
        raffleDrawDate: toDate(v.raffleDrawDate),
        maxAttendees: v.maxAttendees || null
      }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'Event created successfully', {
      eventId: event.id,
      title: event.title,
      type: event.type
    })

    return { success: true, data: { id: event.id }, error: null }
  } catch (error) {
    await createLog('error', 'Failed to create event', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: v.title
    })

    return {
      success: false,
      data: null,
      error: 'Could not create event'
    }
  }
}
