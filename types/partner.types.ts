import type { Partner, PartnerCategory, PartnerTier } from '@prisma/client'

export type { Partner, PartnerCategory, PartnerTier }

export type PartnerDrawerPayload = {
  tier: PartnerTier
  partner?: Partner
}
