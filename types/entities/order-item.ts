import type { IOrder } from './order'
import type { TicketWithEvent } from '../ticket.types'

export interface IOrderItem {
  id: string
  createdAt: Date

  // Pricing
  quantity: number
  pricePerUnit: number
  totalPrice: number

  // Denormalized ticket info
  ticketName: string
  ticketDescription?: string | null

  // Relations
  orderId: string
  order?: IOrder

  ticketId: string
  ticket?: TicketWithEvent
}
