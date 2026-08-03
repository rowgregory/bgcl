import { Ticket } from '@prisma/client'

export function getTicketStatus(ticket: Ticket): {
  available: boolean
  message: string
} {
  if (!ticket.isPublished) {
    return { available: false, message: 'Not available' }
  }

  if (ticket.quantitySold >= ticket.totalQuantity) {
    return { available: false, message: 'Sold out' }
  }

  return { available: true, message: 'Available' }
}
