import { CreatePartnerInputs, UpdatePartnerInputs } from '@/types/entities/partner'
import { PartnerCategory, PartnerTier } from '@prisma/client'

export function sanitizePartnerData(data: CreatePartnerInputs | UpdatePartnerInputs) {
  return {
    name: data?.name.trim(),
    externalLink: data?.externalLink?.trim() || '',
    amount: data?.amount?.trim() || null,
    image: data?.image?.trim() || null,
    description: data?.description?.trim() || null,
    isActive: data?.isActive,
    isFeatured: data?.isFeatured || false,
    category: (data?.category || null) as PartnerCategory | null,
    tier: (data?.tier || null) as PartnerTier | null,
    order: Number(data?.order) || 0
  }
}
