import { PartnerCategory, PartnerTier } from '@prisma/client'

export interface IPartner {
  id: string
  name: string
  externalLink?: string
  amount?: string | null
  image?: string | null
  description?: string | null
  isActive: boolean
  isFeatured?: boolean
  category?: PartnerCategory
  notes?: string | null
  order: number
  tier?: PartnerTier
  createdAt: Date
  updatedAt: Date
}

export interface CreatePartnerInputs {
  name: string
  externalLink?: string
  amount?: string
  image?: string
  description?: string
  isActive: boolean
  isFeatured?: boolean
  category: PartnerCategory | ''
  tier: PartnerTier | ''
  order: number
}

export interface UpdatePartnerInputs {
  id: string
  name: string
  externalLink?: string
  amount?: string
  image?: string
  description?: string
  isActive: boolean
  isFeatured?: boolean
  category: PartnerCategory | ''
  tier: PartnerTier | ''
  order: number
}

export const PARTNER_TIERS: { value: PartnerTier; label: string }[] = [
  { value: 'FOUNDATION', label: 'Foundation' },
  { value: 'CORPORATE_BUSINESS', label: 'Corporate & Business' },
  { value: 'GOVERNMENT_PUBLIC', label: 'Government & Public' },
  { value: 'COMMUNITY_PROGRAM', label: 'Community & Program' }
]
