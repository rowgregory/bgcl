import { Ticket } from '@prisma/client'

export function getTicketStatus(ticket: Ticket): {
  available: boolean
  message: string
} {
  const now = new Date()

  if (!ticket.isAvailable) {
    return { available: false, message: 'Not available' }
  }

  if (ticket.salesStartDate && now < ticket.salesStartDate) {
    return {
      available: false,
      message: `Sales start ${ticket.salesStartDate.toLocaleDateString()}`
    }
  }

  if (ticket.salesEndDate && now > ticket.salesEndDate) {
    return { available: false, message: 'Sales ended' }
  }

  if (ticket.quantitySold >= ticket.totalQuantity) {
    return { available: false, message: 'Sold out' }
  }

  return { available: true, message: 'Available' }
}

export default getTicketStatus
