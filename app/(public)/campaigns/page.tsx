import CampaignsClient from '@/app/components/pages/CampaignsClient'
import { getCampaigns } from '@/app/lib/actions/campaign/getCampaigns'
import { getPageBySlugClient } from '@/app/lib/actions/page/getPageBySlugClient'

export default async function PublicCampaignsPage() {
  const [campaigns, pageData] = await Promise.all([getCampaigns(true), getPageBySlugClient('campaign')])
  return <CampaignsClient campaigns={campaigns} pageData={pageData} />
}
