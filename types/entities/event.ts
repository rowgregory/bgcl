import { ReactNode } from 'react'
import { IOrder } from './order'
import { ITicket } from './ticket'
import { IUser } from './user'

export type EventType = 'IN_PERSON' | 'VIRTUAL' | 'HYBRID'
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED' | 'ARCHIVED'

export interface IEvent {
  id: string
  createdAt: Date
  updatedAt: Date

  // Classification
  type: EventType
  status: EventStatus
  category: string
  featured: boolean
  isPublic: boolean

  // Details
  title: string
  description?: string | null
  host?: string | null
  dresscode?: string | null
  requirements?: string | null
  materials?: string | null

  // Scheduling
  date: Date
  duration: string
  order: number

  // Location / access
  location: string
  meetingUrl?: string | null
  registrationUrl?: string | null

  // Capacity
  capacity: number
  maxAttendees?: number | null
  attendeeCount: number

  // RSVP
  registrationDeadline: Date

  // Ticketing
  salesStartDate?: Date | null
  salesEndDate?: Date | null

  // Raffle
  isRaffle: boolean
  raffleDrawDate?: Date | null
  raffleTerms?: string | null
  raffleTicketsPerOrder: number
  subtitle?: string | null
  tagline?: string | null
  address?: string | null
  website?: string | null
  missionStatement?: string | null
  raffleTicketPrice?: string | null
  raffleGrandPrizeLabel?: string | null
  raffleOddsLabel?: string | null
  rafflePrizes?: { place: string; amount: string }[] | null
  raffleSchedule?: { time: string; label: string }[] | null

  // Relations
  tickets?: ITicket[]
  orders?: IOrder[]
  attendees?: IUser[]

  // Add to interface
  ticketSalesStartDate?: Date | string | null
  ticketSalesEndDate?: Date | string | null
  dressCodeHeadline?: string | null
  dressCodeNote?: string | null
  bestDressedPrizes?: string | null
  dressCodeItems?: { label: string; description: string }[] | null

  showTicketMarquee?: boolean
  showRaffleTicketNumbers?: boolean
}

export type EventWithTickets = IEvent & {
  tickets: ITicket[]
}

export interface EventTemplate {
  id: string
  name: string
  icon: ReactNode
  description: string
  data: {
    title: string
    description: string
    category: string
    type: EventType
    dresscode: string
    date: string
    time: string
    duration: string
    location: string
    maxAttendees: string
    requirements: string
    materials: string
    isPublic: boolean

    // Raffle
    isRaffle: boolean
    raffleDrawDate: string | null
    raffleTerms: string | null
    raffleTicketsPerOrder: number
    subtitle: string | null
    tagline: string | null
    address: string | null
    website: string | null
    missionStatement: string | null
    registrationDeadline?: string
    raffleTicketPrice: string | null
    raffleGrandPrizeLabel: string | null
    raffleOddsLabel: string | null
    rafflePrizes: { place: string; amount: string }[] | null
    raffleSchedule: { time: string; label: string }[] | null

    // Add to interface
    ticketSalesStartDate?: Date | string | null
    ticketSalesEndDate?: Date | string | null
    dressCodeHeadline?: string | null
    dressCodeNote?: string | null
    bestDressedPrizes?: string | null
    dressCodeItems?: { label: string; description: string }[] | null

    showTicketMarquee?: boolean
    showRaffleTicketNumbers?: boolean
  }
}

export interface IUpcomingEvent {
  event: EventWithTickets
  index: number
}

export interface CreateEventInput {
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
  isPublic?: boolean
  requirements?: string | null
  materials?: string | null
  registrationUrl?: string | null
  meetingUrl?: string | null
  registrationDeadline?: string | null
  salesStartDate?: string | null
  salesEndDate?: string | null
  order?: number | null

  // Raffle
  isRaffle?: boolean
  raffleDrawDate?: string | null
  raffleTerms?: string | null
  raffleTicketsPerOrder?: number | null
  subtitle?: string | null
  tagline?: string | null
  address?: string | null
  website?: string | null
  missionStatement?: string | null
  raffleTicketPrice?: string | null
  raffleGrandPrizeLabel?: string | null
  raffleOddsLabel?: string | null
  rafflePrizes?: { place: string; amount: string }[] | null
  raffleSchedule?: { time: string; label: string }[] | null

  // Add to interface
  ticketSalesStartDate?: Date | string | null
  ticketSalesEndDate?: Date | string | null
  dressCodeHeadline?: string | null
  dressCodeNote?: string | null
  bestDressedPrizes?: string | null
  dressCodeItems?: { label: string; description: string }[] | null

  showTicketMarquee?: boolean
  showRaffleTicketNumbers?: boolean
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string
  isUpdating: boolean
  tickets: ITicket[]
}
