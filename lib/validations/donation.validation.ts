import { z } from 'zod'

export const DONATION_TYPES = ['once', 'monthly', 'yearly'] as const
export type DonationType = (typeof DONATION_TYPES)[number]

export const donationSchema = z.object({
  // Donor
  firstName: z.string().trim().min(1, { error: 'Please enter a first name' }),
  lastName: z.string().trim().min(1, { error: 'Please enter a last name' }),
  phone: z.string().trim().nullish(),

  // Gift
  donationType: z.enum(DONATION_TYPES, { error: 'Please choose a donation frequency' }),
  amount: z.coerce.number().gte(5, { error: 'Minimum donation is $5' }),
  coverFees: z.boolean().default(false),
  campaignId: z.string().trim().nullish(),
  notes: z.string().trim().nullish(),
  selectedPlan: z.string().trim().min(1, { error: 'Please choose an amount' }),

  // Payment
  selectedCardId: z.string().trim().nullish(),
  useNewCard: z.boolean().default(false),
  saveCard: z.boolean().default(false),

  // Billing address
  addressLine1: z.string().trim().min(1, { error: 'Please enter a street address' }),
  addressLine2: z.string().trim().nullish(),
  city: z.string().trim().min(1, { error: 'Please enter a city' }),
  state: z.string().trim().min(1, { error: 'Please enter a state' }),
  zipPostalCode: z.string().trim().min(1, { error: 'Please enter a ZIP code' })
})

export type DonationFormInput = z.input<typeof donationSchema>
export type DonationFormValues = z.output<typeof donationSchema>

export const EMPTY_DONATION: DonationFormInput = {
  firstName: '',
  lastName: '',
  phone: '',
  donationType: 'once',
  coverFees: false,
  campaignId: '',
  notes: '',
  selectedCardId: '',
  saveCard: false,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipPostalCode: '',
  selectedPlan: 'once_friend',
  amount: 50
}

export const DONATION_NULLABLE_FIELDS = ['phone', 'campaignId', 'notes', 'selectedCardId', 'addressLine2'] as const
