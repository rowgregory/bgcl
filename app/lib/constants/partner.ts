import { PartnerCategory, PartnerTier } from '@/types/entities/partner'

export const initialPartnerFormState = {
  name: '',
  externalLink: '',
  amount: '',
  image: '',
  description: '',
  isActive: true,
  isFeatured: false,
  category: '' as PartnerCategory | '',
  tier: '' as PartnerTier | '',
  order: 0
}
