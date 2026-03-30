export interface IOrderItem {
  id: string
  createdAt: Date

  // Pricing
  quantity: number
  pricePerUnit: number
  totalPrice: number

  // Ticket info
  ticketName: string
  ticketDescription: string | null

  // Relations
  orderId: string
  ticketId: string

  // Raffle
  raffleTicketNumber: number | null
  raffleTicketCode: string | null
}
