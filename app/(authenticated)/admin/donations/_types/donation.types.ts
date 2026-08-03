import { Campaign, Order } from '@prisma/client'

export interface BillingAddress {
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  zipPostalCode?: string | null
  country?: string | null
}

export type DonationWithRelations = Omit<Order, 'feesCovered' | 'billingAddress'> & {
  feesCovered: number
  billingAddress: BillingAddress | null
  campaign: Campaign | null
}
