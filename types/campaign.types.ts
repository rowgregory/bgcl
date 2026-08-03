import type { Campaign } from '@prisma/client'

// Campaign with the order count, for list views that request it
export type CampaignWithCount = Campaign & {
  _count: { orders: number }
}
