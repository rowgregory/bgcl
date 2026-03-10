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
  requiresRSVP: boolean
  registrationDeadline: Date
  rsvpDeadline: Date

  // Ticketing
  allowMultipleTickets: boolean
  salesStartDate?: Date | null
  salesEndDate?: Date | null

  // Relations
  tickets?: ITicket[]
  orders?: IOrder[]
  attendees?: IUser[]
}

export type EventWithTickets = Event & {
  tickets: ITicket[]
  _count?: {
    rsvps: number
  }
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
    time: string
    duration: string
    location: string
    maxAttendees: string
    requirements: string
    materials: string
    isPublic: boolean
    requiresRSVP: boolean
    allowMultipleTickets: boolean
  }
}

export interface IUpcomingEvent {
  event: EventWithTickets
  index: number
}
