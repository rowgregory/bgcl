export const initialOrderItemState = {
  id: '',
  createdAt: new Date(),

  // Pricing
  quantity: 1,
  pricePerUnit: 0,
  totalPrice: 0,

  // Ticket info
  ticketName: '',
  ticketDescription: null,

  // Relations
  orderId: '',
  ticketId: '',

  // Raffle
  raffleTicketNumber: null,
  raffleTicketCode: null
}
