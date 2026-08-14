import { z } from 'zod'
import { PartnerCategory, PartnerTier } from '@prisma/client'

export const partnerSchema = z.object({
  name: z.string().trim().min(1, { error: 'Please enter a partner name' }),
  externalLink: z.string().trim().nullish(),
  amount: z.string().trim().nullish(),
  image: z.string().trim().nullish(),
  description: z.string().trim().nullish(),
  notes: z.string().trim().nullish(),

  category: z.enum(PartnerCategory).nullish(),
  tier: z.enum(PartnerTier).nullish(),

  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false)
})

export type PartnerFormInput = z.input<typeof partnerSchema>
export type PartnerFormValues = z.output<typeof partnerSchema>

export const EMPTY_PARTNER: PartnerFormInput = {
  name: '',
  externalLink: '',
  amount: '',
  image: '',
  description: '',
  notes: '',

  category: undefined,
  tier: undefined,

  isActive: true,
  isFeatured: false
}

export const PARTNER_NULLABLE_FIELDS = ['externalLink', 'amount', 'image', 'description', 'notes'] as const

export const PARTNER_TIERS: { value: PartnerTier; label: string }[] = [
  { value: 'FOUNDATION', label: 'Foundation' },
  { value: 'CORPORATE_BUSINESS', label: 'Corporate & Business' },
  { value: 'GOVERNMENT_PUBLIC', label: 'Government & Public' },
  { value: 'COMMUNITY_PROGRAM', label: 'Community & Program' }
]
