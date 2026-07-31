import CampaignsClient from '@/app/(public)/campaigns/CampaignsClient'
import { getCampaigns } from '@/lib/actions/campaign/getCampaigns'
import { getPageBySlugClient } from '@/lib/actions/page/getPageBySlugClient'

export default async function PublicCampaignsPage() {
  const [campaigns, pageData] = await Promise.all([getCampaigns(true), getPageBySlugClient('campaign')])
  return <CampaignsClient campaigns={campaigns} pageData={pageData} />
}
