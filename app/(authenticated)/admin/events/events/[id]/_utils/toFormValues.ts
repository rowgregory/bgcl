import { EMPTY_EVENT, EventFormInput } from '@/lib/validations/event.validation'
import { SerializedEvent } from '@/types/event.types'

interface Props {
  event: SerializedEvent | null
  isNew: boolean
}

const toDateTimeInput = (d?: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 16) : '')
const toDateInput = (d?: Date | string | null) => (d ? new Date(d).toISOString().slice(0, 10) : '')

export function toFormValues(event: Props['event']): EventFormInput {
  if (!event) return EMPTY_EVENT as EventFormInput

  return {
    // Core
    title: event.title,
    description: event.description ?? '',
    category: event.category,
    type: event.type,
    status: event.status,

    // Scheduling
    date: toDateTimeInput(event.date),
    duration: event.duration,
    ticketSalesStartDate: toDateTimeInput(event.ticketSalesStartDate),
    ticketSalesEndDate: toDateTimeInput(event.ticketSalesEndDate),
    salesStartDate: toDateTimeInput(event.salesStartDate),
    salesEndDate: toDateTimeInput(event.salesEndDate),
    registrationDeadline: toDateTimeInput(event.registrationDeadline),
    rsvpDeadline: toDateInput(event.rsvpDeadline),

    // Location
    location: event.location,
    address: event.address ?? '',

    // Capacity
    capacity: event.capacity,
    maxAttendees: event.maxAttendees || null,

    // Details
    host: event.host ?? '',
    tagline: event.tagline ?? '',
    subtitle: event.subtitle ?? '',
    missionStatement: event.missionStatement ?? '',
    website: event.website ?? '',
    requirements: event.requirements ?? '',
    materials: event.materials ?? '',
    registrationUrl: event.registrationUrl ?? '',
    meetingUrl: event.meetingUrl ?? '',

    // Flags
    isPublic: event.isPublic,
    requiresRSVP: event.requiresRSVP,
    allowMultipleTickets: event.allowMultipleTickets,
    showTicketMarquee: event.showTicketMarquee,

    // Dress code
    dresscode: event.dresscode ?? '',
    dressCodeHeadline: event.dressCodeHeadline ?? '',
    dressCodeNote: event.dressCodeNote ?? '',
    bestDressedPrizes: event.bestDressedPrizes ?? '',
    dressCodeItems: event.dressCodeItems ?? [],

    // Raffle
    isRaffle: event.isRaffle,
    raffleDrawDate: toDateTimeInput(event.raffleDrawDate),
    raffleTerms: event.raffleTerms ?? '',
    raffleTicketsPerOrder: event.raffleTicketsPerOrder,
    raffleGrandPrizeLabel: event.raffleGrandPrizeLabel ?? '',
    raffleOddsLabel: event.raffleOddsLabel ?? '',
    raffleTicketPrice: event.raffleTicketPrice ?? '',
    rafflePrizes: event.rafflePrizes ?? [],
    raffleSchedule: event.raffleSchedule ?? [],
    showRaffleTicketNumbers: event.showRaffleTicketNumbers
  }
}
