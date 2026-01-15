import { OrderItem } from './order-item'

export interface TicketPayload {
  name: string
  description: string
  price: number
  totalQuantity: number
  sortOrder: number
}

export interface EditTicketPayload {
  name: string
  id: string
  createdAt: Date
  updatedAt: Date
  description: string | null
  price: number
  totalQuantity: number
  quantitySold: number
  quantityReserved: number
  isAvailable: boolean
  sortOrder: number
  eventId: string
}

export interface TicketTemplate {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  data: {
    name: string
    description: string
    price: number
    totalQuantity: number
    quantitySold?: number
    quantityReserved?: number
    isAvailable: boolean
    sortOrder: number
  }
}

export interface Ticket {
  id: string
  createdAt: Date
  updatedAt: Date

  // Ticket details
  name: string
  description: string | null
  price: number

  // Inventory management
  totalQuantity: number
  quantitySold: number
  quantityReserved: number

  // Ticket availability
  isAvailable: boolean

  // Ticket metadata
  sortOrder: number

  // Relations
  eventId: string
  orderItems?: OrderItem[]
}

export type CreateTicketInput = Omit<
  Ticket,
  'id' | 'createdAt' | 'updatedAt' | 'quantitySold' | 'quantityReserved' | 'orderItems'
>

export type UpdateTicketInput = Partial<CreateTicketInput> & { id: string }
