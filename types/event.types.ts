import type { ReactNode } from 'react'
import type { Event, Ticket, Order, User, EventType, EventStatus } from '@prisma/client'
import type { EventFormInput, RafflePrize, RaffleScheduleItem, DressCodeItem } from '@/lib/validations/event.validation'

// Prisma owns the enums — re-exported so call sites have one import
export type { EventType, EventStatus }

// ─────────────────────────────────────────────────────────────────────────────
// Event records
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An Event with its JSON columns typed. Prisma types those as JsonValue, so
 * they're overridden here with the shapes the Zod schema defines.
 */
export type EventRecord = Omit<Event, 'rafflePrizes' | 'raffleSchedule' | 'dressCodeItems'> & {
  rafflePrizes: RafflePrize[] | null
  raffleSchedule: RaffleScheduleItem[] | null
  dressCodeItems: DressCodeItem[] | null
}

export type EventWithTickets = EventRecord & {
  tickets: Ticket[]
}

export type EventWithRelations = EventRecord & {
  tickets: Ticket[]
  orders: Order[]
  attendees: User[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Serialized shapes (server → client boundary)
// Dates become strings when passed from a server component to a client one.
// ─────────────────────────────────────────────────────────────────────────────

type DateKeys =
  | 'date'
  | 'createdAt'
  | 'updatedAt'
  | 'raffleDrawDate'
  | 'registrationDeadline'
  | 'rsvpDeadline'
  | 'salesStartDate'
  | 'salesEndDate'
  | 'ticketSalesStartDate'
  | 'ticketSalesEndDate'

export type SerializedTicket = Omit<Ticket, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export type SerializedEvent = Omit<EventRecord, DateKeys> & {
  date: string
  createdAt: string
  updatedAt: string
  raffleDrawDate: string | null
  registrationDeadline: string | null
  rsvpDeadline: string | null
  salesStartDate: string | null
  salesEndDate: string | null
  ticketSalesStartDate: string | null
  ticketSalesEndDate: string | null
  tickets: SerializedTicket[]
}

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

/** A preset that pre-fills the event form. */
export interface EventTemplate {
  id: string
  name: string
  icon: ReactNode
  description: string
  data: Partial<EventFormInput>
}

export interface IUpcomingEvent {
  event: EventWithTickets
  index: number
}

export type LocalTicket = Partial<SerializedTicket> & {
  _tempId?: string
  _isNew: boolean
  _isDirty: boolean
  _expanded: boolean
}
