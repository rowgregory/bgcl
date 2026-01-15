import { Event, EventStatus, Ticket } from '@prisma/client'

export const isEventUpcoming = (event: Event): boolean => {
  return event.status === EventStatus.UPCOMING && new Date(event.date) > new Date()
}

export const isEventPast = (event: Event): boolean => {
  return event.status === EventStatus.COMPLETED || new Date(event.date) < new Date()
}

export const getEventStatus = (event: Event): string => {
  const eventDate = new Date(event.date)
  const now = new Date()

  if (event.status === EventStatus.CANCELLED) return 'Cancelled'
  if (event.status === EventStatus.POSTPONED) return 'Postponed'
  if (eventDate < now) return 'Past'
  if (event.status === EventStatus.ONGOING) return 'Ongoing'
  return 'Upcoming'
}

export function getTicketStatus(ticket: Ticket): {
  available: boolean
  message: string
} {
  if (!ticket.isAvailable) {
    return { available: false, message: 'Not available' }
  }

  if (ticket.quantitySold >= ticket.totalQuantity) {
    return { available: false, message: 'Sold out' }
  }

  return { available: true, message: 'Available' }
}

export const getEventStatusBadge = (status: string) => {
  switch (status) {
    case 'on-sale':
      return {
        text: 'On Sale',
        color: 'bg-green-500/20 text-green-400 border-green-500/30'
      }
    case 'sold-out':
      return {
        text: 'Sold Out',
        color: 'bg-red-500/20 text-red-400 border-red-500/30'
      }
    case 'low-availability':
      return {
        text: 'Low Availability',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      }
    default:
      return {
        text: 'Draft',
        color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
      }
  }
}
