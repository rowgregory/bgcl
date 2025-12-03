// types/event.ts
import { Event, Ticket, Order, User } from '@prisma/client'
import { IForm } from '../common'
import { ReactNode } from 'react'

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED'
}

// Base Event interface (matches Prisma model exactly)
export type IEvent = Event

// Event with tickets
export interface EventWithTickets extends Event {
  tickets: Ticket[]
}

// Event with attendees
export interface EventWithAttendees extends Event {
  attendees: User[]
}

// Event with tickets and orders
export interface EventWithTicketsAndOrders extends Event {
  tickets: Ticket[]
  orders: Array<
    Order & {
      orderItems: Array<{
        id: string
        quantity: number
        pricePerUnit: number
        totalPrice: number
        ticketName: string
        ticketDescription: string | null
      }>
    }
  >
}

// Complete event with all relations
export interface EventWithAllRelations extends Event {
  tickets: Ticket[]
  orders: Array<
    Order & {
      orderItems: Array<{
        id: string
        quantity: number
        pricePerUnit: number
        totalPrice: number
        ticketName: string
        ticketDescription: string | null
      }>
    }
  >
}

// Create Event Input
export interface ICreateEvent {
  title: string
  description?: string
  category: string
  type: string
  dresscode?: string
  date: Date
  time: string
  duration: string
  location: string
  maxAttendees?: number
  status?: EventStatus
  featured?: boolean
  host?: string
  requirements?: string
  materials?: string
  registrationUrl?: string
  meetingUrl?: string
  isPublic?: boolean
  requiresRSVP?: boolean
  registrationDeadline?: Date
  allowMultipleTickets?: boolean
  salesStartDate?: Date
  salesEndDate?: Date
}

// Update Event Input
export interface IUpdateEvent {
  title?: string
  description?: string | null
  category?: string
  type?: string
  dresscode?: string | null
  date?: Date
  time?: string
  duration?: string
  location?: string
  maxAttendees?: number | null
  attendees?: number
  status?: EventStatus
  featured?: boolean
  host?: string | null
  requirements?: string | null
  materials?: string | null
  registrationUrl?: string | null
  meetingUrl?: string | null
  isPublic?: boolean
  requiresRSVP?: boolean
  registrationDeadline?: Date
  allowMultipleTickets?: boolean
  salesStartDate?: Date | null
  salesEndDate?: Date | null
}

// Event with computed ticket stats
export interface IEventWithStats extends Event {
  totalTickets: number
  ticketsSold: number
  ticketsAvailable: number
  totalRevenue: number
  hasTickets: boolean
  isSoldOut: boolean
  isOnSale: boolean
}

export interface EventFormProps extends IForm {
  eventId?: string
}

export interface EventDetailsFormProps extends IForm {
  onEventCreated: (eventId: string) => void
  createdEventId: string | null
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
    type: string
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

export interface EventTemplatesProps {
  onSelectTemplate: (templateData: EventTemplate['data']) => void
}

// Helper functions
export const isEventOnSale = (event: IEvent): boolean => {
  const now = new Date()
  const salesStart = event.salesStartDate ? new Date(event.salesStartDate) : null
  const salesEnd = event.salesEndDate ? new Date(event.salesEndDate) : null

  if (salesStart && now < salesStart) return false
  if (salesEnd && now > salesEnd) return false

  return true
}

export const isEventUpcoming = (event: IEvent): boolean => {
  return event.status === EventStatus.UPCOMING && new Date(event.date) > new Date()
}

export const isEventPast = (event: IEvent): boolean => {
  return event.status === EventStatus.COMPLETED || new Date(event.date) < new Date()
}

export const getEventStatus = (event: IEvent): string => {
  const eventDate = new Date(event.date)
  const now = new Date()

  if (event.status === EventStatus.CANCELLED) return 'Cancelled'
  if (event.status === EventStatus.POSTPONED) return 'Postponed'
  if (eventDate < now) return 'Past'
  if (event.status === EventStatus.ONGOING) return 'Ongoing'
  return 'Upcoming'
}
