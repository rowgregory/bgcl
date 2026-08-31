import { z } from 'zod'
import { TicketType } from '@prisma/client'

export const ticketSchema = z.object({
  name: z.string().trim().min(1, { error: 'Please enter a ticket name' }),
  description: z.string().trim().nullish(),
  price: z.coerce.number().gte(0, { error: 'Price must be 0 or greater' }),
  totalQuantity: z.coerce.number().int().gte(0, { error: 'Quantity must be 0 or greater' }),
  ticketType: z.enum(TicketType).default('GENERAL'),
  isRaffleTicket: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  guestCount: z.coerce.number().int().min(0, { error: 'Guest count cannot be negative' }).default(1),
  sponsorImpact: z.string().trim().nullish(),
  sponsorPerks: z.array(z.string()).default([])
})

export type TicketFormInput = z.input<typeof ticketSchema>
export type TicketFormValues = z.output<typeof ticketSchema>
