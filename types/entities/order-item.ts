import { IOrder } from './order'
import { TicketWithEvent } from '../ticket.types'

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
