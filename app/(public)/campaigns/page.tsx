import CampaignsClient from '@/app/components/pages/CampaignsClient'
import { getCampaigns } from '@/app/lib/actions/getCampaigns'

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()
  return <CampaignsClient campaigns={campaigns} />
}
