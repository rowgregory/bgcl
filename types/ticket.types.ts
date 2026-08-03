import type { ReactNode } from 'react'
import type { Ticket, OrderItem, Event } from '@prisma/client'
import type { TicketFormInput } from '@/lib/validations/ticket.validation'

export type { Ticket }

export type TicketWithEvent = Ticket & {
  event: Event
}

export type TicketWithOrderItems = Ticket & {
  orderItems: OrderItem[]
}

/** A preset that pre-fills the ticket editor. */
export interface TicketTemplate {
  id: string
  name: string
  icon: ReactNode
  description: string
  data: Partial<TicketFormInput>
}

export type SelectableTicket = Ticket & {
  eventTitle: string
  ticketSalesStartDate: Date | null
  ticketSalesEndDate: Date | null
}
