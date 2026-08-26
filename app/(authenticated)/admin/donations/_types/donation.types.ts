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
  lifetimeAmount: number
  cycleCount: number
  cycles: { id: string; totalAmount: number; status: string; createdAt: Date; paidAt: Date | null }[]
  firstPaidAt: string
}
