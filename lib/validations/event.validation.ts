import { z } from 'zod'
import { EventType, EventStatus } from '@prisma/client'

// ── JSON column shapes ────────────────────────────────────────────────────────

export const rafflePrizeSchema = z.object({
  place: z.string().trim().min(1, { error: 'Place is required' }),
  amount: z.string().trim().min(1, { error: 'Amount is required' })
})

export const raffleScheduleItemSchema = z.object({
  time: z.string().trim().min(1, { error: 'Time is required' }),
  label: z.string().trim().min(1, { error: 'Label is required' })
})

export const dressCodeItemSchema = z.object({
  label: z.string().trim().min(1, { error: 'Label is required' }),
  description: z.string().trim()
})

// ── Event ─────────────────────────────────────────────────────────────────────
// Dates are strings here (what date/datetime-local inputs produce); the server
// action converts them to Date before hitting Prisma.

export const eventSchema = z.object({
  // Classification
  type: z.enum(EventType).default('IN_PERSON'),
  status: z.enum(EventStatus).default('UPCOMING'),
  category: z.string().trim().min(1, { error: 'Please enter a category' }),
  isPublic: z.boolean().default(true),

  // Details
  title: z.string().trim().min(1, { error: 'Please enter a title' }),
  description: z.string().trim().nullish(),
  host: z.string().trim().nullish(),
  dresscode: z.string().trim().nullish(),
  requirements: z.string().trim().nullish(),
  materials: z.string().trim().nullish(),

  // Scheduling
  date: z.string().trim().min(1, { error: 'Please enter a date' }),
  duration: z.string().trim().min(1, { error: 'Please enter a duration' }),

  // Location / access
  location: z.string().trim().min(1, { error: 'Please enter a location' }),
  meetingUrl: z.string().trim().nullish(),
  registrationUrl: z.string().trim().nullish(),

  // Capacity
  capacity: z.coerce.number().int().gt(0, { error: 'Capacity must be greater than 0' }).default(200),
  maxAttendees: z.union([z.literal(''), z.coerce.number().int().gte(0)]).nullish(),

  // RSVP
  requiresRSVP: z.boolean().default(false),
  registrationDeadline: z.string().trim().nullish(),
  rsvpDeadline: z.string().trim().nullish(),

  // Ticketing
  allowMultipleTickets: z.boolean().default(false),
  salesStartDate: z.string().trim().nullish(),
  salesEndDate: z.string().trim().nullish(),
  ticketSalesStartDate: z.string().trim().nullish(),
  ticketSalesEndDate: z.string().trim().nullish(),

  // Raffle
  isRaffle: z.boolean().default(false),
  raffleDrawDate: z.string().trim().nullish(),
  raffleTerms: z.string().trim().nullish(),
  raffleTicketsPerOrder: z.coerce.number().int().gt(0).default(1),
  raffleTicketPrice: z.string().trim().nullish(),
  raffleGrandPrizeLabel: z.string().trim().nullish(),
  raffleOddsLabel: z.string().trim().nullish(),
  rafflePrizes: z.array(rafflePrizeSchema).default([]),
  raffleSchedule: z.array(raffleScheduleItemSchema).default([]),

  // Marketing / display copy
  subtitle: z.string().trim().nullish(),
  tagline: z.string().trim().nullish(),
  address: z.string().trim().nullish(),
  website: z.string().trim().nullish(),
  missionStatement: z.string().trim().nullish(),

  // Dress code block
  dressCodeHeadline: z.string().trim().nullish(),
  dressCodeItems: z.array(dressCodeItemSchema).default([]),
  dressCodeNote: z.string().trim().nullish(),
  bestDressedPrizes: z.string().trim().nullish(),

  // Display toggles
  showTicketMarquee: z.boolean().default(true),
  showRaffleTicketNumbers: z.boolean().default(false)
})

export type EventFormInput = z.input<typeof eventSchema>
export type EventFormValues = z.output<typeof eventSchema>

export type RafflePrize = z.infer<typeof rafflePrizeSchema>
export type RaffleScheduleItem = z.infer<typeof raffleScheduleItemSchema>
export type DressCodeItem = z.infer<typeof dressCodeItemSchema>

export const EMPTY_EVENT: EventFormInput = {
  // Core
  title: '',
  description: '',
  category: 'Fundraiser',
  type: 'IN_PERSON',
  status: 'UPCOMING',

  // Scheduling
  date: '',
  duration: '',
  ticketSalesStartDate: '',
  ticketSalesEndDate: '',
  salesStartDate: '',
  salesEndDate: '',
  registrationDeadline: '',
  rsvpDeadline: '',

  // Location
  location: '',
  address: '',

  // Capacity
  capacity: 200,
  maxAttendees: undefined,

  // Details
  host: '',
  tagline: '',
  subtitle: '',
  missionStatement: '',
  website: '',
  requirements: '',
  materials: '',
  registrationUrl: '',
  meetingUrl: '',

  // Flags
  isPublic: true,
  requiresRSVP: false,
  allowMultipleTickets: false,
  showTicketMarquee: true,

  // Dress code
  dresscode: '',
  dressCodeHeadline: '',
  dressCodeNote: '',
  bestDressedPrizes: '',
  dressCodeItems: [],

  // Raffle
  isRaffle: false,
  raffleDrawDate: '',
  raffleTerms: '',
  raffleTicketsPerOrder: 1,
  raffleGrandPrizeLabel: '',
  raffleOddsLabel: '',
  raffleTicketPrice: '',
  rafflePrizes: [],
  raffleSchedule: [],
  showRaffleTicketNumbers: false
}
