// types/event.ts
import { Ticket, Order, User } from '@prisma/client'
import { ReactNode } from 'react'

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED'
}

export enum EventType {
  IN_PERSON = 'IN_PERSON',
  VIRTUAL = 'VIRTUAL',
  HYBRID = 'HYBRID'
}

export interface Event {
  id: string
  createdAt: Date
  updatedAt: Date
  type: EventType[0]
  status: EventStatus
  title: string
  description: string | null
  category: string
  capacity: number
  attendeeCount: number
  dresscode: string | null
  date: Date
  time: string
  duration: string
  location: string
  maxAttendees: number | null
  featured: boolean
  host: string | null
  requirements: string | null
  materials: string | null
  registrationUrl: string | null
  meetingUrl: string | null
  isPublic: boolean
  requiresRSVP: boolean
  registrationDeadline: Date
  rsvpDeadline: Date
  allowMultipleTickets: boolean

  // Make these optional
  tickets?: Ticket[]
  orders?: Order[]
  attendees?: User[]
}

// Event with tickets
export type EventWithTickets = Event & {
  tickets: Ticket[]
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
