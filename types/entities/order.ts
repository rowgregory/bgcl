// lib/types/order.ts

import { OrderItem } from './order-item'
import { IUser } from './user'

export interface Order {
  id: string
  createdAt: Date
  updatedAt: Date

  // Order type
  type: 'DONATION' | 'TICKET_PURCHASE'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

  // Payment
  totalAmount: number
  paymentMethod: string | null
  paymentIntentId: string | null
  paidAt: Date | null

  // Customer info
  customerEmail: string
  customerName: string
  customerPhone: string | null

  // Billing info
  billingAddress: Record<string, any> | null

  // Event info (only for ticket purchases)
  eventId: string | null

  // User info (nullable - guest checkout allowed)
  userId: string | null

  // Harness specific
  harnessPaymentId: string | null
  harnessTransactionId: string | null

  // Relations
  orderItems?: OrderItem[]
  event?: Event
  user?: IUser
}

export interface CreateOrderInput {
  type: 'DONATION' | 'TICKET_PURCHASE'
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  totalAmount: number
  paymentMethod?: string | null
  paymentIntentId?: string | null
  paidAt?: Date | null
  customerEmail: string
  customerName: string
  customerPhone?: string | null
  billingAddress?: Record<string, any> | null
  eventId?: string | null
  userId?: string | null
  harnessPaymentId?: string | null
  harnessTransactionId?: string | null
}

export interface UpdateOrderInput extends Partial<CreateOrderInput> {
  id: string
}
