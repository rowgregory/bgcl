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
    isPublished: boolean
    sortOrder: number
    ticketType: 'GENERAL' | 'RAFFLE' | 'TOURNAMENT' | 'SPONSORSHIP'
    isRaffleTicket: boolean
    sponsorImpact?: string | null
    sponsorPerks?: string[]
    guestCount: number
  }
}

export interface ITicket {
  ticketSalesEndDate: Date
  ticketSalesStartDate: Date
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

  sortOrder: number

  // Ticketing
  ticketType: 'GENERAL' | 'RAFFLE' | 'TOURNAMENT' | 'SPONSORSHIP'
  isRaffleTicket: boolean

  // Sponsorship
  sponsorImpact?: string | null
  sponsorPerks?: string[]

  // Relations
  eventId: string
  event?: IEvent
  eventTitle?: string
  orderItems?: IOrderItem[]

  guestCount: number
  isPublished: boolean
}

export interface UpdateTicketData {
  name?: string
  description?: string | null
  price?: number
  totalQuantity?: number
  sortOrder?: number
  ticketType?: 'GENERAL' | 'RAFFLE' | 'TOURNAMENT' | 'SPONSORSHIP'
  isRaffleTicket?: boolean
  sponsorImpact?: string | null
  sponsorPerks?: string[]
  guestCount: number
  isPublished: boolean
}

export interface CreateTicketInput {
  name: string
  description?: string | null
  price: number
  totalQuantity: number
  sortOrder?: number
  ticketType?: 'GENERAL' | 'RAFFLE' | 'TOURNAMENT' | 'SPONSORSHIP'
  isRaffleTicket?: boolean
  sponsorImpact?: string | null
  sponsorPerks?: string[]
  guestCount: number
  isPublished: boolean
}
