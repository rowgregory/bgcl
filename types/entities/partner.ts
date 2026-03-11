export type PartnerTier = 'GOLD' | 'SILVER' | 'BRONZE' | 'COMMUNITY'
export type PartnerCategory = 'CORPORATE' | 'NONPROFIT' | 'GOVERNMENT' | 'INDIVIDUAL'

export interface IPartner {
  id: string
  name: string
  externalLink: string
  amount?: string | null
  image?: string | null
  description?: string | null
  isActive: boolean
  isFeatured: boolean
  category: PartnerCategory
  notes?: string | null
  order: number
  tier: PartnerTier
  createdAt: Date
  updatedAt: Date
}

export interface PartnerFormData {
  name: string
  externalLink: string
  amount?: string
  image?: string
  description?: string
  isActive: boolean
  isFeatured: boolean
  category: PartnerCategory | ''
  tier: PartnerTier | ''
  order: number
}
