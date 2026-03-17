import { IEvent } from './event'
import { IOrderItem } from './order-item'

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

export interface ITicket {
  id: string
  createdAt: Date
  updatedAt: Date

  // Details
  name: string
  description?: string | null
  price: number

  // Inventory
  totalQuantity: number
  quantitySold: number
  quantityReserved: number

  // Availability
  isAvailable: boolean
  sortOrder: number

  // Relations
  eventId: string
  event?: IEvent
  eventTitle?: string
  orderItems?: IOrderItem[]
}
