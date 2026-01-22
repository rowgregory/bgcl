'use server'

import { CampaignClient } from '@/app/components/pages/CampaignClient'
import { getCampaignById } from '@/app/lib/actions/getCampaignById'

export default async function CampaignPage({ params }) {
  const { id } = await params
  const { campaign } = await getCampaignById(id)
  return <CampaignClient campaign={campaign} />
}
