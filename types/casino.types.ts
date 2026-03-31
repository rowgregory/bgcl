import { CartItem } from '@/app/lib/store/slices/cartSlice'
import { IPaymentMethod } from './entities/payment-method'
import { ITicket } from './entities/ticket'

export type TPublicEventDetailsClient = {
  data: any
  name: { firstName: string; lastName: string }
  savedCards: IPaymentMethod[]
}

export type TCasinoEnhancedTickets = {
  tickets: ITicket[]
  id: string
  title: string
  ticketSalesEndDate: string
  ticketSalesStartDate: string
  registrationDeadline?: string
}

export type TCasinoWidgets = {
  data: TCasinoEnhancedTickets
}

export type TCasinoCartDropdown = {
  setOpen: (open: boolean) => void
  items: CartItem[]
  data: TCasinoEnhancedTickets
  open: boolean
}

export type TCasinoHero = {
  tagline: string
  title: string
  subtitle: string
  raffleGrandPrizeLabel: string
  date: Date
  location: string
  ticketSalesStartDate: string
  raffleDrawDate: string
}

export type TCasinoTicketMarquee = {
  tickets: ITicket[]
  eventId: string
  eventTitle: string
  ticketSalesStartDate: Date
  ticketSalesEndDate: Date
}

export type TCasinoSignInPrompt = {
  eventSlug: string
  name: { firstName: string; lastName: string } | null
  savedCards: IPaymentMethod[]
}

export type TCasinoSponsorTiers = {
  data: TCasinoEnhancedTickets
}
