'use server'

import { CampaignClient } from '@/app/(public)/campaigns/[id]/CampaignClient'
import { getCampaignById } from '@/app/lib/actions/campaign/getCampaignById'

export default async function CampaignPage({ params }) {
  const { id } = await params
  const { campaign } = await getCampaignById(id)
  return <CampaignClient campaign={campaign} />
}
