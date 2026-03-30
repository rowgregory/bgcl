import { ITicket } from '@/types/entities/ticket'

export function getTicketStatus(ticket: ITicket): {
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
