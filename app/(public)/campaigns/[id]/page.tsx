'use server'

import { CampaignClient } from '@/app/components/pages/CampaignClient'
import { getCampaignById } from '@/app/lib/actions/getCampaignById'

export default async function CampaignPage({ params }) {
  const { id } = await params
  const { campaign } = await getCampaignById(id)
  // if (!campaign) {
  //   return <div className="text-center py-20">Campaign not found</div>
  // }
  return <CampaignClient campaign={campaign} />
}
