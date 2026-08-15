import type { JsonValue } from '@prisma/client/runtime/library'
import type { IOrderItem } from './order-item'
import type { Campaign, Event } from '@prisma/client'
import type { UserWithAddress } from '../user.types'

export type OrderType = 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE'
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'FAILED'
  | 'PENDING_CANCELLATION'

export interface IOrder {
  attendingEvent: boolean
  id: string
  createdAt: Date
  updatedAt: Date

  // Classification
  type: OrderType
  status: OrderStatus

  // Financials
  totalAmount: number
  coverFees: boolean
  feesCovered: number

  // Payment processing
  paymentMethod: string | null
  paymentMethodId?: string | null
  paymentIntentId: string | null
  paidAt: Date | null

  // Failure info
  failureReason?: string | null
  failureCode?: string | null

  // Customer
  customerEmail: string
  customerName: string
  customerPhone: string | null
  billingAddress: Record<string, any> | null | JsonValue
  notes?: string | null

  // Recurring
  isRecurring?: boolean
  recurringFrequency?: string | null
  stripeSubscriptionId?: string | null
  nextBillingDate?: Date | null

  // Relations
  userId: string | null
  user?: UserWithAddress

  eventId?: string | null
  event?: Event

  campaignId?: string | null
  campaign?: Campaign

  orderItems?: IOrderItem[]
}
