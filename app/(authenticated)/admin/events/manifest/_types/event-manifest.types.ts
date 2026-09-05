export type EventGroup = {
  eventId: string
  eventName: string
  eventDate: Date | null
  attendees: {
    orderId: string
    name: string
    email: string
    purchasedAt: Date
    totalTickets: number
    attendingEvent: boolean
    guestCount: number
  }[]
}

export type AttendeeLine = {
  ticketName: string
  quantity: number
  guestCount: number
}
