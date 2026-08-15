import { z } from 'zod'
import { isValidPhoneNumber, isValidZipPostalCode } from '../utils/regex'

export const ticketCheckoutSchema = z.object({
  // Contact — collected in the earlier wizard steps
  firstName: z.string().trim().min(1, { error: 'Please enter a first name' }),
  lastName: z.string().trim().min(1, { error: 'Please enter a last name' }),
  email: z.email({ error: 'Please enter a valid email address' }),
  phone: z
    .string()
    .trim()
    .refine((value) => isValidPhoneNumber(value), { error: 'Please enter a valid phone number' }),

  // Billing address
  addressLine1: z.string().trim().min(1, { error: 'Please enter a street address' }),
  addressLine2: z.string().trim().nullish(),
  city: z.string().trim().min(1, { error: 'Please enter a city' }),
  state: z.string().trim().min(1, { error: 'Please enter a state' }),
  zipPostalCode: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a ZIP code' })
    .refine((value) => isValidZipPostalCode(value), { error: 'Enter a valid ZIP code' }),

  // Payment
  selectedCardId: z.string().trim().nullish(),
  useNewCard: z.boolean().default(false),
  saveCard: z.boolean().default(false),
  coverFees: z.boolean().default(false),

  // Event
  attendingEvent: z.boolean().default(true)
})

export type TicketCheckoutFormInput = z.input<typeof ticketCheckoutSchema>
export type TicketCheckoutFormValues = z.output<typeof ticketCheckoutSchema>

export const EMPTY_TICKET_CHECKOUT: TicketCheckoutFormInput = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipPostalCode: '',
  selectedCardId: '',
  useNewCard: false,
  saveCard: false,
  coverFees: false,
  attendingEvent: true
}

// `cardComplete` is deliberately absent: Stripe Elements owns that state and it
// never reaches the server.
export const TICKET_CHECKOUT_NULLABLE_FIELDS = ['phone', 'addressLine2', 'selectedCardId'] as const
