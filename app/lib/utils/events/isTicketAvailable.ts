import { Ticket } from '@prisma/client'

export function isTicketAvailable(ticket: Ticket): boolean {
  const now = new Date()

  // Check if manually toggled off
  if (!ticket.isAvailable) return false

  // Check if sales haven't started
  if (ticket.salesStartDate && now < ticket.salesStartDate) return false

  // Check if sales have ended
  if (ticket.salesEndDate && now > ticket.salesEndDate) return false

  // Check if sold out
  if (ticket.quantitySold >= ticket.totalQuantity) return false

  return true
}

export default isTicketAvailable
