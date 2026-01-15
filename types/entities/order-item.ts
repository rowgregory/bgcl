// lib/types/index.ts

import { Order } from './order'
import { Ticket } from './ticket'

export interface OrderItem {
  id: string
  createdAt: Date
  quantity: number
  pricePerUnit: number
  totalPrice: number
  ticketName: string
  ticketDescription: string | null
  orderId: string
  ticketId: string
  ticket?: Ticket
  order?: Order
}

export type CreateOrderItemInput = Omit<OrderItem, 'id' | 'createdAt' | 'ticket' | 'order'>

export type UpdateOrderItemInput = Partial<CreateOrderItemInput> & { id: string }
